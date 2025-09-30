using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyProj.WebApi.Models;
using MyProj.WebApi.Repository;
using MyProj.WebApi.Validation;

namespace MyProj.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController(IDbContextFactory<AuthDbContext> factory, WeChatContext weChat) : ControllerBase
    {
        [HttpGet]
        public Task<IActionResult> GetUsers([FromQuery] Pagination pagination)
        {
            return Execute(async () =>
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

                using var context = factory.CreateDbContext();
                var queryable = context.Users.AsQueryable();

                if (!string.IsNullOrEmpty(pagination.Search))
                {
                    var search = pagination.Search.ToLower();
                    queryable = queryable.Where(u => u.Name.ToLower().Contains(search) || u.Email.ToLower().Contains(search));
                }

                if (string.IsNullOrEmpty(pagination.OrderBy))
                {
                    pagination.OrderBy = "id asc";
                }

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

                var total = await queryable.CountAsync();

                var users = await queryable
                    .Skip(pagination.Page * pagination.PageSize)
                    .Take(pagination.PageSize).ToListAsync();

                return Ok(new PagedResult<User>
                {
                    Total = total,
                    Items = users
                });
            });
        }

        [HttpGet("{id}")]
        public Task<IActionResult> GetUser(string id)
        {
            return Execute(async () =>
            {
                var validationErrors = await UserValidation.ValidateAsync(new User { Id = id }, HttpMethod.Get, factory).ToListAsync();
                if (validationErrors.Any())
                {
                    return BadRequest(new ValidationProblemDetails
                    {
                        Title = "Invalid user ID",
                        Errors = validationErrors.ToDictionary(e => "id", e => new[] { e })
                    });
                }
                using var context = factory.CreateDbContext();
                var user = await context.Users.FindAsync(id);
                if (user == null) return NotFound();
                return Ok(user);
            });
        }

        [HttpGet("byphone")]
        public Task<IActionResult> GetUserByPhone(string countryCode, string phone)
        {
            return Execute(async () =>
            {
                var validationErrors = UserValidation.ValidatePhone(new User { CountryCode = countryCode, Phone = phone });
                if (validationErrors.Any())
                {
                    return BadRequest(new ValidationProblemDetails
                    {
                        Title = "Invalid user phone number",
                        Errors = validationErrors.ToDictionary(e => "phone", e => new[] { e })
                    });
                }
                using var context = factory.CreateDbContext();
                var user = await context.Users.FirstOrDefaultAsync(u => u.CountryCode == countryCode && u.Phone == phone);
                if (user == null) return NotFound();
                return Ok(user);
            });
        }

        [HttpGet("bywechatcode")]
        public Task<IActionResult> GetUserByWeChatCode(string code)
        {
            return Execute(async () =>
            {
                var validationErrors = WeChatValidation.ValidateCode(code);
                if (validationErrors.Any())
                {
                    return BadRequest(new ValidationProblemDetails
                    {
                        Title = "Invalid code",
                        Errors = validationErrors.ToDictionary(e => "code", e => new[] { e })
                    });
                }
                var session = await weChat.GetCode2SessionAsync(code);
                using var context = factory.CreateDbContext();
                var user = await context.Users.FirstOrDefaultAsync(u => u.WeChatOpenId == session.OpenId);
                if (user == null) return NotFound();
                return Ok(user);
            });
        }

        [HttpGet("wechatcode2session")]
        public Task<IActionResult> GetWeChatCode2Session(string code)
        {
            return Execute(async () =>
            {
                var validationErrors = WeChatValidation.ValidateCode(code);
                if (validationErrors.Any())
                {
                    return BadRequest(new ValidationProblemDetails
                    {
                        Title = "Invalid code",
                        Errors = validationErrors.ToDictionary(e => "code", e => new[] { e })
                    });
                }
                var response = await weChat.GetCode2SessionAsync(code);
                return Ok(response);
            });
        }

        [HttpPost]
        public Task<IActionResult> CreateUser([FromBody] User user)
        {
            return Execute(async () =>
            {
                var validationErrors = await UserValidation.ValidateAsync(user, HttpMethod.Post, factory).ToListAsync();
                if (validationErrors.Any())
                {
                    return BadRequest(new ValidationProblemDetails
                    {
                        Title = "Invalid user data",
                        Errors = validationErrors.ToDictionary(e => "user", e => new[] { e })
                    });
                }

                user.Id = Guid.NewGuid().ToString();
                using var context = factory.CreateDbContext();
                context.Users.Add(user);
                await context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            });
        }

        [HttpPut("{id}")]
        public Task<IActionResult> UpdateUser(string id, [FromBody] User updatedUser)
        {
            return Execute(async () =>
            {
                updatedUser.Id = id;
                var validationErrors = await UserValidation.ValidateAsync(updatedUser, HttpMethod.Put, factory).ToListAsync();
                if (validationErrors.Any())
                {
                    return BadRequest(new ValidationProblemDetails
                    {
                        Title = "Invalid user data",
                        Errors = validationErrors.ToDictionary(e => "user", e => new[] { e })
                    });
                }

                using var context = factory.CreateDbContext();
                var user = await context.Users.FindAsync(id);
                if (user == null) return NotFound();

                user.Name = updatedUser.Name;
                user.Email = updatedUser.Email;
                user.AvatarUrl = updatedUser.AvatarUrl;
                await context.SaveChangesAsync();
                return NoContent();
            });
        }

        [HttpDelete("{id}")]
        public Task<IActionResult> DeleteUser(string id)
        {
            return Execute(async () =>
            {
                var validationErrors = await UserValidation.ValidateAsync(new User { Id = id }, HttpMethod.Delete, factory).ToListAsync();
                if (validationErrors.Any())
                {
                    return BadRequest(new ValidationProblemDetails
                    {
                        Title = "Invalid user ID",
                        Errors = validationErrors.ToDictionary(e => "id", e => new[] { e })
                    });
                }

                using var context = factory.CreateDbContext();
                var user = await context.Users.FindAsync(id);
                if (user == null) return NotFound();
                context.Users.Remove(user);
                await context.SaveChangesAsync();
                return NoContent();
            });
        }

        private async Task<IActionResult> Execute(Func<Task<IActionResult>> func)
        {
            try
            {
                return await func();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
