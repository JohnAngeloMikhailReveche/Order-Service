namespace OrderService.Models
{
    public class OrderItem
    {
        public int OrderItemId { get; set; }
        public int OrdersId { get; set; }
        public int MenuItemId { get; set; }
        public int Item_Variant_Id { get; set; }
        public string Item_Name { get; set; }
        public string Item_Description { get; set; }
        public string ImgUrl { get; set; }
        public string VariantName { get; set; }
        public decimal Variant_Price { get; set; }
        public int Quantity { get; set; }
        public string Special_Instructions { get; set; }
        public decimal Line_Subtotal { get; set; }
    }
}
