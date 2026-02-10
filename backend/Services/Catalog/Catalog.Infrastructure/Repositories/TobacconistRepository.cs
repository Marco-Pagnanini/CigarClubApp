using Catalog.Application.Abstractions.Repository;
using Catalog.Core.Entities;
using Catalog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure.Repositories
{
    /// <summary>
    /// Implementazione concreta della repository usando EF Core + Postgres.
    /// </summary>
    public class TobacconistRepository : ITobacconistRepository
    {
        private readonly CatalogDbContext _context;

        public TobacconistRepository(CatalogDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Tobacconist>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Tobacconists
                .Include(t => t.Barcodes)
                .ToListAsync(cancellationToken);
        }

        public async Task<Tobacconist?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Tobacconists
                .Include(t => t.Barcodes)
                .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        }

        public async Task AddAsync(Tobacconist tobacconist, CancellationToken cancellationToken = default)
        {
            _context.Tobacconists.Add(tobacconist);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(Tobacconist tobacconist, CancellationToken cancellationToken = default)
        {
            _context.Tobacconists.Update(tobacconist);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<Tobacconist?> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
        {
            return await _context.Tobacconists
                .Include(t => t.Barcodes)
                .FirstOrDefaultAsync(t => t.Code == code, cancellationToken);
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var tobacconist = await _context.Tobacconists.FindAsync(id, cancellationToken);
            if (tobacconist is not null)
            {
                _context.Tobacconists.Remove(tobacconist);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task<Tobacconist?> GetByBarcodeAsync(string barcodeValue, CancellationToken cancellationToken = default)
        {
            return await _context.Tobacconists
                .Include(t => t.Barcodes)
                .Include(t => t.Brand)
                .FirstOrDefaultAsync(t => t.Barcodes.Any(b => b.Value == barcodeValue), cancellationToken);
        }
    }
}
