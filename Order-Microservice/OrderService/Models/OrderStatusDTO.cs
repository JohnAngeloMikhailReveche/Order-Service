namespace OrderService.Models
{
    public class OrderStatusDto
    {
        public int OrderId { get; set; }
        public OrderStatus NewStatus { get; set; }
        public string? UserRole { get; set; }
    }
}