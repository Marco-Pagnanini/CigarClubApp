namespace Users.Application.Dtos
{
    /// <summary>
    /// DTO per le richieste di refresh / logout che portano il refresh token nel body.
    /// </summary>
    public class RefreshRequestDto
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
}
