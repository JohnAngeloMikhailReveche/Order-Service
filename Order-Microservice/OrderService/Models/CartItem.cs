namespace OrderService.Models
{
    public class CartItem
    {
        public int cart_item_id { get; set; }
        public int cart_id { get; set; }
        public int menu_item_id { get; set; }
        public int variant_id { get; set; }
        public int quantity { get; set; }
        public decimal computed_subtotal { get; set; }
        public string special_instructions { get; set; }
        public DateTime added_at { get; set; }

        // Navigation Property
        public Cart Cart { get; set; }
    }
}
