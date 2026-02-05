using Catalog.Api.Models;
using Catalog.Application.Abstractions.Service;
using Catalog.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.Api.Controllers
{
    /// <summary>
    /// API Controller per la gestione dei Panel (dettagli cigari arricchiti).
    /// - GET endpoints: PUBLIC (no auth required)
    /// - POST/PUT/DELETE endpoints: ADMIN ONLY (JWT + Admin role)
    /// </summary>
    [ApiController]
    [Route("api/panels")]
    public class PanelController : ControllerBase
    {
        private readonly IPanelService _service;
        private readonly ILogger<PanelController> _logger;

        public PanelController(IPanelService service, ILogger<PanelController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// GET /api/panels — restituisce tutti i panel (PUBLIC)
        /// </summary>
        /// <remarks>
        /// Endpoint pubblico, non richiede autenticazione JWT.
        /// Restituisce una lista di tutti i panel disponibili.
        /// </remarks>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ICollection<Panel>>> GetAll(CancellationToken cancellationToken)
        {
            try
            {
                var panels = await _service.GetAllPanelsAsync(cancellationToken);
                _logger.LogInformation("Retrieved {Count} panels", panels.Count);
                return Ok(panels);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving panels");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse.ErrorResponse("Error retrieving panels"));
            }
        }

        /// <summary>
        /// GET /api/panels/{id} — restituisce un panel per ID (PUBLIC)
        /// </summary>
        /// <remarks>
        /// Endpoint pubblico, non richiede autenticazione JWT.
        /// Restituisce i dettagli di uno specifico panel.
        /// </remarks>
        [HttpGet("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<Panel>>> GetById(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var panel = await _service.GetPanelByIdAsync(id, cancellationToken);
                if (panel is null)
                {
                    _logger.LogWarning("Panel with ID {Id} not found", id);
                    return NotFound(ApiResponse<Panel>.ErrorResponse($"Panel with ID {id} not found"));
                }

                _logger.LogInformation("Retrieved panel with ID {Id}", id);
                return Ok(ApiResponse<Panel>.SuccessResponse(panel, "Panel retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving panel with ID {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<Panel>.ErrorResponse("Error retrieving panel"));
            }
        }

        /// <summary>
        /// GET /api/panels/brand/{brandId} — restituisce i panel di un brand (PUBLIC)
        /// </summary>
        /// <remarks>
        /// Endpoint pubblico, non richiede autenticazione JWT.
        /// Restituisce tutti i panel associati a uno specifico brand.
        /// </remarks>
        [HttpGet("brand/{brandId:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ICollection<Panel>>> GetByBrand(Guid brandId, CancellationToken cancellationToken)
        {
            try
            {
                var panels = await _service.GetPanelsByBrandAsync(brandId, cancellationToken);
                _logger.LogInformation("Retrieved {Count} panels for brand {BrandId}", panels.Count, brandId);
                return Ok(panels);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving panels for brand {BrandId}", brandId);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse.ErrorResponse("Error retrieving panels"));
            }
        }

        /// <summary>
        /// POST /api/panels — crea un nuovo panel (ADMIN ONLY)
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
        public async Task<ActionResult<ApiResponse<Panel>>> Create(Panel panel, CancellationToken cancellationToken)
        {
            try
            {
                var created = await _service.AddPanelAsync(panel, cancellationToken);
                _logger.LogInformation("Created new panel with ID {Id}", created.id);
                return CreatedAtAction(nameof(GetById), new { id = created.id },
                    ApiResponse<Panel>.SuccessResponse(created, "Panel created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating panel");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<Panel>.ErrorResponse("Error creating panel"));
            }
        }

        /// <summary>
        /// PUT /api/panels/{id} — aggiorna un panel esistente (ADMIN ONLY)
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
        public async Task<ActionResult<ApiResponse>> Update(Guid id, Panel panel, CancellationToken cancellationToken)
        {
            try
            {
                if (id != panel.id)
                {
                    _logger.LogWarning("ID mismatch: URL ID {UrlId} != Body ID {BodyId}", id, panel.id);
                    return BadRequest(ApiResponse.ErrorResponse("The ID in the URL does not match the ID in the body."));
                }

                var existing = await _service.GetPanelByIdAsync(id, cancellationToken);
                if (existing is null)
                {
                    _logger.LogWarning("Panel with ID {Id} not found for update", id);
                    return NotFound(ApiResponse.ErrorResponse($"Panel with ID {id} not found"));
                }

                await _service.UpdatePanelAsync(panel, cancellationToken);
                _logger.LogInformation("Updated panel with ID {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating panel with ID {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse.ErrorResponse("Error updating panel"));
            }
        }

        /// <summary>
        /// DELETE /api/panels/{id} — elimina un panel (ADMIN ONLY)
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
                var existing = await _service.GetPanelByIdAsync(id, cancellationToken);
                if (existing is null)
                {
                    _logger.LogWarning("Panel with ID {Id} not found for deletion", id);
                    return NotFound(ApiResponse.ErrorResponse($"Panel with ID {id} not found"));
                }

                await _service.DeletePanelAsync(id, cancellationToken);
                _logger.LogInformation("Deleted panel with ID {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting panel with ID {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse.ErrorResponse("Error deleting panel"));
            }
        }
    }
}
