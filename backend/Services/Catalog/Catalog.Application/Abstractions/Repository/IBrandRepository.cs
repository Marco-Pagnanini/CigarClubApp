using Catalog.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Catalog.Application.Abstractions.Repository
{
    public interface IBrandRepository
    {
        Task<IEnumerable<Brand>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<Brand?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task AddAsync(Brand brand, CancellationToken cancellationToken = default);
        Task UpdateAsync(Brand brand, CancellationToken cancellationToken = default);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> BrandExistsAsync(Guid brandId);
    }
}
