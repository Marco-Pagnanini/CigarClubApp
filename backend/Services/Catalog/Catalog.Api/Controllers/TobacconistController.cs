using Catalog.Api.Models;
using Catalog.Application.Abstractions.Service;
using Catalog.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.Api.Controllers
{
    /// <summary>
    /// API Controller per la gestione dei prodotti Tobacconist.
    /// - GET endpoints: PUBLIC (no auth required)
    /// - POST/PUT/DELETE endpoints: ADMIN ONLY (JWT + Admin role)
    /// </summary>
    [ApiController]
    [Route("api/tobacconists")]
    public class TobacconistController : ControllerBase
    {
        private readonly ITobacconistService _service;
        private readonly ILogger<TobacconistController> _logger;

        public TobacconistController(ITobacconistService service, ILogger<TobacconistController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// GET /api/tobacconists — restituisce tutti i prodotti (PUBLIC)
        /// </summary>
        /// <remarks>
        /// Endpoint pubblico, non richiede autenticazione JWT.
        /// Restituisce una lista di tutti i prodotti disponibili.
        /// </remarks>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ICollection<Tobacconist>>> GetAll(CancellationToken cancellationToken)
        {
            try
            {
                var prodotti = await _service.GetAllTobacconistsAsync(cancellationToken);
                _logger.LogInformation("Retrieved {Count} tobacconists", prodotti.Count);
                return Ok(prodotti);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tobacconists");
                return BadRequest("Error retrieving tobacconists");
            }
        }

        /// <summary>
        /// GET /api/tobacconists/{id} — restituisce un prodotto per ID (PUBLIC)
        /// </summary>
        /// <remarks>
        /// Endpoint pubblico, non richiede autenticazione JWT.
        /// Restituisce i dettagli di uno specifico prodotto.
        /// </remarks>
        [HttpGet("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<Tobacconist>>> GetById(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var prodotto = await _service.GetTobacconistByIdAsync(id, cancellationToken);
                if (prodotto is null)
                {
                    _logger.LogWarning("Tobacconist with ID {Id} not found", id);
                    return NotFound(ApiResponse<Tobacconist>.ErrorResponse($"Tobacconist with ID {id} not found"));
                }

                _logger.LogInformation("Retrieved tobacconist with ID {Id}", id);
                return Ok(ApiResponse<Tobacconist>.SuccessResponse(prodotto, "Tobacconist retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tobacconist with ID {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<Tobacconist>.ErrorResponse("Error retrieving tobacconist"));
            }
        }

        /// <summary>
        /// GET /api/tobacconists/code/{code} — restituisce un prodotto per codice (PUBLIC)
        /// </summary>
        /// <remarks>
        /// Endpoint pubblico, non richiede autenticazione JWT.
        /// Restituisce un prodotto cercato per codice.
        /// </remarks>
        [HttpGet("code/{code}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<Tobacconist>>> GetByCode(string code, CancellationToken cancellationToken)
        {
            try
            {
                var prodotto = await _service.GetTobacconistByCodeAsync(code, cancellationToken);
                if (prodotto is null)
                {
                    _logger.LogWarning("Tobacconist with code {Code} not found", code);
                    return NotFound(ApiResponse<Tobacconist>.ErrorResponse($"Tobacconist with code {code} not found"));
                }

                _logger.LogInformation("Retrieved tobacconist with code {Code}", code);
                return Ok(ApiResponse<Tobacconist>.SuccessResponse(prodotto, "Tobacconist retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tobacconist with code {Code}", code);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<Tobacconist>.ErrorResponse("Error retrieving tobacconist"));
            }
        }

        /// <summary>
        /// POST /api/tobacconists — crea un nuovo prodotto (ADMIN ONLY)
        /// </summary>
        /// <remarks>
        /// Endpoint protetto - richiede JWT token con ruolo Admin.
        /// Authorization header: Bearer {token}
        /// </remarks>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<ApiResponse<Tobacconist>>> Create(Tobacconist tobacconist, CancellationToken cancellationToken)
        {
            try
            {
                var creato = await _service.AddTobacconistAsync(tobacconist, cancellationToken);
                _logger.LogInformation("Created new tobacconist with ID {Id}", creato.Id);
                return CreatedAtAction(nameof(GetById), new { id = creato.Id },
                    ApiResponse<Tobacconist>.SuccessResponse(creato, "Tobacconist created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating tobacconist");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<Tobacconist>.ErrorResponse("Error creating tobacconist"));
            }
        }

        /// <summary>
        /// PUT /api/tobacconists/{id} — aggiorna un prodotto esistente (ADMIN ONLY)
        /// </summary>
        /// <remarks>
        /// Endpoint protetto - richiede JWT token con ruolo Admin.
        /// Authorization header: Bearer {token}
        /// </remarks>
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse>> Update(Guid id, Tobacconist tobacconist, CancellationToken cancellationToken)
        {
            try
            {
                if (id != tobacconist.Id)
                {
                    _logger.LogWarning("ID mismatch: URL ID {UrlId} != Body ID {BodyId}", id, tobacconist.Id);
                    return BadRequest(ApiResponse.ErrorResponse("The ID in the URL does not match the ID in the body."));
                }

                var esiste = await _service.GetTobacconistByIdAsync(id, cancellationToken);
                if (esiste is null)
                {
                    _logger.LogWarning("Tobacconist with ID {Id} not found for update", id);
                    return NotFound(ApiResponse.ErrorResponse($"Tobacconist with ID {id} not found"));
                }

                await _service.UpdateTobacconistAsync(tobacconist, cancellationToken);
                _logger.LogInformation("Updated tobacconist with ID {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating tobacconist with ID {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse.ErrorResponse("Error updating tobacconist"));
            }
        }

        /// <summary>
        /// DELETE /api/tobacconists/{id} — elimina un prodotto (ADMIN ONLY)
        /// </summary>
        /// <remarks>
        /// Endpoint protetto - richiede JWT token con ruolo Admin.
        /// Authorization header: Bearer {token}
        /// </remarks>
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse>> Delete(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var esiste = await _service.GetTobacconistByIdAsync(id, cancellationToken);
                if (esiste is null)
                {
                    _logger.LogWarning("Tobacconist with ID {Id} not found for deletion", id);
                    return NotFound(ApiResponse.ErrorResponse($"Tobacconist with ID {id} not found"));
                }

                await _service.DeleteTobacconistAsync(id, cancellationToken);
                _logger.LogInformation("Deleted tobacconist with ID {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting tobacconist with ID {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse.ErrorResponse("Error deleting tobacconist"));
            }
        }
    }
}
