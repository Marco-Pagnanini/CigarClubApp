using Catalog.Application.Abstractions.Repository;
using Catalog.Application.Abstractions.Service;
using Catalog.Core.Entities;

namespace Catalog.Application.Services
{
    /// <summary>
    /// Implementazione del service: contiene la logica di business per i Brand.
    /// Dipende solo dalle interface, mai dalle implementazioni concrete.
    /// </summary>
    public class BrandService : IBrandService
    {
        private readonly IBrandRepository _repository;

        public BrandService(IBrandRepository repository)
        {
            _repository = repository;
        }

        public async Task<ICollection<Brand>> GetAllBrandsAsync(CancellationToken cancellationToken = default)
        {
            var result = await _repository.GetAllAsync(cancellationToken);
            return result.ToList();
        }

        public async Task<Brand?> GetBrandByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _repository.GetByIdAsync(id, cancellationToken);
        }

        public async Task<Brand> AddBrandAsync(Brand brand, CancellationToken cancellationToken = default)
        {
            brand.id = Guid.NewGuid();
            await _repository.AddAsync(brand, cancellationToken);
            return brand;
        }

        public async Task UpdateBrandAsync(Brand brand, CancellationToken cancellationToken = default)
        {
            await _repository.UpdateAsync(brand, cancellationToken);
        }

        public async Task DeleteBrandAsync(Guid id, CancellationToken cancellationToken = default)
        {
            await _repository.DeleteAsync(id, cancellationToken);
        }
    }
}
