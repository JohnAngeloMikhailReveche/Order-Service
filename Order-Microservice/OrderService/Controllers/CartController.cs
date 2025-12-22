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
    public class CartController : ControllerBase
    {
        private readonly OrderDbContext _db;
        private readonly IHttpClientFactory _httpFactory;
        private readonly CartService _cartService;
        

        public CartController(OrderDbContext db, IHttpClientFactory httpFactory)
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


    }
}
