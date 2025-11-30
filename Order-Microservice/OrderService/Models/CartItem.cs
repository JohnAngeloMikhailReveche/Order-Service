namespace OrderService.Models
{
    public class CartItem
    {
        public int CartItemId { get; set; }
        public int CartId { get; set; }
        public int MenuItemId { get; set; }
        public int VariantId { get; set; }
        public int Quantity { get; set; }
        public decimal Computed_Subtotal { get; set; }
        public string Special_Instruction { get; set; }
        public DateTime Added_At { get; set; }
    }
}
