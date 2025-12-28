using System;
using System.Collections.Generic;

namespace OrderService.Models
{
    public class Orders
    {
        public int orders_id { get; set; }
        public int users_id { get; set; }
        public byte status { get; set; }
        public decimal subtotal { get; set; }
        public decimal total_cost { get; set; }
        public DateTime placed_at { get; set; }

        // nullable because she's not fulfilled until she's DONE 💅
        public DateTime? fulfilled_at { get; set; }

        public string? payment_method { get; set; }
        public bool cancellation_requested { get; set; }
        public string? cancellation_reason { get; set; }

        // the squad (navigation properties) - virtual for lazy loading!
        public virtual ICollection<OrderItem>? OrderItems { get; set; }
        public virtual ICollection<OrderFeedback>? OrderFeedbacks { get; set; }
    }
}