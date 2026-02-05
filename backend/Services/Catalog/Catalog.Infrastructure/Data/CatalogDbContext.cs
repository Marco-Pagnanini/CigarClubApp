using Catalog.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure.Data
{
    /// <summary>
    /// DbContext del servizio Catalog. Mappa le entity sul database Postgres.
    /// </summary>
    public class CatalogDbContext : DbContext
    {
        public DbSet<Tobacconist> Tobacconists { get; set; }
        public DbSet<Barcode> Barcodes { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Panel> Panels { get; set; }

        public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configura la relazione 1:N tra Tobacconist e Barcode
            modelBuilder.Entity<Tobacconist>()
                .HasMany(t => t.Barcodes)
                .WithOne()
                .HasForeignKey(b => b.TobacconistId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configura la relazione 1:N tra Brand e Panel
            modelBuilder.Entity<Brand>()
                .HasMany(b => b.Panels)
                .WithOne(p => p.Brand)
                .HasForeignKey(p => p.BrandId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configura la relazione opzionale 1:1 tra Tobacconist e Panel
            // Un Tobacconist può avere max un Panel (relazione uno-a-uno opzionale)
            // Un Panel deve avere un Brand, ma può avere facoltativamente un Tobacconist
            modelBuilder.Entity<Tobacconist>()
                .HasOne(t => t.Panel)
                .WithOne(p => p.Tobacconist)
                .HasForeignKey<Panel>(p => p.TobacconistId)
                .IsRequired(false) // Opzionale
                .OnDelete(DeleteBehavior.SetNull); // Se elimini Tobacconist, Panel rimane con TobacconistId = null
        }
    }
}
