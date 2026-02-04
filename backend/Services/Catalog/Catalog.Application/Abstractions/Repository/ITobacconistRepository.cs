using Catalog.Core.Entities;

namespace Catalog.Application.Abstractions.Repository
{
    /// <summary>
    /// Definisce il contratto per la repository dei prodotti Tobacconist.
    /// </summary>
    public interface ITobacconistRepository
    {
        /// <summary>
        /// Restituisce tutti i prodotti nel catalogo.
        /// </summary>
        Task<IEnumerable<Tobacconist>> GetAllAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Restituisce un singolo prodotto per ID, null se non trovato.
        /// </summary>
        Task<Tobacconist?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

        /// <summary>
        /// Aggiunge un nuovo prodotto.
        /// </summary>
        Task AddAsync(Tobacconist tobacconist, CancellationToken cancellationToken = default);

        /// <summary>
        /// Aggiorna un prodotto esistente.
        /// </summary>
        Task UpdateAsync(Tobacconist tobacconist, CancellationToken cancellationToken = default);

        /// <summary>
        /// Restituisce un prodotto per codice, null se non trovato.
        /// </summary>
        Task<Tobacconist?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);

        /// <summary>
        /// Elimina un prodotto per ID.
        /// </summary>
        Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
