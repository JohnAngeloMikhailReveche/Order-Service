namespace OrderService.Models
{
    public class Orders
    {
        public int orders_id { get; set; }
        public int users_id { get; set; }
        public int payment_id { get; set; }
        public byte status {  get; set; }
        public decimal subtotal { get; set; }
        public decimal total_cost { get; set; }
        public DateTime placed_at { get; set; }
        public DateTime fulfilled_at { get; set; }
        public bool cancellation_requested { get; set; }
        public string cancellation_reason { get; set; }
        public string payment_method { get; set; }

        // Navigation Property
        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
