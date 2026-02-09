using Posts.Application.Abstractions.Repository;
using Posts.Application.Abstractions.Service;
using Posts.Core.Entities;

namespace Posts.Application.Services;

public class PostService : IPostService
{
    private readonly IPostRepository _repository;

    public PostService(IPostRepository repository)
    {
        _repository = repository;
    }

    public async Task<ICollection<Post>> GetAllPostsAsync(int pageSize, int page, CancellationToken cancellationToken = default)
    {
        var posts = await _repository.GetAllAsync(pageSize,page,cancellationToken);
        return posts.ToList();
    }

    public async Task<Post?> GetPostByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _repository.GetByIdAsync(id, cancellationToken);
    }

    public async Task<ICollection<Post>> GetPostsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var posts = await _repository.GetByUserIdAsync(userId, cancellationToken);
        return posts.ToList();
    }

    public async Task<Post> AddPostAsync(Post post, CancellationToken cancellationToken = default)
    {
        post.Id = Guid.NewGuid();
        post.CreatedAt = DateTimeOffset.UtcNow;
        post.UpdatedAt = DateTimeOffset.UtcNow;
        post.LikesCount = 0;

        await _repository.AddAsync(post, cancellationToken);
        return post;
    }

    public async Task UpdatePostAsync(Post post, CancellationToken cancellationToken = default)
    {
        post.UpdatedAt = DateTimeOffset.UtcNow;
        await _repository.UpdateAsync(post, cancellationToken);
    }

    public async Task DeletePostAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await _repository.DeleteAsync(id, cancellationToken);
    }

    /// <summary>
    /// Toggle like: se l'utente ha gia' messo like lo toglie, altrimenti lo aggiunge.
    /// Ritorna true se il like e' stato aggiunto, false se e' stato rimosso.
    /// </summary>
    public async Task<bool> ToggleLikeAsync(Guid postId, Guid userId, CancellationToken cancellationToken = default)
    {
        var existingLike = await _repository.GetLikeAsync(postId, userId, cancellationToken);
        var post = await _repository.GetByIdAsync(postId, cancellationToken)
            ?? throw new KeyNotFoundException($"Post with ID {postId} not found");

        if (existingLike is not null)
        {
            // Rimuovi like
            await _repository.RemoveLikeAsync(existingLike, cancellationToken);
            post.LikesCount = Math.Max(0, post.LikesCount - 1);
            await _repository.UpdateAsync(post, cancellationToken);
            return false;
        }
        else
        {
            // Aggiungi like
            var like = new PostLike
            {
                PostId = postId,
                UserId = userId
            };
            await _repository.AddLikeAsync(like, cancellationToken);
            post.LikesCount++;
            await _repository.UpdateAsync(post, cancellationToken);
            return true;
        }
    }
}
