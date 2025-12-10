namespace MenuService.Model
{
    public class Menu
    {
        public int id { get; set; }
        public int userId { get; set; }
        public int variantId { get; set; }
        public decimal price { get; set; }
        public int quantity { get; set; }
        public string specialInstructions { get; set; }
    }
}
