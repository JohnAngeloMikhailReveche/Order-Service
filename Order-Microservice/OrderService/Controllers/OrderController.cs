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
            if (request == null) return BadRequest(new { message = "Body is empty" });

            string role = request.UserRole?.ToLower() ?? "customer";
            if (role == "string") role = "customer"; 

            bool isCustomer = role == "customer";

            if (request.NewStatus == OrderStatus.Cancelled && isCustomer && string.IsNullOrWhiteSpace(request.Reason))
            {
                return BadRequest(new { message = "Customers MUST provide a reason to request cancellation!" });
            }

            request.UserRole = role;

            var result = await _statusService.UpdateStatusAsync(request);
            if (result.Contains("success") || result.Contains("submitted")) return Ok(new { message = result });
            return BadRequest(new { message = result });
        }

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
                    o.placed_at
                }).ToListAsync();

            if (!pending.Any()) return Ok(new { message = "No pending drama! The vibes are immaculate. ✨" });
            return Ok(pending);
        }

        [HttpPost("admin/review-cancellation")]
        public async Task<IActionResult> ReviewCancellation([FromBody] AdminCancellationReviewDto review)
        {
            var order = await _context.Orders.FindAsync(review.OrderId);
            if (order == null) return NotFound(new { message = "Order not found!" });

            if (review.Approve)
            {
                var dto = new OrderStatusDto
                {
                    OrderId = review.OrderId,
                    NewStatus = OrderStatus.Cancelled,
                    UserRole = "admin",
                    Reason = $"Approved Request: {order.cancellation_reason}"
                };
                await _statusService.UpdateStatusAsync(dto);
                return Ok(new { message = "Cancellation approved! Refund in progress." });
            }

            order.cancellation_requested = false;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Request declined! The kitchen is still cooking." });
        }
    }
}