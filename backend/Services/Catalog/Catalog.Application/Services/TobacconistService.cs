using Catalog.Application.Abstractions.Repository;
using Catalog.Application.Abstractions.Service;
using Catalog.Core.Entities;

namespace Catalog.Application.Services
{
    /// <summary>
    /// Implementazione del service: contiene la logica di business per i prodotti Tobacconist.
    /// Dipende solo dalle interface, mai dalle implementazioni concrete.
    /// </summary>
    public class TobacconistService : ITobacconistService
    {
        private readonly ITobacconistRepository _repository;

        public TobacconistService(ITobacconistRepository repository)
        {
            _repository = repository;
        }

        public async Task<ICollection<Tobacconist>> GetAllTobacconistsAsync(CancellationToken cancellationToken = default)
        {
            var result = await _repository.GetAllAsync(cancellationToken);
            return result.ToList();
        }

        public async Task<Tobacconist?> GetTobacconistByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _repository.GetByIdAsync(id, cancellationToken);
        }

        public async Task<Tobacconist?> GetTobacconistByCodeAsync(string code, CancellationToken cancellationToken = default)
        {
            return await _repository.GetByCodeAsync(code, cancellationToken);
        }

        public async Task<Tobacconist> AddTobacconistAsync(Tobacconist tobacconist, CancellationToken cancellationToken = default)
        {
            tobacconist.Id = Guid.NewGuid();
            await _repository.AddAsync(tobacconist, cancellationToken);
            return tobacconist;
        }

        public async Task UpdateTobacconistAsync(Tobacconist tobacconist, CancellationToken cancellationToken = default)
        {
            await _repository.UpdateAsync(tobacconist, cancellationToken);
        }

        public async Task DeleteTobacconistAsync(Guid id, CancellationToken cancellationToken = default)
        {
            await _repository.DeleteAsync(id, cancellationToken);
        }
    }
}
