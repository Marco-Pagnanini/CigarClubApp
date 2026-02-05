using Catalog.Core.Entities;

namespace Catalog.Application.Abstractions.Service
{
    /// <summary>
    /// Definisce il contratto per il service dei Panel (dettagli cigari).
    /// </summary>
    public interface IPanelService
    {
        Task<ICollection<Panel>> GetAllPanelsAsync(CancellationToken cancellationToken = default);
        Task<Panel?> GetPanelByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<ICollection<Panel>> GetPanelsByBrandAsync(Guid brandId, CancellationToken cancellationToken = default);
        Task<Panel> AddPanelAsync(Panel panel, CancellationToken cancellationToken = default);
        Task UpdatePanelAsync(Panel panel, CancellationToken cancellationToken = default);
        Task DeletePanelAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
