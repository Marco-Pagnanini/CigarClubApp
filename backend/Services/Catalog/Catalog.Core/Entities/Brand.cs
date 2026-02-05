namespace Catalog.Core.Entities;

/// <summary>
/// Produttori/marche di sigari
/// </summary>
public class Brand
{
    public Guid id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Country { get; set; }
    public string? LogoUrl { get; set; }

    // Navigation property
    public ICollection<Panel> Panels { get; set; } = new List<Panel>();
}
