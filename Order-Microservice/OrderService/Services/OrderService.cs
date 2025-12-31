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

        public async Task<string> RequestCancellationAsync(int orderId, string reason)
        {
            if (string.IsNullOrWhiteSpace(reason))
                return "um, you can't leave us on read! a reason is REQUIRED to request a cancellation. 📝☕";

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.orders_id == orderId);
            if (order == null) return "order not found 💀";

            if (order.status > (byte)OrderStatus.Preparing)
                return $"too late bestie! order is already {(OrderStatus)order.status}. you can't cancel now! 🛵";

            order.cancellation_requested = true;
            order.cancellation_reason = reason;

            await _context.SaveChangesAsync();
            return "cancellation request submitted! wait for the admin to vibe check it. ⏳✨";
        }

        public async Task<string> UpdateStatusAsync(OrderStatusDto dto)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.orders_id == dto.OrderId);
            if (order == null) return $"order {dto.OrderId} not found.";

            string role = dto.UserRole?.ToLower() ?? "customer";
            if (role == "string") role = "customer";

            switch (dto.NewStatus)
            {
                case OrderStatus.Preparing:
                case OrderStatus.ReadyForPickup:
                    if (role != "admin") return "security!! only admins can prep! 📢";
                    break;
                case OrderStatus.InTransit:
                case OrderStatus.Delivered:
                case OrderStatus.Failed:
                    if (role != "rider") return "halt!! only riders can deliver! 🛵";
                    break;
                case OrderStatus.Cancelled:
                    if (role != "admin") return "only admins can officially confirm a cancellation. 🛑";

                    order.cancellation_requested = false;

                    // UPDATED: setting refund_status to 1 (Pending) since it's an int now! 💸🔢
                    order.refund_status = 1;

                    if (string.IsNullOrWhiteSpace(order.cancellation_reason))
                    {
                        order.cancellation_reason = !string.IsNullOrWhiteSpace(dto.Reason)
                            ? $"admin: {dto.Reason}"
                            : "cancelled by shop management. 🛑";
                    }
                    break;
            }

            if ((int)dto.NewStatus < (int)order.status)
                return $"u can't go backwards! already at {(OrderStatus)order.status}.";

            order.status = (byte)dto.NewStatus;

            if (dto.NewStatus == OrderStatus.Delivered || dto.NewStatus == OrderStatus.Cancelled || dto.NewStatus == OrderStatus.Failed)
                order.fulfilled_at = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return $"success! order {dto.OrderId} moved to {dto.NewStatus} ✨";
        }
    }
}