using Catalog.Application.Abstractions.Repository;
using Catalog.Core.Entities;
using Catalog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure.Repositories
{
    /// <summary>
    /// Implementazione concreta della repository Panel usando EF Core + Postgres.
    /// </summary>
    public class PanelRepository : IPanelRepository
    {
        private readonly CatalogDbContext _context;

        public PanelRepository(CatalogDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Panel>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Panels
                .Include(p => p.Brand)
                .Include(p => p.Tobacconist)
                .ToListAsync(cancellationToken);
        }

        public async Task<Panel?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Panels
                .Include(p => p.Brand)
                .Include(p => p.Tobacconist)
                .FirstOrDefaultAsync(p => p.id == id, cancellationToken);
        }

        public async Task<IEnumerable<Panel>> GetByBrandAsync(Guid brandId, CancellationToken cancellationToken = default)
        {
            return await _context.Panels
                .Include(p => p.Brand)
                .Include(p => p.Tobacconist)
                .Where(p => p.BrandId == brandId)
                .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(Panel panel, CancellationToken cancellationToken = default)
        {
            _context.Panels.Add(panel);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(Panel panel, CancellationToken cancellationToken = default)
        {
            _context.Panels.Update(panel);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var panel = await _context.Panels.FindAsync(new object[] { id }, cancellationToken: cancellationToken);
            if (panel is not null)
            {
                _context.Panels.Remove(panel);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task<bool> PanelExistsAsync(Guid panelId)
        {
            return await _context.Panels.AnyAsync(p => p.id == panelId);
        }

        public async Task<Panel> GetPanelByTobacconistCodeAsync(string tobacconistCode)
        {
            return await _context.Panels
                .Include(p => p.Brand)
                .FirstOrDefaultAsync(p => p.TobacconistCode == tobacconistCode) ?? throw new InvalidOperationException($"Panel with tobacconist code {tobacconistCode} not found.");
        }
    }
}
