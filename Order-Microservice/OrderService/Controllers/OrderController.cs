using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderService.Data;
using OrderService.DTOs;
using OrderService.Models;
using OrderService.Services;

namespace OrderService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderStatusService _statusService;
        private readonly OrderDbContext _context;

        public OrdersController(OrderStatusService statusService, OrderDbContext context)
        {
            _statusService = statusService;
            _context = context;
        }

        // CUSTOMER METHODS

        [HttpPost("request-cancellation")]
        public async Task<IActionResult> RequestCancellation([FromBody] CancellationRequestDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Reason))
                return BadRequest(new { message = "spill the tea, bestie! we need a reason to cancel. ☕" });

            var result = await _statusService.RequestCancellationAsync(request.OrderId, request.Reason);

            if (result.Contains("submitted")) return Ok(new { message = result });
            return BadRequest(new { message = result });
        }

        [HttpPatch("status")]
        public async Task<IActionResult> UpdateStatus([FromBody] OrderStatusDto request)
        {
            if (request == null) return BadRequest(new { message = "body is empty, sis!" });

            string role = request.UserRole?.ToLower() ?? "customer";
            if (role == "string") role = "customer";
            request.UserRole = role;

            var result = await _statusService.UpdateStatusAsync(request);
            if (result.Contains("success") || result.Contains("submitted")) return Ok(new { message = result });
            return BadRequest(new { message = result });
        }

        // SORTING & FILTERING 

        [HttpGet("history/{userId}")]
        public async Task<IActionResult> GetOrderHistory(
            int userId,
            [FromQuery] string filter = "all",
            [FromQuery] string sortOrder = "newest")
        {
            var query = _context.Orders
                .Where(o => o.users_id == userId)
                .AsQueryable();

            return await ApplyFiltersAndReturn(query, filter, sortOrder);
        }

        // ADMIN METHODS

        [HttpGet("admin/pending-cancellations")]
        public async Task<IActionResult> GetPendingCancellations()
        {
            var pending = await _context.Orders
                .Where(o => o.cancellation_requested)
                .Select(o => new {
                    o.orders_id,
                    o.users_id,
                    o.cancellation_reason,
                    Status = ((OrderStatus)o.status).ToString(),
                    o.total_cost,
                    o.item_count, // added for admin visibility!
                    o.placed_at
                }).ToListAsync();

            if (!pending.Any()) return Ok(new { message = "no pending drama! the vibes are immaculate. ✨" });
            return Ok(pending);
        }

        [HttpPost("admin/review-cancellation")]
        public async Task<IActionResult> ReviewCancellation([FromBody] AdminCancellationReviewDto review)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.orders_id == review.OrderId);
            if (order == null) return NotFound(new { message = "order not found" });

            if (review.Approve)
            {
                var dto = new OrderStatusDto
                {
                    OrderId = review.OrderId,
                    NewStatus = OrderStatus.Cancelled,
                    UserRole = "admin"
                };
                await _statusService.UpdateStatusAsync(dto);
                return Ok(new { message = "cancellation approved! refund in progress." });
            }

            order.cancellation_requested = false;
            await _context.SaveChangesAsync();
            return Ok(new { message = "request declined! the kitchen is still cooking." });
        }

        // --- 💎 SHARED HELPER LOGIC ---

        private async Task<IActionResult> ApplyFiltersAndReturn(IQueryable<Orders> query, string filter, string sortOrder)
        {
            switch (filter.ToLower())
            {
                case "ongoing":
                    query = query.Where(o => o.status >= 1 && o.status <= 4);
                    break;
                case "completed":
                    query = query.Where(o => o.status == 5);
                    break;
                case "cancelled":
                    query = query.Where(o => o.status == 7);
                    break;
            }

            if (sortOrder.ToLower() == "oldest")
                query = query.OrderBy(o => o.placed_at);
            else
                query = query.OrderByDescending(o => o.placed_at);

            var ordersList = await query.ToListAsync();

            var resultList = ordersList.Select(o => new {
                o.orders_id,
                o.users_id,
                o.total_cost,
                o.item_count, // passing the count from the cart service! 
                o.placed_at,
                o.fulfilled_at,
                StatusValue = o.status,
                StatusName = ((OrderStatus)o.status).ToString(),
                o.payment_method,
                o.cancellation_requested,
                o.cancellation_reason
            });

            if (!resultList.Any())
                return Ok(new { message = $"no {filter} orders found here! time to shop? 🛍️" });

            return Ok(resultList);
        }
    }
}