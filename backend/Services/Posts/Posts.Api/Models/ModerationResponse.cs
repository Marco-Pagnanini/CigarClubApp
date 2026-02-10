namespace Posts.Api.Models
{
    public class ModerationResponse
    {
        public bool Approved { get; set; }
        public string? Reason { get; set; }
        public List<string> Flags { get; set; } = new();
    }
}
