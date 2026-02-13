using Posts.Core.Entities;

namespace Posts.Application.Abstractions.Repository;

public interface IPostRepository
{
    Task<IEnumerable<Post>> GetAllAsync(int pageSize, int page, Guid userId, CancellationToken cancellationToken = default);
    Task<Post?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Post>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(Post post, CancellationToken cancellationToken = default);
    Task UpdateAsync(Post post, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PostLike?> GetLikeAsync(Guid postId, Guid userId, CancellationToken cancellationToken = default);
    Task AddLikeAsync(PostLike like, CancellationToken cancellationToken = default);
    Task RemoveLikeAsync(PostLike like, CancellationToken cancellationToken = default);
}
