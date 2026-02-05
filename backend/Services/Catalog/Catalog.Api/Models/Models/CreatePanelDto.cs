using Catalog.Core.Enums;

namespace Catalog.Api.Models;

/// <summary>
/// DTO per la creazione di un nuovo Panel (dettagli cigari).
/// Contiene solo i campi necessari per l'aggiunta di un panel.
/// </summary>
public class CreatePanelDto
{
    public string Name { get; set; } = string.Empty;
    public Guid BrandId { get; set; }
    public Guid? TobacconistId { get; set; }
    public string? TobacconistCode { get; set; }
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
}
