using Catalog.Api.Models;
using Catalog.Application.Abstractions.Service;
using Catalog.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

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
        private readonly IImageStorageService _imageStorage;
        private readonly ILogger<PanelController> _logger;

        private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
        {
            "image/jpeg", "image/png", "image/webp"
        };

        private const long MaxImageSize = 5 * 1024 * 1024; // 5 MB

        public PanelController(IPanelService service, IImageStorageService imageStorage, ILogger<PanelController> logger)
        {
            _service = service;
            _imageStorage = imageStorage;
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
        public async Task<ActionResult<ApiResponse<Panel>>> Create([FromBody] CreatePanelDto createPanelDto, CancellationToken cancellationToken)
        {
            try
            {
                var panel = new Panel
                {
                    Name = createPanelDto.Name,
                    BrandId = createPanelDto.BrandId,
                    TobacconistId = createPanelDto.TobacconistId,
                    TobacconistCode = createPanelDto.TobacconistCode,
                    Description = createPanelDto.Description,
                    Origin = createPanelDto.Origin,
                    Strength = createPanelDto.Strength,
                    Wrapper = createPanelDto.Wrapper,
                    WrapperColor = createPanelDto.WrapperColor,
                    Binder = createPanelDto.Binder,
                    Filler = createPanelDto.Filler,
                    MasterLine = createPanelDto.MasterLine,
                    RollingType = createPanelDto.RollingType,
                    Shape = createPanelDto.Shape,
                    Price = createPanelDto.Price,
                    Rating = createPanelDto.Rating,
                    NumberInBox = createPanelDto.NumberInBox,
                    Ring = createPanelDto.Ring,
                    SmokingTime = createPanelDto.SmokingTime,
                    Type = createPanelDto.Type
                };

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

        /// <summary>
        /// POST /api/panels/{id}/image — carica l'immagine di un panel (ADMIN ONLY)
        /// </summary>
        [HttpPost("{id:guid}/image")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<ApiResponse<string>>> UploadImage(Guid id, IFormFile file, CancellationToken cancellationToken)
        {
            try
            {
                if (file is null || file.Length == 0)
                    return BadRequest(ApiResponse<string>.ErrorResponse("No file provided"));

                if (!AllowedContentTypes.Contains(file.ContentType))
                    return BadRequest(ApiResponse<string>.ErrorResponse("Invalid file type. Allowed: jpeg, png, webp"));

                if (file.Length > MaxImageSize)
                    return BadRequest(ApiResponse<string>.ErrorResponse("File size exceeds the 5 MB limit"));

                var panel = await _service.GetPanelByIdAsync(id, cancellationToken);
                if (panel is null)
                    return NotFound(ApiResponse<string>.ErrorResponse($"Panel with ID {id} not found"));

                // Se esiste già un'immagine, la eliminiamo prima
                if (!string.IsNullOrEmpty(panel.ImageUrl))
                {
                    var oldKey = ExtractKeyFromUrl(panel.ImageUrl);
                    if (oldKey is not null)
                        await _imageStorage.DeleteImageAsync(oldKey, cancellationToken);
                }

                var extension = Path.GetExtension(file.FileName)?.ToLowerInvariant() ?? ".jpg";
                var key = $"panels/{id}/image{extension}";

                using var stream = file.OpenReadStream();
                var imageUrl = await _imageStorage.UploadImageAsync(key, stream, file.ContentType, cancellationToken);

                panel.ImageUrl = imageUrl;
                await _service.UpdatePanelAsync(panel, cancellationToken);

                _logger.LogInformation("Uploaded image for panel {Id}", id);
                return Ok(ApiResponse<string>.SuccessResponse(imageUrl, "Image uploaded successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image for panel {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<string>.ErrorResponse("Error uploading image"));
            }
        }

        /// <summary>
        /// DELETE /api/panels/{id}/image — elimina l'immagine di un panel (ADMIN ONLY)
        /// </summary>
        [HttpDelete("{id:guid}/image")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<ApiResponse>> DeleteImage(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var panel = await _service.GetPanelByIdAsync(id, cancellationToken);
                if (panel is null)
                    return NotFound(ApiResponse.ErrorResponse($"Panel with ID {id} not found"));

                if (string.IsNullOrEmpty(panel.ImageUrl))
                    return NotFound(ApiResponse.ErrorResponse("Panel has no image"));

                var key = ExtractKeyFromUrl(panel.ImageUrl);
                if (key is not null)
                    await _imageStorage.DeleteImageAsync(key, cancellationToken);

                panel.ImageUrl = null;
                await _service.UpdatePanelAsync(panel, cancellationToken);

                _logger.LogInformation("Deleted image for panel {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting image for panel {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse.ErrorResponse("Error deleting image"));
            }
        }

        private static string? ExtractKeyFromUrl(string imageUrl)
        {
            // L'URL è nel formato: {publicUrl}/{key}
            // Estraiamo tutto dopo il bucket name nel path
            var panelsIndex = imageUrl.IndexOf("panels/", StringComparison.Ordinal);
            if (panelsIndex >= 0)
                return imageUrl[panelsIndex..];

            return null;
        }
    }
}
