using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderService.Models;
using OrderService.Data;

namespace OrderService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersServiceController : ControllerBase
    {
        private readonly OrderDbContext _db;
        public OrdersServiceController(OrderDbContext db) { _db = db; }




        // GET /api/carts
        [HttpGet("Carts")]
        public async Task<IActionResult> GetAllCarts()
        {
            var carts = await _db.Cart.ToListAsync();
            return Ok(carts);
        }

        // GET /api/cartitems
        [HttpGet("CartItems")]
        public async Task<IActionResult> GetAllCartItems()
        {
            var items = await _db.CartItem.ToListAsync();
            return Ok(items);
        }

        // GET /api/orders
        [HttpGet("Orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _db.Orders.ToListAsync();
            return Ok(orders);
        }

        // GET /api/orderitems
        [HttpGet("OrderItems")]
        public async Task<IActionResult> GetAllOrderItems()
        {
            var items = await _db.OrderItem.ToListAsync();
            return Ok(items);
        }




    }
}
