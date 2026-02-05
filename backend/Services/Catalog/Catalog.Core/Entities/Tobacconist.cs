namespace Catalog.Core.Entities
{
    public class Tobacconist
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Code { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal PriceKg { get; set; }
        public decimal StackPrice { get; set; }
        public string StackType { get; set; } = string.Empty;
        public DateTimeOffset CurrentPricingValidity { get; set; } = DateTimeOffset.UtcNow;
        public decimal NextPrice { get; set; }
        public decimal NextStackPrice { get; set; }
        public DateTimeOffset NextPricingValidity { get; set; }

        // Navigation properties
        public ICollection<Barcode> Barcodes { get; set; } = [];

        // Foreign key verso Panel (opzionale, 1:1)
        // Nota: Panel non è navigato direttamente per evitare loop infinito in serializzazione
        public Guid? PanelId { get; set; }
    }
}
