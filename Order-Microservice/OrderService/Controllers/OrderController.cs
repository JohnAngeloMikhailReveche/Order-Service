using Microsoft.AspNetCore.Mvc;
using OrderService.Models;
using OrderService.Services;
using OrderService.Data;
using Microsoft.EntityFrameworkCore;

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

        /// <summary>
        /// General status update endpoint. 
        /// Handles Customer Cancellation Requests (Rule 4.1) and Admin/Rider status changes.
        /// </summary>
        [HttpPatch("status")]
        public async Task<IActionResult> UpdateStatus([FromBody] OrderStatusDto request)
        {
            if (request == null)
                return BadRequest(new { message = "The request body is empty, bestie! I need details to work with." });

            // Rule 4.1 Validation: If a customer is trying to cancel, they MUST provide a reason.
            // We check if the role is customer or if no role is provided (defaulting to customer security)
            bool isCustomer = request.UserRole?.ToLower() == "customer" || string.IsNullOrEmpty(request.UserRole);

            if (request.NewStatus == OrderStatus.Cancelled && isCustomer && string.IsNullOrWhiteSpace(request.Reason))
            {
                return BadRequest(new { message = "You need to provide a reason for the cancellation request, bestie!" });
            }

            var result = await _statusService.UpdateStatusAsync(request);

            // The service returns "submitted" for requests and "success" for immediate updates
            if (result.Contains("success") || result.Contains("submitted"))
                return Ok(new { message = result });

            return BadRequest(new { message = result });
        }

        /// <summary>
        /// Rule 4.2: Admin view for all orders flagged for cancellation.
        /// Displays data using the new fields added to OrderDbContext.
        /// </summary>
        [HttpGet("admin/pending-cancellations")]
        public async Task<IActionResult> GetPendingCancellations()
        {
            var pendingCancellations = await _context.Orders
                .Where(o => o.cancellation_requested == true)
                .Select(o => new
                {
                    o.orders_id,
                    o.users_id,
                    o.status,
                    StatusName = ((OrderStatus)o.status).ToString(),
                    o.cancellation_reason,
                    o.total_cost,
                    o.placed_at
                })
                .ToListAsync();

            if (!pendingCancellations.Any())
                return Ok(new { message = "No pending cancellation requests. The vibes are immaculate! ✨" });

            return Ok(pendingCancellations);
        }

        /// <summary>
        /// Rule 4.2: Admin decision on a cancellation request.
        /// Approving sets status to Cancelled. Declining clears the request flag.
        /// </summary>
        [HttpPost("admin/review-cancellation")]
        public async Task<IActionResult> ReviewCancellation([FromBody] AdminCancellationReviewDto review)
        {
            var order = await _context.Orders.FindAsync(review.OrderId);
            if (order == null) return NotFound(new { message = "Order not found, bestie!" });

            if (!order.cancellation_requested)
                return BadRequest(new { message = "This order doesn't have a pending cancellation request." });

            if (review.Approve)
            {
                // Approve: Move status to Cancelled via the status service to trigger logs/logic
                var statusDto = new OrderStatusDto
                {
                    OrderId = review.OrderId,
                    NewStatus = OrderStatus.Cancelled,
                    UserRole = "admin",
                    Reason = "Approved by Admin: " + order.cancellation_reason
                };

                var result = await _statusService.UpdateStatusAsync(statusDto);
                if (result.Contains("success")) return Ok(new { message = "Cancellation approved! Refund processing initiated. 🛑" });
                return BadRequest(new { message = result });
            }
            else
            {
                // Decline: Clear the request flag so it disappears from the admin dashboard
                order.cancellation_requested = false;
                // Note: We keep the cancellation_reason in DB for history, but clear the active flag

                await _context.SaveChangesAsync();
                return Ok(new { message = "Cancellation request declined. The kitchen continues! 🍳" });
            }
        }
    }
}