using Users.Application.Dtos;

namespace Users.Application.Abstractions.Service
{
    /// <summary>
    /// Definisce il contratto per il service di autenticazione.
    /// </summary>
    public interface IAuthService
    {
        /// <summary>
        /// Registra un nuovo utente e restituisce i token.
        /// </summary>
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Autentica un utente e restituisce i token.
        /// </summary>
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Rinnova il JWT usando un refresh token valido.
        /// </summary>
        Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);

        /// <summary>
        /// Revoca un refresh token (logout).
        /// </summary>
        Task LogoutAsync(string refreshToken, CancellationToken cancellationToken = default);
    }
}
