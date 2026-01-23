namespace OrderService.Models
{
    public class AddCartItemRequest
    {
        public int MenuItemID { get; set; }
        public int VariantId { get; set; }
        public int UserID { get; set; }
        public string SpecialInstructions { get; set; } = "";
    }
}
