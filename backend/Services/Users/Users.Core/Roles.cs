namespace Users.Core
{
    /// <summary>
    /// Costanti dei ruoli disponibili nel sistema.
    /// Usate sia nella generazione dei token (Users) sia nella validazione degli endpoint (altri servizi).
    /// </summary>
    public static class Roles
    {
        public const string Admin = "Admin";
        public const string User  = "User";
    }
}
