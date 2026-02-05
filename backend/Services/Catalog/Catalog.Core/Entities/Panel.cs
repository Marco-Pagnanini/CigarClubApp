using Catalog.Core.Enums;

namespace Catalog.Core.Entities;

/// <summary>
/// Schede dettagliate create dall'admin per arricchire i dati tabaccheria
/// </summary>
public class Panel
{
    public Guid id { get; set; } = Guid.NewGuid();
    public string? TobacconistCode { get; set; } // Riferimento opzionale al codice Tobacconist
    public Guid? TobacconistId { get; set; } // Foreign key a Tobacconist
    public string Name { get; set; } = string.Empty;
    public Guid BrandId { get; set; }
    public string? Description { get; set; }
    public string? Origin { get; set; }
    public Strength? Strength { get; set; }
    public string? Wrapper { get; set; }
    public WrapperColor? WrapperColor { get; set; }
    public string? Binder { get; set; }
    public string? Filler { get; set; }
    public string? MasterLine { get; set; }
    public string? RollingType { get; set; }
    public string? Shape { get; set; }
    public decimal? Price { get; set; }
    public decimal? Rating { get; set; }
    public int? NumberInBox { get; set; }
    public int? Ring { get; set; }
    public int? SmokingTime { get; set; }
    public CigarType? Type { get; set; }

    // Navigation properties
    public Brand Brand { get; set; } = null!;
}
