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
        private readonly IImageStorageService _imageStorage;
        private readonly ILogger<BrandController> _logger;

        private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
        {
            "image/jpeg", "image/png", "image/webp"
        };

        private const long MaxImageSize = 5 * 1024 * 1024; // 5 MB

        public BrandController(IBrandService service, IImageStorageService imageStorage, ILogger<BrandController> logger)
        {
            _service = service;
            _imageStorage = imageStorage;
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

        /// <summary>
        /// POST /api/brands/{id}/logo — carica il logo di un brand (ADMIN ONLY)
        /// </summary>
        [HttpPost("{id:guid}/logo")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<ApiResponse<string>>> UploadLogo(Guid id, IFormFile file, CancellationToken cancellationToken)
        {
            try
            {
                if (file is null || file.Length == 0)
                    return BadRequest(ApiResponse<string>.ErrorResponse("No file provided"));

                if (!AllowedContentTypes.Contains(file.ContentType))
                    return BadRequest(ApiResponse<string>.ErrorResponse("Invalid file type. Allowed: jpeg, png, webp"));

                if (file.Length > MaxImageSize)
                    return BadRequest(ApiResponse<string>.ErrorResponse("File size exceeds the 5 MB limit"));

                var brand = await _service.GetBrandByIdAsync(id, cancellationToken);
                if (brand is null)
                    return NotFound(ApiResponse<string>.ErrorResponse($"Brand with ID {id} not found"));

                // Se esiste già un logo, lo eliminiamo prima
                if (!string.IsNullOrEmpty(brand.LogoUrl))
                {
                    var oldKey = ExtractKeyFromUrl(brand.LogoUrl);
                    if (oldKey is not null)
                        await _imageStorage.DeleteImageAsync(oldKey, cancellationToken);
                }

                var extension = Path.GetExtension(file.FileName)?.ToLowerInvariant() ?? ".jpg";
                var key = $"brands/{id}/logo{extension}";

                using var stream = file.OpenReadStream();
                var logoUrl = await _imageStorage.UploadImageAsync(key, stream, file.ContentType, cancellationToken);

                brand.LogoUrl = logoUrl;
                await _service.UpdateBrandAsync(brand, cancellationToken);

                _logger.LogInformation("Uploaded logo for brand {Id}", id);
                return Ok(ApiResponse<string>.SuccessResponse(logoUrl, "Logo uploaded successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading logo for brand {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<string>.ErrorResponse("Error uploading logo"));
            }
        }

        /// <summary>
        /// DELETE /api/brands/{id}/logo — elimina il logo di un brand (ADMIN ONLY)
        /// </summary>
        [HttpDelete("{id:guid}/logo")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<ApiResponse>> DeleteLogo(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var brand = await _service.GetBrandByIdAsync(id, cancellationToken);
                if (brand is null)
                    return NotFound(ApiResponse.ErrorResponse($"Brand with ID {id} not found"));

                if (string.IsNullOrEmpty(brand.LogoUrl))
                    return NotFound(ApiResponse.ErrorResponse("Brand has no logo"));

                var key = ExtractKeyFromUrl(brand.LogoUrl);
                if (key is not null)
                    await _imageStorage.DeleteImageAsync(key, cancellationToken);

                brand.LogoUrl = null;
                await _service.UpdateBrandAsync(brand, cancellationToken);

                _logger.LogInformation("Deleted logo for brand {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting logo for brand {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse.ErrorResponse("Error deleting logo"));
            }
        }

        private static string? ExtractKeyFromUrl(string imageUrl)
        {
            var brandsIndex = imageUrl.IndexOf("brands/", StringComparison.Ordinal);
            if (brandsIndex >= 0)
                return imageUrl[brandsIndex..];

            return null;
        }
    }
}
