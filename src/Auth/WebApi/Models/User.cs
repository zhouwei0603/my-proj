namespace MyProj.WebApi.Models
{
    public class User
    {
        public string Id { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string? Email { get; set; }

        public string? AvatarUrl { get; set; }
    }
}
