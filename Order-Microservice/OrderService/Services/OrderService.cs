using OrderService.Models;
using OrderService.Data;
using Microsoft.EntityFrameworkCore;


namespace OrderService.Services
{
    public class OrderStatusService
    {
        private readonly OrderDbContext _context;

        public OrderStatusService(OrderDbContext context)
        {
            _context = context;
        }

        public async Task<string> UpdateStatusAsync(OrderStatusDto dto)
        {
            // Step 1: Find the order
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.orders_id == dto.OrderId);

            if (order == null) return $"Order {dto.OrderId} not found.";

            // Step 2: Role check & Basic Security Logic
            string role = dto.UserRole?.ToLower() ?? "customer";

            // BRD Rule: Prevent moving status backwards
            if ((int)dto.NewStatus < (int)order.status)
            {
                return $"Order is already at {(OrderStatus)order.status}. " +
                       $"You can't move it back to {dto.NewStatus}.";
            }

            // Step 3: Role-based status transition logic
            switch (dto.NewStatus)
            {
                case OrderStatus.Preparing:
                case OrderStatus.ReadyForPickup:
                    if (role != "admin") return "Only admins can prep or set to ready!";
                    break;

                case OrderStatus.InTransit:
                case OrderStatus.Delivered:
                case OrderStatus.Failed:
                    if (role != "rider") return "Only riders can manage transit and delivery!";
                    break;

                case OrderStatus.Cancelled:
                    // Rule 4.2: Only admin can approve/set final cancellation
                    if (role != "admin") return "Only admins can officially cancel orders.";

                    // If moving to Cancelled, we assume the admin has reviewed the request
                    order.cancellation_requested = false;
                    break;
            }

            // Step 4: Handle Specific State Machine constraints
            if (order.status == (byte)OrderStatus.Delivered && dto.NewStatus == OrderStatus.Cancelled)
            {
                return "Order already delivered. Cannot cancel.";
            }

            // Step 5: Handling Customer Cancellation Requests (Rule 4.1)
            // If the DTO indicates a request for cancellation rather than a hard status change
            // OR if a customer tries to move status to Cancelled, we treat it as a request.
            if (dto.NewStatus == OrderStatus.Cancelled && role != "admin")
            {
                // Verify allowed statuses for request: Placed (1) or Preparing (2)
                if (order.status == (byte)OrderStatus.Placed || order.status == (byte)OrderStatus.Preparing)
                {
                    order.cancellation_requested = true;
                    order.cancellation_reason = dto.Reason ?? "No reason provided.";

                    await _context.SaveChangesAsync();
                    return $"Cancellation request submitted for Order {dto.OrderId}. Waiting for Admin approval.";
                }
                else
                {
                    return $"Cancellation requested failed. Order is already in {(OrderStatus)order.status} stage.";
                }
            }

            // Step 6: Update the fields for valid status changes
            order.status = (byte)dto.NewStatus;

            // Rule: Set fulfillment time for terminal states
            if (dto.NewStatus == OrderStatus.Delivered || dto.NewStatus == OrderStatus.Cancelled || dto.NewStatus == OrderStatus.Failed)
            {
                order.fulfilled_at = DateTime.UtcNow;
            }

            try
            {
                await _context.SaveChangesAsync();

                // Rule 4.2 Hint: If Cancelled, Payment Service call logic would trigger here
                string successEmoji = dto.NewStatus == OrderStatus.Cancelled ? "🛑" : "✨";
                return $"success! order {dto.OrderId} moved to {dto.NewStatus} by {role} {successEmoji}";
            }
            catch (Exception ex)
            {
                return $"db error: {ex.InnerException?.Message ?? ex.Message}";
            }
        }
    }
}