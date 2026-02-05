using Catalog.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Catalog.Application.Abstractions.Repository
{
    public interface IPanelRepository
    {
        Task<IEnumerable<Panel>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<Panel?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IEnumerable<Panel>> GetByBrandAsync(Guid brandId, CancellationToken cancellationToken = default);
        Task AddAsync(Panel panel, CancellationToken cancellationToken = default);
        Task UpdateAsync(Panel panel, CancellationToken cancellationToken = default);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> PanelExistsAsync(Guid panelId);
        Task<Panel> GetPanelByTobacconistCodeAsync(string tobacconistCode);
    }
}
