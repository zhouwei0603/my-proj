using Microsoft.EntityFrameworkCore;
using MyProj.WebApi.Models;

namespace MyProj.WebApi.Repository
{
    public class AuthContext : DbContext
    {
        public AuthContext()
            : base()
        {
        }

        public AuthContext(DbContextOptions<AuthContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // TODO: Move connection string to configuration file
            optionsBuilder.UseMySQL("server=localhost;port=3308;database=mytest;user=weizhou;password=Password01!");
        }
    }
}
