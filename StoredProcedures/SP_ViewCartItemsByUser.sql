CREATE PROCEDURE SP_ViewCartItemsByUser
	@UserId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT
		ci.cart_item_id,
		ci.item_name,
		ci.variant_name,
		ci.variant_price,
		ci.quantity,
		ci.img_url
	FROM Cart c
	INNER JOIN CartItem ci
		ON c.cart_id = ci.cart_id
	WHERE c.users_id = @UserId;
END
GO