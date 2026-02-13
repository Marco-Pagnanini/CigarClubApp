namespace Posts.Core.Entities;

/// <summary>
/// Post creato da un utente autenticato
/// </summary>
public class Post
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; } // ID utente dal JWT (no relazione cross-DB)
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int LikesCount { get; set; } = 0; // Contatore denormalizzato per performance
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;


    // Navigation properties
    public ICollection<PostLike> Likes { get; set; } = [];
}
