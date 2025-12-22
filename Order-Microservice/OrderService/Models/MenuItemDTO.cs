namespace OrderService.Models
{
    public class MenuItemDTO
    {
        public int id { get; set; }
        public int userId { get; set; }
        public int variantId { get; set; }
        public string item_name { get; set; }
        public string item_description { get; set; }
        public string variant_name { get; set; }
        public int quantity { get; set; }
        public string specialInstructions { get; set; }
    }
}
