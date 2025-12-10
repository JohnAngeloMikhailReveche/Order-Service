namespace OrderService.Models
{
    public class MenuDTO
    {
        public int id { get; set; }
        public int userId { get; set; }
        public int variantId { get; set; }
        public decimal price { get; set; }
        public int quantity { get; set; }
        public string specialInstructions { get; set; }
    }
}
