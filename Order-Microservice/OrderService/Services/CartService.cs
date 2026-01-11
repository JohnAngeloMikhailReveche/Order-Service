using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.OpenApi.Models;
using OrderService.Data;
using OrderService.Models;
using OrderService.Models.DTO;

namespace OrderService.Services
{
    public class CartService
    {
        private readonly OrderDbContext _db;
        private readonly HttpClient _menuClient;

        public CartService(OrderDbContext db, IHttpClientFactory httpFactory)
        {
            _db = db;
            _menuClient = httpFactory.CreateClient("MenuService");
        }
        

        public async Task<Cart> AddItem (
                int menuId,
                int userId
            )
        {

            // Get /menu/item/{id}
            var menuItem = await _menuClient.GetFromJsonAsync<MenuDTO>($"/api/Menu/{menuId}");

            if (menuItem == null)
                throw new Exception("Item does not exist.");

            // Get user's cart or create user's cart
            var cart = await _db.Cart
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.users_id == userId);

            if (cart == null)
            {
                cart = new Cart { users_id = userId, subtotal = 0, CartItems = new List<CartItem>() };
                _db.Cart.Add(cart);
            }

            // If item exists in cart then increment quantity
            var existingItem = cart.CartItems.FirstOrDefault(i =>
                i.menu_item_id == menuId
                && i.variant_id == menuItem.variantId
            );

            if (existingItem != null)
            {
                existingItem.quantity += menuItem.quantity;
            } else
            {
                cart.CartItems.Add(new CartItem
                {
                    menu_item_id = menuId,
                    variant_id = menuItem.variantId,
                    item_name = menuItem.item_name,
                    item_description = menuItem.item_description,
                    img_url = menuItem.img_url,
                    variant_name = menuItem.variant_name,
                    variant_price = menuItem.variant_price,
                    quantity = menuItem.quantity,
                    computed_subtotal = menuItem.variant_price * menuItem.quantity,
                    special_instructions = menuItem.specialInstructions,
                    added_at = DateTime.Now
                });
            }

            // Recompute cart subtotal
            cart.subtotal = cart.CartItems.Sum(i => i.variant_price * i.quantity);

            await _db.SaveChangesAsync();
            return cart;
        }

        public async Task<Cart> ViewCart(int userId)
        {
            return await _db.Cart
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.users_id == userId);
        }

        public async Task<List<CartItemDTO>> ViewCartItems(int userId)
        {
            return await _db.Cart
                .Where(c => c.users_id == userId)
                .SelectMany(c => c.CartItems)
                .Select(item => new CartItemDTO
                {
                    cart_item_id = item.cart_item_id,
                    item_name = item.item_name,
                    variant_name = item.variant_name,
                    quantity = item.quantity,
                    img_url = item.img_url
                })
                .ToListAsync();
        }

        public async Task<Cart> RemoveItem(int userID, int cartItemID, int quantityToRemove)
        {
            // Get the cart item which belongs to the user through userID.
            var item = await _db.CartItem
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync( ci =>
                    ci.cart_item_id == cartItemID
                    &&
                    ci.Cart.users_id == userID
                );

            if (item == null) { return null; }

            // Reduce quantity
            item.quantity -= quantityToRemove;

            // Check if the item is 0 and if it is then we remove it to the cart.
            if (item.quantity <= 0)
            {
                _db.CartItem.Remove(item);
            }

            // Save it to the database
            await _db.SaveChangesAsync();

            // Reload the cart based on the updated items above.
            var cart = await _db.Cart
                .Include(c => c.CartItems)
                .FirstAsync(c => c.cart_id == item.cart_id);

            // Recalculate the cart subtotal
            cart.subtotal = cart.CartItems.Sum(i => i.variant_price * i.quantity);

            // Save changes to the database again.
            await _db.SaveChangesAsync();

            return cart;
        }

    }
}
