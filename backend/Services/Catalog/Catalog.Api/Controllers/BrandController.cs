using Catalog.Api.Models;
using Catalog.Application.Abstractions.Service;
using Catalog.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.Api.Controllers
{
    /// <summary>
    /// API Controller per la gestione dei Brand (produttori di sigari).
    /// - GET endpoints: PUBLIC (no auth required)
    /// - POST/PUT/DELETE endpoints: ADMIN ONLY (JWT + Admin role)
    /// </summary>
    [ApiController]
    [Route("api/brands")]
    public class BrandController : ControllerBase
    {
        private readonly IBrandService _service;
        private readonly ILogger<BrandController> _logger;

        public BrandController(IBrandService service, ILogger<BrandController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// GET /api/brands — restituisce tutti i brand (PUBLIC)
        /// </summary>
        /// <remarks>
        /// Endpoint pubblico, non richiede autenticazione JWT.
        /// Restituisce una lista di tutti i brand disponibili.
        /// </remarks>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ICollection<Brand>>> GetAll(CancellationToken cancellationToken)
        {
            try
            {
                var brands = await _service.GetAllBrandsAsync(cancellationToken);
                _logger.LogInformation("Retrieved {Count} brands", brands.Count);
                return Ok(brands);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving brands");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse.ErrorResponse("Error retrieving brands"));
            }
        }

        /// <summary>
        /// GET /api/brands/{id} — restituisce un brand per ID (PUBLIC)
        /// </summary>
        /// <remarks>
        /// Endpoint pubblico, non richiede autenticazione JWT.
        /// Restituisce i dettagli di uno specifico brand.
        /// </remarks>
        [HttpGet("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<Brand>>> GetById(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var brand = await _service.GetBrandByIdAsync(id, cancellationToken);
                if (brand is null)
                {
                    _logger.LogWarning("Brand with ID {Id} not found", id);
                    return NotFound(ApiResponse<Brand>.ErrorResponse($"Brand with ID {id} not found"));
                }

                _logger.LogInformation("Retrieved brand with ID {Id}", id);
                return Ok(ApiResponse<Brand>.SuccessResponse(brand, "Brand retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving brand with ID {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<Brand>.ErrorResponse("Error retrieving brand"));
            }
        }

        /// <summary>
        /// POST /api/brands — crea un nuovo brand (ADMIN ONLY)
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
        public async Task<ActionResult<ApiResponse<Brand>>> Create(Brand brand, CancellationToken cancellationToken)
        {
            try
            {
                var created = await _service.AddBrandAsync(brand, cancellationToken);
                _logger.LogInformation("Created new brand with ID {Id}", created.id);
                return CreatedAtAction(nameof(GetById), new { id = created.id },
                    ApiResponse<Brand>.SuccessResponse(created, "Brand created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating brand");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<Brand>.ErrorResponse("Error creating brand"));
            }
        }

        /// <summary>
        /// PUT /api/brands/{id} — aggiorna un brand esistente (ADMIN ONLY)
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
        public async Task<ActionResult<ApiResponse>> Update(Guid id, Brand brand, CancellationToken cancellationToken)
        {
            try
            {
                if (id != brand.id)
                {
                    _logger.LogWarning("ID mismatch: URL ID {UrlId} != Body ID {BodyId}", id, brand.id);
                    return BadRequest(ApiResponse.ErrorResponse("The ID in the URL does not match the ID in the body."));
                }

                var existing = await _service.GetBrandByIdAsync(id, cancellationToken);
                if (existing is null)
                {
                    _logger.LogWarning("Brand with ID {Id} not found for update", id);
                    return NotFound(ApiResponse.ErrorResponse($"Brand with ID {id} not found"));
                }

                await _service.UpdateBrandAsync(brand, cancellationToken);
                _logger.LogInformation("Updated brand with ID {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating brand with ID {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse.ErrorResponse("Error updating brand"));
            }
        }

        /// <summary>
        /// DELETE /api/brands/{id} — elimina un brand (ADMIN ONLY)
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
                var existing = await _service.GetBrandByIdAsync(id, cancellationToken);
                if (existing is null)
                {
                    _logger.LogWarning("Brand with ID {Id} not found for deletion", id);
                    return NotFound(ApiResponse.ErrorResponse($"Brand with ID {id} not found"));
                }

                await _service.DeleteBrandAsync(id, cancellationToken);
                _logger.LogInformation("Deleted brand with ID {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting brand with ID {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse.ErrorResponse("Error deleting brand"));
            }
        }
    }
}
