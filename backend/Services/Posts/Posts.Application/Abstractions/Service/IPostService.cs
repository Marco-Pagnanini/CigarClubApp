using Posts.Core.Entities;

namespace Posts.Application.Abstractions.Service;

public interface IPostService
{
    Task<ICollection<Post>> GetAllPostsAsync(int pageSize, int page,CancellationToken cancellationToken = default);
    Task<Post?> GetPostByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ICollection<Post>> GetPostsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Post> AddPostAsync(Post post, CancellationToken cancellationToken = default);
    Task UpdatePostAsync(Post post, CancellationToken cancellationToken = default);
    Task DeletePostAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> ToggleLikeAsync(Guid postId, Guid userId, CancellationToken cancellationToken = default);
    Task<bool> HasLike(Guid postId, Guid userId, CancellationToken cancellationToken = default);
}
