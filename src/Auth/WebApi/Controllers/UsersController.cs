using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyProj.WebApi.Models;
using MyProj.WebApi.Repository;
using MyProj.WebApi.Validation;

namespace MyProj.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController(ILogger<UsersController> logger) : ControllerBase
    {
        private readonly ILogger<UsersController> _logger = logger;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers([FromQuery] Pagination pagination)
        {
            var validationErrors = PaginationValidation.Validate<User>(pagination);
            if (validationErrors.Any())
            {
                return BadRequest(new ValidationProblemDetails
                {
                    Title = "Invalid pagination parameters",
                    Errors = validationErrors.ToDictionary(e => "pagination", e => new[] { e })
                });
            }

            using var context = new AuthContext();
            var queryable = context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(pagination.Search))
            {
                var search = pagination.Search.ToLower();
                queryable = queryable.Where(u => u.Name.ToLower().Contains(search) || u.Email.ToLower().Contains(search));
            }

            if (!string.IsNullOrEmpty(pagination.OrderBy))
            {
                var fields = pagination.OrderBy.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                var orderField = fields[0];
                var orderDirection = fields.Length > 1 && fields[1].ToLower() == "desc" ? OrderByDirection.Descending : OrderByDirection.Ascending;

                queryable = orderField.ToLower() switch
                {
                    "id" => orderDirection == OrderByDirection.Ascending ? queryable.OrderBy(u => u.Id) : queryable.OrderByDescending(u => u.Id),
                    "name" => orderDirection == OrderByDirection.Ascending ? queryable.OrderBy(u => u.Name) : queryable.OrderByDescending(u => u.Name),
                    "email" => orderDirection == OrderByDirection.Ascending ? queryable.OrderBy(u => u.Email) : queryable.OrderByDescending(u => u.Email),
                    "avatarurl" => orderDirection == OrderByDirection.Ascending ? queryable.OrderBy(u => u.AvatarUrl) : queryable.OrderByDescending(u => u.AvatarUrl),
                    _ => queryable
                };
            }

            var total = await queryable.CountAsync();

            var users = await queryable
                .Skip(pagination.Page * pagination.PageSize)
                .Take(pagination.PageSize).ToListAsync();

            return Ok(new PagedResult<User>
            {
                Total = total,
                Items = users
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var validationErrors = await UserValidation.ValidateAsync(new User { Id = id }, HttpMethod.Get).ToListAsync();
            if (validationErrors.Any())
            {
                return BadRequest(new ValidationProblemDetails
                {
                    Title = "Invalid user ID",
                    Errors = validationErrors.ToDictionary(e => "id", e => new[] { e })
                });
            }
            using var context = new AuthContext();
            var user = await context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] User user)
        {
            var validationErrors = await UserValidation.ValidateAsync(user, HttpMethod.Post).ToListAsync();
            if (validationErrors.Any())
            {
                return BadRequest(new ValidationProblemDetails
                {
                    Title = "Invalid user data",
                    Errors = validationErrors.ToDictionary(e => "user", e => new[] { e })
                });
            }

            user.Id = Guid.NewGuid().ToString();
            using var context = new AuthContext();
            context.Users.Add(user);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] User updatedUser)
        {
            updatedUser.Id = id;
            var validationErrors = await UserValidation.ValidateAsync(updatedUser, HttpMethod.Put).ToListAsync();
            if (validationErrors.Any())
            {
                return BadRequest(new ValidationProblemDetails
                {
                    Title = "Invalid user data",
                    Errors = validationErrors.ToDictionary(e => "user", e => new[] { e })
                });
            }

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
            var validationErrors = await UserValidation.ValidateAsync(new User { Id = id }, HttpMethod.Delete).ToListAsync();
            if (validationErrors.Any())
            {
                return BadRequest(new ValidationProblemDetails
                {
                    Title = "Invalid user ID",
                    Errors = validationErrors.ToDictionary(e => "id", e => new[] { e })
                });
            }

            using var context = new AuthContext();
            var user = await context.Users.FindAsync(id);
            if (user == null) return NotFound();
            context.Users.Remove(user);
            await context.SaveChangesAsync();
            return NoContent();
        }
    }
}
