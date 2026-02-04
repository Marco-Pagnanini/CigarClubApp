namespace Users.Application.Dtos
{
    /// <summary>
    /// DTO per la richiesta di login.
    /// </summary>
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
