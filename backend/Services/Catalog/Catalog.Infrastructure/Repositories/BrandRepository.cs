using Catalog.Application.Abstractions.Repository;
using Catalog.Core.Entities;
using Catalog.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure.Repositories
{
    /// <summary>
    /// Implementazione concreta della repository Brand usando EF Core + Postgres.
    /// </summary>
    public class BrandRepository : IBrandRepository
    {
        private readonly CatalogDbContext _context;

        public BrandRepository(CatalogDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Brand>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Brands
                .ToListAsync(cancellationToken);
        }

        public async Task<Brand?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Brands
                .FirstOrDefaultAsync(b => b.id == id, cancellationToken);
        }

        public async Task AddAsync(Brand brand, CancellationToken cancellationToken = default)
        {
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(Brand brand, CancellationToken cancellationToken = default)
        {
            _context.Brands.Update(brand);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var brand = await _context.Brands.FindAsync(new object[] { id }, cancellationToken: cancellationToken);
            if (brand is not null)
            {
                _context.Brands.Remove(brand);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task<bool> BrandExistsAsync(Guid brandId)
        {
            return await _context.Brands.AnyAsync(b => b.id == brandId);
        }
    }
}
