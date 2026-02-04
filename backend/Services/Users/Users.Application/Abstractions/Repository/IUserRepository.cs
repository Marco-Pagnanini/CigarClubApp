using Users.Core.Entities;

namespace Users.Application.Abstractions.Repository
{
    /// <summary>
    /// Definisce il contratto per la repository degli utenti.
    /// </summary>
    public interface IUserRepository
    {
        /// <summary>
        /// Restituisce un utente per ID, null se non trovato.
        /// </summary>
        Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

        /// <summary>
        /// Restituisce un utente per email, null se non trovato.
        /// </summary>
        Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

        /// <summary>
        /// Aggiunge un nuovo utente.
        /// </summary>
        Task AddAsync(User user, CancellationToken cancellationToken = default);

        /// <summary>
        /// Aggiorna un utente esistente.
        /// </summary>
        Task UpdateAsync(User user, CancellationToken cancellationToken = default);

        /// <summary>
        /// Aggiunge un refresh token.
        /// </summary>
        Task AddRefreshTokenAsync(RefreshToken refreshToken, CancellationToken cancellationToken = default);

        /// <summary>
        /// Restituisce un refresh token per stringa token, null se non trovato.
        /// </summary>
        Task<RefreshToken?> GetRefreshTokenAsync(string token, CancellationToken cancellationToken = default);
    }
}
