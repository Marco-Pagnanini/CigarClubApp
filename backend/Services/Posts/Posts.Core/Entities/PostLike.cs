namespace Posts.Core.Entities;

/// <summary>
/// Like di un utente su un post (un utente puo' mettere un solo like per post)
/// </summary>
public class PostLike
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PostId { get; set; } // FK a Post
    public Guid UserId { get; set; } // ID utente dal JWT (no relazione cross-DB)
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    // Navigation properties
    public Post? Post { get; set; }
}
