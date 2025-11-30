namespace OrderService.Models
{
    public class Orders
    {
        public int OrdersId { get; set; }
        public int UsersId { get; set; }
        public int PaymentId { get; set; }
        public byte  Status {  get; set; }
        public decimal Subtotal { get; set; }
        public decimal Total_Cost { get; set; }
        public DateTime Placed_At { get; set; }
        public DateTime Fulfilled_At { get; set; }
        public bool Cancellation_Request { get; set; }
        public string Cancellation_Reason { get; set; }
        public string Payment_Method { get; set; }
    }
}
