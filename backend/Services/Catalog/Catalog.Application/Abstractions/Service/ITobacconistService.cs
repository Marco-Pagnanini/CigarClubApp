using Catalog.Core.Entities;

namespace Catalog.Application.Abstractions.Service
{
    /// <summary>
    /// Definisce il contratto per il service dei prodotti Tobacconist.
    /// </summary>
    public interface ITobacconistService
    {
        Task<ICollection<Tobacconist>> GetAllTobacconistsAsync(CancellationToken cancellationToken = default);
        Task<Tobacconist?> GetTobacconistByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Tobacconist?> GetTobacconistByCodeAsync(string code, CancellationToken cancellationToken = default);
        Task<Tobacconist?> GetTobacconistByBarcodeAsync(string barcodeValue, CancellationToken cancellationToken = default);
        Task<Tobacconist> AddTobacconistAsync(Tobacconist tobacconist, CancellationToken cancellationToken = default);
        Task UpdateTobacconistAsync(Tobacconist tobacconist, CancellationToken cancellationToken = default);
        Task DeleteTobacconistAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
