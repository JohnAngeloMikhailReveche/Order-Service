USE OrderServiceDb;
GO

-- ============================================
-- 1. REQUEST CANCELLATION
-- ============================================
CREATE PROCEDURE sp_RequestCancellation
    @OrderId INT, -- OrderId stays INT
    @Reason NVARCHAR(500),
    @ResultMessage NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF NOT EXISTS (SELECT 1 FROM Orders WHERE orders_id = @OrderId)
    BEGIN
        SET @ResultMessage = 'order not found';
        RETURN;
    END
    
    IF EXISTS (SELECT 1 FROM Orders WHERE orders_id = @OrderId AND cancellation_requested = 1)
    BEGIN
        SET @ResultMessage = 'Order cancellation already requested. Please wait for the admin to review.';
        RETURN;
    END
    
    DECLARE @CurrentStatus TINYINT;
    SELECT @CurrentStatus = status FROM Orders WHERE orders_id = @OrderId;
    
    IF @CurrentStatus > 2
    BEGIN
        SET @ResultMessage = 'Cannot cancel order. Order is already in progress.';
        RETURN;
    END
    
    UPDATE Orders
    SET cancellation_requested = 1,
        cancellation_reason = @Reason
    WHERE orders_id = @OrderId;
    
    SET @ResultMessage = 'Cancellation request submitted. Wait for the admin to review.';
END
GO

-- ============================================
-- 2. PLACE ORDER (Convert Cart to Order)
-- ============================================
CREATE PROCEDURE sp_PlaceOrder
    @UserId NVARCHAR(450), -- CHANGED to NVARCHAR for string userId
    @NewOrderId INT OUTPUT,
    @ResultMessage NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        DECLARE @CartId INT;
        DECLARE @CartSubtotal DECIMAL(10,2);
        DECLARE @ItemCount INT;
        
        SELECT @CartId = cart_id, 
               @CartSubtotal = subtotal
        FROM Cart 
        WHERE users_id = @UserId;
        
        IF @CartId IS NULL
        BEGIN
            SET @ResultMessage = 'Cart not found.';
            SET @NewOrderId = 0;
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        SELECT @ItemCount = COUNT(*) FROM CartItem WHERE cart_id = @CartId;
        
        IF @ItemCount = 0
        BEGIN
            SET @ResultMessage = 'Cart is empty.';
            SET @NewOrderId = 0;
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        INSERT INTO Orders (
            users_id, 
            status, 
            subtotal, 
            total_cost, 
            item_count, 
            placed_at, 
            payment_method, 
            cancellation_requested, 
            cancellation_reason,
            refund_status
        )
        VALUES (
            @UserId,
            1,
            @CartSubtotal,
            @CartSubtotal,
            @ItemCount,
            GETUTCDATE(),
            'Unpaid',
            0,
            'None',
            0
        );
        
        SET @NewOrderId = SCOPE_IDENTITY();
        
        INSERT INTO OrderItem (
            orders_id,
            menu_item_id,
            item_variant_id,
            item_name,
            item_description,
            variant_name,
            variant_price,
            quantity,
            line_subtotal,
            special_instructions
        )
        SELECT 
            @NewOrderId,
            ci.menu_item_id,
            ci.variant_id,
            ci.item_name,
            ci.item_description,
            ci.variant_name,
            ci.variant_price,
            ci.quantity,
            ci.variant_price * ci.quantity,
            ci.special_instructions
        FROM CartItem ci
        WHERE ci.cart_id = @CartId;
        
        DELETE FROM CartItem WHERE cart_id = @CartId;
        
        UPDATE Cart 
        SET subtotal = 0,
            updated_at = GETUTCDATE()
        WHERE cart_id = @CartId;
        
        SET @ResultMessage = 'Order placed successfully.';
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SET @ResultMessage = ERROR_MESSAGE();
        SET @NewOrderId = 0;
    END CATCH
END
GO

-- ============================================
-- 3. UPDATE ORDER STATUS
-- ============================================
CREATE PROCEDURE sp_UpdateOrderStatus
    @OrderId INT,
    @NewStatus TINYINT,
    @UserRole NVARCHAR(50),
    @ResultMessage NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @CurrentStatus TINYINT;
    DECLARE @CancellationRequested BIT;
    
    IF NOT EXISTS (SELECT 1 FROM Orders WHERE orders_id = @OrderId)
    BEGIN
        SET @ResultMessage = 'order not found.';
        RETURN;
    END
    
    SELECT @CurrentStatus = status,
           @CancellationRequested = cancellation_requested
    FROM Orders 
    WHERE orders_id = @OrderId;
    
    IF @NewStatus IN (2, 3) AND @UserRole != 'admin'
    BEGIN
        SET @ResultMessage = 'Only admins can prepare order.';
        RETURN;
    END
    
    IF @NewStatus IN (4, 5, 6) AND @UserRole != 'rider'
    BEGIN
        SET @ResultMessage = 'Only riders can deliver.';
        RETURN;
    END
    
    IF @NewStatus = 7 AND @UserRole != 'admin'
    BEGIN
        SET @ResultMessage = 'Only admins can officially confirm a cancellation.';
        RETURN;
    END
    
    IF @NewStatus < @CurrentStatus
    BEGIN
        SET @ResultMessage = 'Backward update not allowed.';
        RETURN;
    END
    
    UPDATE Orders
    SET status = @NewStatus,
        fulfilled_at = CASE 
            WHEN @NewStatus IN (5, 6, 7) THEN GETUTCDATE() 
            ELSE fulfilled_at 
        END,
        cancellation_requested = CASE 
            WHEN @NewStatus = 7 THEN 0 
            ELSE cancellation_requested 
        END,
        refund_status = CASE 
            WHEN @NewStatus = 7 THEN 1 
            ELSE refund_status 
        END,
        cancellation_reason = CASE 
            WHEN @NewStatus = 7 AND @CancellationRequested = 0 
            THEN 'The kitchen cancelled your order.' 
            ELSE cancellation_reason 
        END
    WHERE orders_id = @OrderId;
    
    SET @ResultMessage = 'Success. Order moved to new status.';
END
GO

-- ============================================
-- 4. GET ORDER DETAILS WITH ITEMS
-- ============================================
CREATE PROCEDURE sp_GetOrderDetails
    @OrderId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        orders_id as orderId,
        total_cost as subtotal,
        status,
        cancellation_requested
    FROM Orders
    WHERE orders_id = @OrderId;
    
    SELECT 
        NULL as imageUrl,
        item_name as name,
        quantity,
        variant_name as size,
        line_subtotal as total,
        special_instructions as specialInstructions
    FROM OrderItem
    WHERE orders_id = @OrderId;
END
GO

-- ============================================
-- 5. GET ORDER HISTORY (with filters)
-- ============================================
CREATE PROCEDURE sp_GetOrderHistory
    @UserId NVARCHAR(450) = NULL, -- CHANGED to NVARCHAR for string userId
    @Filter NVARCHAR(20) = 'all',
    @SortOrder NVARCHAR(20) = 'newest'
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        orders_id,
        users_id,
        total_cost,
        placed_at,
        fulfilled_at,
        item_count,
        status as StatusValue,
        CASE status
            WHEN 1 THEN 'Placed'
            WHEN 2 THEN 'Preparing'
            WHEN 3 THEN 'ReadyForPickup'
            WHEN 4 THEN 'InTransit'
            WHEN 5 THEN 'Delivered'
            WHEN 6 THEN 'Failed'
            WHEN 7 THEN 'Cancelled'
            ELSE 'Unknown'
        END as StatusName,
        payment_method,
        cancellation_requested,
        cancellation_reason
    FROM Orders
    WHERE (@UserId IS NULL OR users_id = @UserId)
      AND (
          @Filter = 'all' 
          OR (@Filter = 'ongoing' AND status BETWEEN 1 AND 4)
          OR (@Filter = 'completed' AND status = 5)
          OR (@Filter = 'cancelled' AND status = 7)
      )
    ORDER BY 
        CASE WHEN @SortOrder = 'oldest' THEN placed_at END ASC,
        CASE WHEN @SortOrder = 'newest' THEN placed_at END DESC;
END
GO

-- ============================================
-- 6. GET PENDING CANCELLATIONS (Admin)
-- ============================================
CREATE PROCEDURE sp_GetPendingCancellations
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        orders_id,
        users_id,
        cancellation_reason,
        item_count,
        CASE status
            WHEN 1 THEN 'Placed'
            WHEN 2 THEN 'Preparing'
            WHEN 3 THEN 'ReadyForPickup'
            ELSE 'Unknown'
        END as Status,
        total_cost,
        placed_at
    FROM Orders
    WHERE cancellation_requested = 1;
END
GO

-- ============================================
-- 7. REVIEW CANCELLATION (Approve/Decline)
-- ============================================
CREATE PROCEDURE sp_ReviewCancellation
    @OrderId INT,
    @Approve BIT,
    @UserRole NVARCHAR(50) = 'admin',
    @ResultMessage NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF NOT EXISTS (SELECT 1 FROM Orders WHERE orders_id = @OrderId)
    BEGIN
        SET @ResultMessage = 'Order not found.';
        RETURN;
    END
    
    IF @Approve = 1
    BEGIN
        EXEC sp_UpdateOrderStatus 
            @OrderId = @OrderId,
            @NewStatus = 7,
            @UserRole = @UserRole,
            @ResultMessage = @ResultMessage OUTPUT;
            
        SET @ResultMessage = 'Cancellation approved! Refund in progress.';
    END
    ELSE
    BEGIN
        UPDATE Orders
        SET cancellation_requested = 0
        WHERE orders_id = @OrderId;
        
        SET @ResultMessage = 'Request declined! The kitchen is still cooking.';
    END
END
GO