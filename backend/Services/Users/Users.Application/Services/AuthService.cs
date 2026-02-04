using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;
using BCryptNet = BCrypt.Net.BCrypt;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Users.Application.Abstractions.Repository;
using Users.Application.Abstractions.Service;
using Users.Application.Dtos;
using Users.Core.Entities;

namespace Users.Application.Services
{
    /// <summary>
    /// Implementazione del service di autenticazione.
    /// Gestisce registrazione, login, refresh token e logout.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IUserRepository userRepository,
            IConfiguration configuration,
            ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _logger = logger;
        }

        // ─── Register ────────────────────────────────────────────────────────
        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto, CancellationToken cancellationToken = default)
        {
            // Controlla se l'email è già registrata
            var existingUser = await _userRepository.GetByEmailAsync(registerDto.Email, cancellationToken);
            if (existingUser is not null)
                throw new InvalidOperationException("Un utente con questa email è già registrato.");

            // Crea l'utente con password hashed
            var user = new User
            {
                Email     = registerDto.Email,
                PasswordHash = BCryptNet.HashPassword(registerDto.Password),
                FirstName = registerDto.FirstName,
                LastName  = registerDto.LastName,
                Role      = Users.Core.Roles.User    // ruolo di default
            };

            await _userRepository.AddAsync(user, cancellationToken);
            _logger.LogInformation("Utente registrato con successo: {Email}", user.Email);

            // Genera i token e ritorna la risposta
            return await GenerateAuthResponseAsync(user, cancellationToken);
        }

        // ─── Login ───────────────────────────────────────────────────────────
        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto, CancellationToken cancellationToken = default)
        {
            var user = await _userRepository.GetByEmailAsync(loginDto.Email, cancellationToken);
            if (user is null || !BCryptNet.Verify(loginDto.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Email o password non valide.");

            _logger.LogInformation("Login riuscito per: {Email}", user.Email);

            return await GenerateAuthResponseAsync(user, cancellationToken);
        }

        // ─── Refresh Token ───────────────────────────────────────────────────
        public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
        {
            var storedToken = await _userRepository.GetRefreshTokenAsync(refreshToken, cancellationToken);

            if (storedToken is null || storedToken.IsRevoked || storedToken.ExpiresAt < DateTimeOffset.UtcNow)
                throw new UnauthorizedAccessException("Refresh token non valido o scaduto.");

            // Revoca il vecchio refresh token
            storedToken.IsRevoked = true;
            await _userRepository.UpdateAsync(storedToken.User!, cancellationToken);

            _logger.LogInformation("Token rinnovato per utente: {UserId}", storedToken.UserId);

            // Genera nuovi token
            return await GenerateAuthResponseAsync(storedToken.User!, cancellationToken);
        }

        // ─── Logout ──────────────────────────────────────────────────────────
        public async Task LogoutAsync(string refreshToken, CancellationToken cancellationToken = default)
        {
            var storedToken = await _userRepository.GetRefreshTokenAsync(refreshToken, cancellationToken);
            if (storedToken is null) return; // token non trovato, niente da fare

            storedToken.IsRevoked = true;
            await _userRepository.UpdateAsync(storedToken.User!, cancellationToken);

            _logger.LogInformation("Logout completato per utente: {UserId}", storedToken.UserId);
        }

        // ─── Helpers privati ─────────────────────────────────────────────────

        /// <summary>
        /// Genera access token (JWT) + refresh token e restituisce il DTO di risposta.
        /// </summary>
        private async Task<AuthResponseDto> GenerateAuthResponseAsync(User user, CancellationToken cancellationToken)
        {
            var accessToken  = GenerateJwtToken(user);
            var refreshToken = await CreateRefreshTokenAsync(user, cancellationToken);

            return new AuthResponseDto
            {
                AccessToken  = accessToken,
                RefreshToken = refreshToken,
                Email        = user.Email,
                Role         = user.Role
            };
        }

        /// <summary>
        /// Genera il JWT access token con claims standard.
        /// </summary>
        private string GenerateJwtToken(User user)
        {
            var secretKey   = _configuration["Jwt:SecretKey"]!;
            var issuer      = _configuration["Jwt:Issuer"]!;
            var audience    = _configuration["Jwt:Audience"]!;
            var expMinutes  = int.Parse(_configuration["Jwt:ExpirationMinutes"]!);

            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                SecurityAlgorithms.HmacSha256
            );

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email,          user.Email),
                new Claim(ClaimTypes.Role,           user.Role),
                new Claim(ClaimTypes.GivenName,      user.FirstName),
                new Claim(ClaimTypes.Surname,        user.LastName)
            };

            var token = new JwtSecurityToken(
                issuer:    issuer,
                audience:  audience,
                claims:    claims,
                notBefore: DateTimeOffset.UtcNow.UtcDateTime,
                expires:   DateTimeOffset.UtcNow.AddMinutes(expMinutes).UtcDateTime,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Crea e salva un nuovo refresh token nel DB. Scadenza da config.
        /// </summary>
        private async Task<string> CreateRefreshTokenAsync(User user, CancellationToken cancellationToken)
        {
            var refreshTokenExpDays = int.Parse(_configuration["Jwt:RefreshTokenExpirationDays"] ?? "7");

            // Genera un token crittograficamente sicuro
            var tokenBytes = RandomNumberGenerator.GetBytes(32);
            var tokenValue = Convert.ToBase64String(tokenBytes);

            var refreshToken = new RefreshToken
            {
                UserId    = user.Id,
                Token     = tokenValue,
                ExpiresAt = DateTimeOffset.UtcNow.AddDays(refreshTokenExpDays),
                IsRevoked = false
            };

            await _userRepository.AddRefreshTokenAsync(refreshToken, cancellationToken);

            return tokenValue;
        }
    }
}
