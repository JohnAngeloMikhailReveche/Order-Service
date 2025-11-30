namespace OrderService.Models
{
    public class Cart
    {
        public int CartId { get; set; }
        public int UsersId { get; set; }
        public decimal Subtotal { get; set; }
        public DateTime Updated_At { get; set; }
    }
}
