using Microsoft.EntityFrameworkCore;
using OrderService.Models;

namespace OrderService.Data
{
    public class OrderDbContext : DbContext
    {
        public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options) { }


        // Add Models below
        public DbSet<Cart> Cart { get; set; }
        public DbSet<CartItem> CartItem { get; set; }
        public DbSet<Orders> Orders { get; set; }
        public DbSet<OrderItem> OrderItem { get; set; }

        // Configuration of primary keys and other model settings
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cart>()
                        .HasKey(c => c.cart_id);

            modelBuilder.Entity<CartItem>()
                        .HasKey(c => c.cart_item_id);

            modelBuilder.Entity<Orders>()
                        .HasKey(c => c.orders_id);

            modelBuilder.Entity<OrderItem>()
                        .HasKey(c => c.order_item_id);

            // To enforce Foreign Key for Cart Items
            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Cart)
                .WithMany(c => c.CartItems)
                .HasForeignKey(ci => ci.cart_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(ci => ci.Order)
                .WithMany(c => c.OrderItems)
                .HasForeignKey(ci => ci.orders_id)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }

    }

    
}
