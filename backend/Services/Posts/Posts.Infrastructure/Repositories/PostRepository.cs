using Microsoft.EntityFrameworkCore;
using Posts.Application.Abstractions.Repository;
using Posts.Core.Entities;
using Posts.Infrastructure.Data;

namespace Posts.Infrastructure.Repositories;

public class PostRepository : IPostRepository
{
    private readonly PostsDbContext _context;

    public PostRepository(PostsDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Post>> GetAllAsync(int pageSize, int page, CancellationToken cancellationToken = default)
    {
        if (page < 1) page = 1;

        return await _context.Posts
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize) 
            .Take(pageSize)             
            .ToListAsync(cancellationToken);
    }

    public async Task<Post?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Posts
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Post>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Posts
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Post post, CancellationToken cancellationToken = default)
    {
        _context.Posts.Add(post);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Post post, CancellationToken cancellationToken = default)
    {
        var isTracked = _context.Posts.Local.Any(p => p.Id == post.Id);
        if(isTracked)
        {
            _context.Entry(post).State = EntityState.Modified;
        }
        else
        {
            _context.Posts.Update(post);
        }
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var post = await _context.Posts.FindAsync(new object[] { id }, cancellationToken);
        if (post is not null)
        {
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<PostLike?> GetLikeAsync(Guid postId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.PostLikes
            .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId, cancellationToken);
    }

    public async Task AddLikeAsync(PostLike like, CancellationToken cancellationToken = default)
    {
        _context.PostLikes.Add(like);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveLikeAsync(PostLike like, CancellationToken cancellationToken = default)
    {
        _context.PostLikes.Remove(like);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
