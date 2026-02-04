using System.Security.Claims;

namespace Catalog.Api.Middleware
{
    /// <summary>
    /// Middleware per il logging delle richieste autenticate.
    /// Registra informazioni su ogni richiesta che passa attraverso l'autenticazione JWT.
    /// </summary>
    public class JwtLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<JwtLoggingMiddleware> _logger;

        public JwtLoggingMiddleware(RequestDelegate next, ILogger<JwtLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path;
            var method = context.Request.Method;

            // Log della richiesta
            if (context.User?.Identity?.IsAuthenticated ?? false)
            {
                var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "Unknown";
                var roles = context.User.FindAll(ClaimTypes.Role);
                var roleString = string.Join(", ", roles.Select(r => r.Value));

                _logger.LogInformation(
                    "Authenticated request - Method: {Method}, Path: {Path}, UserId: {UserId}, Roles: {Roles}",
                    method, path, userId, roleString);
            }
            else
            {
                _logger.LogDebug("Unauthenticated request - Method: {Method}, Path: {Path}", method, path);
            }

            await _next(context);

            // Log della risposta
            _logger.LogInformation(
                "Response sent - Method: {Method}, Path: {Path}, StatusCode: {StatusCode}",
                method, path, context.Response.StatusCode);
        }
    }
}
