namespace Catalog.Core.Entities
{
    public class Barcode
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TobacconistId { get; set; }
        public string Value { get; set; } = string.Empty;
    }
}
