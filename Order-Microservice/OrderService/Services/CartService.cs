using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.OpenApi.Models;
using OrderService.Data;
using OrderService.Models;

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
                int userId,
                int variantId,
                decimal price,
                int quantity,
                string specialInstructions
            )
        {
            // Quantity must be > 0
            if (quantity <= 0)
                throw new Exception("Quantity must be greater than 0.");

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
                && i.variant_id == variantId
            );

            if (existingItem != null)
            {
                existingItem.quantity += quantity;
            } else
            {
                cart.CartItems.Add(new CartItem
                {
                    menu_item_id = menuId,
                    variant_id = variantId,
                    quantity = quantity,
                    special_instructions = specialInstructions,
                    computed_subtotal = menuItem.price * quantity,
                });
            }

            // Recompute cart subtotal
            cart.subtotal = cart.CartItems.Sum(i => i.computed_subtotal);

            await _db.SaveChangesAsync();
            return cart;
        }

        public async Task<Cart> ViewCart(int userId)
        {
            return await _db.Cart
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.users_id == userId);
        }

        public async Task RemoveItem(int cartItemId)
        {
            var item = await _db.CartItem.FindAsync(cartItemId);
            if (item == null) return;

            var cart = await _db.Cart.Include(c => c.CartItems)
                .FirstAsync(c => c.cart_id == item.cart_id);

            _db.CartItem.Remove(item);

            // If cart becomes empty then keep cart but subtotal is 0.
            await _db.SaveChangesAsync();

            cart.subtotal = cart.CartItems.Sum(i => i.computed_subtotal);

            await _db.SaveChangesAsync();
        }

    }
}
