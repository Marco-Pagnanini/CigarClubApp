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

            // Panel ha una referenza al Tobacconist solo tramite il codice (TobacconistCode)
            // Non configuriamo una foreign key nel database perché Code non è UNIQUE su Tobacconist
            // Questo permette al Panel di essere creato indipendentemente
        }
    }
}
