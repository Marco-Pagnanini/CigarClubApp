using Posts.Api.Models;
using Posts.Application.Abstractions.Service;
using Posts.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Posts.Api.Controllers;

/// <summary>
/// API Controller per la gestione dei Post.
/// - GET endpoints: PUBLIC (no auth required)
/// - POST/PUT/DELETE/LIKE endpoints: AUTHENTICATED (JWT required)
/// </summary>
[ApiController]
[Route("api/posts")]
public class PostsController : ControllerBase
{
    private readonly IPostService _service;
    private readonly ILogger<PostsController> _logger;

    public PostsController(IPostService service, ILogger<PostsController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/posts — restituisce tutti i post (PUBLIC)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ICollection<Post>>> GetAll(CancellationToken cancellationToken)
    {
        try
        {
            var posts = await _service.GetAllPostsAsync(cancellationToken);
            _logger.LogInformation("Retrieved {Count} posts", posts.Count);
            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving posts");
            return StatusCode(StatusCodes.Status500InternalServerError,
                ApiResponse.ErrorResponse("Error retrieving posts"));
        }
    }

    /// <summary>
    /// GET /api/posts/{id} — restituisce un post per ID (PUBLIC)
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<Post>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var post = await _service.GetPostByIdAsync(id, cancellationToken);
            if (post is null)
            {
                _logger.LogWarning("Post with ID {Id} not found", id);
                return NotFound(ApiResponse<Post>.ErrorResponse($"Post with ID {id} not found"));
            }

            return Ok(ApiResponse<Post>.SuccessResponse(post, "Post retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving post with ID {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                ApiResponse<Post>.ErrorResponse("Error retrieving post"));
        }
    }

    /// <summary>
    /// GET /api/posts/user/{userId} — restituisce i post di un utente (PUBLIC)
    /// </summary>
    [HttpGet("user/{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ICollection<Post>>> GetByUser(Guid userId, CancellationToken cancellationToken)
    {
        try
        {
            var posts = await _service.GetPostsByUserIdAsync(userId, cancellationToken);
            _logger.LogInformation("Retrieved {Count} posts for user {UserId}", posts.Count, userId);
            return Ok(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving posts for user {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                ApiResponse.ErrorResponse("Error retrieving posts"));
        }
    }

    /// <summary>
    /// POST /api/posts — crea un nuovo post (AUTHENTICATED)
    /// </summary>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<Post>>> Create([FromBody] CreatePostDto dto, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(ApiResponse<Post>.ErrorResponse("Title is required"));

            if (string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest(ApiResponse<Post>.ErrorResponse("Content is required"));

            var userId = GetUserIdFromToken();

            var post = new Post
            {
                UserId = userId,
                Title = dto.Title,
                Content = dto.Content
            };

            var created = await _service.AddPostAsync(post, cancellationToken);
            _logger.LogInformation("User {UserId} created post {PostId}", userId, created.Id);

            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                ApiResponse<Post>.SuccessResponse(created, "Post created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating post");
            return StatusCode(StatusCodes.Status500InternalServerError,
                ApiResponse<Post>.ErrorResponse("Error creating post"));
        }
    }

    /// <summary>
    /// PUT /api/posts/{id} — aggiorna il proprio post (AUTHENTICATED, solo owner)
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Update(Guid id, [FromBody] CreatePostDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var existing = await _service.GetPostByIdAsync(id, cancellationToken);
            if (existing is null)
                return NotFound(ApiResponse.ErrorResponse($"Post with ID {id} not found"));

            var userId = GetUserIdFromToken();
            if (existing.UserId != userId)
                return StatusCode(StatusCodes.Status403Forbidden,
                    ApiResponse.ErrorResponse("You can only update your own posts"));

            existing.Title = dto.Title;
            existing.Content = dto.Content;

            await _service.UpdatePostAsync(existing, cancellationToken);
            _logger.LogInformation("User {UserId} updated post {PostId}", userId, id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating post with ID {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                ApiResponse.ErrorResponse("Error updating post"));
        }
    }

    /// <summary>
    /// DELETE /api/posts/{id} — elimina il proprio post (AUTHENTICATED, solo owner)
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Delete(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var existing = await _service.GetPostByIdAsync(id, cancellationToken);
            if (existing is null)
                return NotFound(ApiResponse.ErrorResponse($"Post with ID {id} not found"));

            var userId = GetUserIdFromToken();
            if (existing.UserId != userId)
                return StatusCode(StatusCodes.Status403Forbidden,
                    ApiResponse.ErrorResponse("You can only delete your own posts"));

            await _service.DeletePostAsync(id, cancellationToken);
            _logger.LogInformation("User {UserId} deleted post {PostId}", userId, id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting post with ID {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                ApiResponse.ErrorResponse("Error deleting post"));
        }
    }

    /// <summary>
    /// POST /api/posts/{id}/like — toggle like su un post (AUTHENTICATED)
    /// </summary>
    [HttpPost("{id:guid}/like")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<bool>>> ToggleLike(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var liked = await _service.ToggleLikeAsync(id, userId, cancellationToken);

            var message = liked ? "Like added" : "Like removed";
            _logger.LogInformation("User {UserId} {Action} post {PostId}", userId, message.ToLower(), id);
            return Ok(ApiResponse<bool>.SuccessResponse(liked, message));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<bool>.ErrorResponse($"Post with ID {id} not found"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling like on post {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                ApiResponse<bool>.ErrorResponse("Error toggling like"));
        }
    }

    /// <summary>
    /// GET /api/posts/{id}/likes — restituisce il numero di like (PUBLIC)
    /// </summary>
    [HttpGet("{id:guid}/likes")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<int>>> GetLikes(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var post = await _service.GetPostByIdAsync(id, cancellationToken);
            if (post is null)
                return NotFound(ApiResponse<int>.ErrorResponse($"Post with ID {id} not found"));

            return Ok(ApiResponse<int>.SuccessResponse(post.LikesCount, "Likes count retrieved"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving likes for post {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                ApiResponse<int>.ErrorResponse("Error retrieving likes"));
        }
    }

    /// <summary>
    /// Estrae l'ID utente dal claim NameIdentifier del JWT token
    /// </summary>
    private Guid GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new UnauthorizedAccessException("User ID not found in token");

        return Guid.Parse(userIdClaim);
    }
}
