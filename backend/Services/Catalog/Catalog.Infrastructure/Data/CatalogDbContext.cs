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

            // Configura la relazione N:1 tra Panel e Brand (senza navigazione inversa)
            modelBuilder.Entity<Panel>()
                .HasOne(p => p.Brand)
                .WithMany()
                .HasForeignKey(p => p.BrandId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configura la relazione N:1 tra Panel e Tobacconist (opzionale, via TobacconistId FK)
            // EF auto-configura questa relazione grazie al naming convention della FK
            modelBuilder.Entity<Panel>()
                .HasOne(p => p.Tobacconist)
                .WithMany()
                .HasForeignKey(p => p.TobacconistId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
