using Microsoft.EntityFrameworkCore;
using MyProj.WebApi.Models;

namespace MyProj.WebApi.Repository
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext()
            : base()
        {
        }

        public AuthDbContext(DbContextOptions<AuthDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
    }
}
