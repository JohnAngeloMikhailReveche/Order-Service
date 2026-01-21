CREATE PROCEDURE SP_ViewCart
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT
		c.cart_id
		, c.users_id
		, c.subtotal
		, c.updated_at
		, ci.cart_item_id
		, ci.item_name
		, ci.variant_name
		, ci.variant_price
		, ci.quantity
		, ci.img_url
	FROM Cart c
	LEFT JOIN CartItem ci
		ON c.cart_id = ci.cart_id
	WHERE c.users_id = @UserId;
END
GO