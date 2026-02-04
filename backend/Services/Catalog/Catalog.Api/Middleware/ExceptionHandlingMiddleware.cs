using Catalog.Api.Models;
using System.Text.Json;

namespace Catalog.Api.Middleware
{
    /// <summary>
    /// Middleware globale per la gestione delle eccezioni.
    /// Converte tutte le eccezioni in risposte JSON standardizzate.
    /// </summary>
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "An unhandled exception occurred: {Message}", exception.Message);
                await HandleExceptionAsync(context, exception);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var response = exception switch
            {
                UnauthorizedAccessException =>
                    (StatusCode: StatusCodes.Status401Unauthorized,
                     Message: "You are not authorized to access this resource"),

                KeyNotFoundException =>
                    (StatusCode: StatusCodes.Status404NotFound,
                     Message: "The requested resource was not found"),

                ArgumentException =>
                    (StatusCode: StatusCodes.Status400BadRequest,
                     Message: exception.Message),

                _ =>
                    (StatusCode: StatusCodes.Status500InternalServerError,
                     Message: "An internal server error occurred")
            };

            context.Response.StatusCode = response.StatusCode;

            var errorResponse = ApiResponse.ErrorResponse(response.Message);
            return context.Response.WriteAsJsonAsync(errorResponse);
        }
    }
}
