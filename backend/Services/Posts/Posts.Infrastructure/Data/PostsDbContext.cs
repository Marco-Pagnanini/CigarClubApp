using Microsoft.EntityFrameworkCore;
using Posts.Core.Entities;

namespace Posts.Infrastructure.Data;

public class PostsDbContext : DbContext
{
    public DbSet<Post> Posts { get; set; }
    public DbSet<PostLike> PostLikes { get; set; }

    public PostsDbContext(DbContextOptions<PostsDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Post -> PostLikes: 1:N con cascade delete
        modelBuilder.Entity<Post>()
            .HasMany(p => p.Likes)
            .WithOne(l => l.Post)
            .HasForeignKey(l => l.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        // Unique constraint: un utente puo' mettere un solo like per post
        modelBuilder.Entity<PostLike>()
            .HasIndex(l => new { l.PostId, l.UserId })
            .IsUnique();
    }
}
