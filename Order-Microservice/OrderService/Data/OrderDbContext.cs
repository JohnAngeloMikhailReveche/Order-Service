using Microsoft.EntityFrameworkCore;
using OrderService.Models;

namespace OrderService.Data
{
    public class OrderDbContext : DbContext
    {
        public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options) { }

        // bringing the cart squad back to the party! 🛒✨
        public DbSet<Cart> Cart { get; set; }
        public DbSet<CartItem> CartItem { get; set; }

        // the order squad 📦
        public DbSet<Orders> Orders { get; set; }
        public DbSet<OrderItem> OrderItem { get; set; }
        public DbSet<OrderFeedback> OrderFeedback { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // primary keys for everything
            modelBuilder.Entity<Cart>().HasKey(c => c.cart_id);
            modelBuilder.Entity<CartItem>().HasKey(c => c.cart_item_id);
            modelBuilder.Entity<Orders>().HasKey(o => o.orders_id);
            modelBuilder.Entity<OrderItem>().HasKey(oi => oi.order_item_id);
            modelBuilder.Entity<OrderFeedback>().HasKey(of => of.order_feedback_id);

            // cart relationships 🛍️
            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Cart)
                .WithMany(c => c.CartItems)
                .HasForeignKey(ci => ci.cart_id)
                .OnDelete(DeleteBehavior.Cascade);

            // the order relationship fix that killed the ghost! 👻🚫
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.orders_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderFeedback>()
                .HasOne(of => of.Order)
                .WithMany(o => o.OrderFeedbacks)
                .HasForeignKey(of => of.orders_id)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}