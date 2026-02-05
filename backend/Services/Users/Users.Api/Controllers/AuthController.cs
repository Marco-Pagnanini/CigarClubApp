using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Users.Application.Abstractions.Service;
using Users.Application.Dtos;

namespace Users.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;


        public AuthController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        [HttpGet]
        [Route("users")]
        public Task<List<UserDto>> GetUsers(
            CancellationToken cancellationToken)
        {
            return _userService.GetUsers(cancellationToken);
        }

        /// <summary>
        /// POST /api/auth/register — registra un nuovo utente e restituisce i token.
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(
            RegisterDto registerDto,
            CancellationToken cancellationToken)
        {
            try
            {
                var response = await _authService.RegisterAsync(registerDto, cancellationToken);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });   // 409 – email già registrata
            }
        }

        /// <summary>
        /// POST /api/auth/login — autentica un utente e restituisce i token.
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(
            LoginDto loginDto,
            CancellationToken cancellationToken)
        {
            try
            {
                var response = await _authService.LoginAsync(loginDto, cancellationToken);
                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Email o password non valide." });  // 401
            }
        }

        /// <summary>
        /// POST /api/auth/refresh — rinnova il JWT usando un refresh token valido.
        /// </summary>
        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponseDto>> Refresh(
            [FromBody] RefreshRequestDto refreshRequest,
            CancellationToken cancellationToken)
        {
            try
            {
                var response = await _authService.RefreshTokenAsync(refreshRequest.RefreshToken, cancellationToken);
                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Refresh token non valido o scaduto." });  // 401
            }
        }

        /// <summary>
        /// POST /api/auth/logout — revoca il refresh token (logout).
        /// </summary>
        [HttpPost("logout")]
        public async Task<ActionResult> Logout(
            [FromBody] RefreshRequestDto refreshRequest,
            CancellationToken cancellationToken)
        {
            await _authService.LogoutAsync(refreshRequest.RefreshToken, cancellationToken);
            return NoContent();  // 204
        }

    }
}
