using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderService.Models;
using OrderService.Data;
using System.Threading.Tasks;
using System.Net.Http.Json;
using OrderService.Services;

namespace OrderService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersServiceController : ControllerBase
    {
        private readonly OrderDbContext _db;
        private readonly IHttpClientFactory _httpFactory;
        private readonly CartService _cartService;
        

        public OrdersServiceController(OrderDbContext db, IHttpClientFactory httpFactory)
        {
            _db = db;
            _httpFactory = httpFactory;
            _cartService = new CartService(db, httpFactory);
        }





        // Add Item to Cart Endpoint
        [HttpPost("cart/add")]
        public async Task<IActionResult> AddToCart(MenuDTO dto)
        {
            try
            {
                var cart = await _cartService.AddItem(
                    dto.id,
                    dto.userId,
                    dto.variantId,
                    dto.price,
                    dto.quantity,
                    dto.specialInstructions
                    );

                return Ok(cart);
                
            } catch (Exception ex)
            {
                return BadRequest(new {message = ex.Message});
            }
        }

        // View the Cart
        [HttpGet("cart/user/{userId}")]
        public async Task<IActionResult> ViewCart(int userId)
        {
            var cart = await _cartService.ViewCart(userId);
            if (cart == null) return NotFound(new { message = "Cart not found." });

            return Ok(cart);
        }

        // Remove Cart Item
        [HttpDelete("cart/item/{cartItemId}")]
        public async Task<IActionResult> RemoveItemFromCart(int cartItemId)
        {
            var cart = await _cartService.RemoveItem(cartItemId);
            if (cart == null)
                return NotFound(new { message = "Item or cart is not found." });

            return Ok(cart);
        }



        // GET /api/carts
        [HttpGet("carts")]
        public async Task<IActionResult> GetAllCarts()
        {
            var carts = await _db.Cart.ToListAsync();
            return Ok(carts);
        }

        // GET /api/cartitems
        [HttpGet("cartitems")]
        public async Task<IActionResult> GetAllCartItems()
        {
            var items = await _db.CartItem.ToListAsync();
            return Ok(items);
        }

        // GET /api/orders
        [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _db.Orders.ToListAsync();
            return Ok(orders);
        }

        // GET /api/orderitems
        [HttpGet("orderitems")]
        public async Task<IActionResult> GetAllOrderItems()
        {
            var items = await _db.OrderItem.ToListAsync();
            return Ok(items);
        }

        // GET /api/cart via ID
        [HttpGet("cart/{id}")]
        public async Task<IActionResult> GetCartById(int id)
        {
            var cart = await _db.Cart.FindAsync(id);
            if (cart == null) return NotFound();
            return Ok(cart);
        }

        // GET /api/cartitem via ID
        [HttpGet("cartitem/{id}")]
        public async Task<IActionResult> GetCartItemById(int id)
        {
            var item = await _db.CartItem.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // GET /api/orders via ID
        [HttpGet("orders/{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _db.Orders.FindAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        // GET /api/orderitem via ID
        [HttpGet("orderitem/{id}")]
        public async Task<IActionResult> GetOrderItemById(int id)
        {
            var item = await _db.OrderItem.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }



    }
}
