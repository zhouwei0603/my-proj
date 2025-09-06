using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyProj.WebApi.Models;
using MyProj.WebApi.Repository;

namespace MyProj.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;

        public UsersController(ILogger<UsersController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            using var context = new AuthContext();
            var users = await context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            using var context = new AuthContext();
            var user = await context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User User)
        {
            User.Id = Guid.NewGuid().ToString();
            using var context = new AuthContext();
            context.Users.Add(User);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = User.Id }, User);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, User updatedUser)
        {
            using var context = new AuthContext();
            var user = await context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Name = updatedUser.Name;
            user.Email = updatedUser.Email;
            user.AvatarUrl = updatedUser.AvatarUrl;
            await context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            using var context = new AuthContext();
            var user = await context.Users.FindAsync(id);
            if (user == null) return NotFound();
            context.Users.Remove(user);
            await context.SaveChangesAsync();
            return NoContent();
        }
    }
}
