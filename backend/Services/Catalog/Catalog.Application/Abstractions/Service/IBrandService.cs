using Catalog.Core.Entities;

namespace Catalog.Application.Abstractions.Service
{
    /// <summary>
    /// Definisce il contratto per il service dei Brand.
    /// </summary>
    public interface IBrandService
    {
        Task<ICollection<Brand>> GetAllBrandsAsync(CancellationToken cancellationToken = default);
        Task<Brand?> GetBrandByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Brand> AddBrandAsync(Brand brand, CancellationToken cancellationToken = default);
        Task UpdateBrandAsync(Brand brand, CancellationToken cancellationToken = default);
        Task DeleteBrandAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
