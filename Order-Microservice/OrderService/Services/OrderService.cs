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
            // step 1: find the order
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.orders_id == dto.OrderId);

            if (order == null) return $"Order {dto.OrderId} not found.";

            // No reverse validation
            if ((int)dto.NewStatus < (int)order.status)
            {
                return $"Order is already at {(OrderStatus)order.status}, " +
                       $"You can't move it back to {dto.NewStatus}.";
            }

            // step 2: role check & security logic
            string role = dto.UserRole?.ToLower() ?? "customer";

            // case: status transitions based on roles
            switch (dto.NewStatus)
            {
                // only admins can start the prep or set it to ready
                case OrderStatus.Preparing:
                case OrderStatus.ReadyForPickup:
                    if (role != "admin") return $"Only admins can prep or set to ready!";
                    break;

                // riders are the only ones who can start the journey and finish it
                case OrderStatus.InTransit:
                case OrderStatus.Delivered:
                case OrderStatus.Failed:
                    if (role != "rider") return $"Only riders can manage transit and delivery!";
                    break;

                // admins can cancel
                case OrderStatus.Cancelled:
                    if (role != "admin") return $"Only admins can officially cancel orders.";
                    break;
            }

            // step 3: state machine logic
            if (order.status == (byte)OrderStatus.Delivered && dto.NewStatus == OrderStatus.Cancelled)
            {
                return "Order already delivered.";
            }

            // step 4: handle cancellation requests
            if (dto.NewStatus == OrderStatus.Cancelled)
            {
                if (order.status == (byte)OrderStatus.Preparing && role != "admin")
                {
                    return "The kitchen is already cooking! Ask an admin to cancel manually.";
                }
            }

            // step 5: update the fields
            order.status = (byte)dto.NewStatus;

            if (dto.NewStatus == OrderStatus.Delivered || dto.NewStatus == OrderStatus.Cancelled || dto.NewStatus == OrderStatus.Failed)
            {
                order.fulfilled_at = DateTime.UtcNow;
            }

            try
            {
                await _context.SaveChangesAsync();
                return $"success! order {dto.OrderId} moved to {dto.NewStatus} by {role} ✨";
            }
            catch (Exception ex)
            {
                return $"db error: {ex.InnerException?.Message ?? ex.Message}";
            }
        }
    }
}