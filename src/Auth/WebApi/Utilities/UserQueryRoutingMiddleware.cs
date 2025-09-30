using MyProj.WebApi.Controllers;

namespace MyProj.WebApi.Utilities
{
    public class UserQueryRoutingMiddleware(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value?.ToLower();
            if (path == "/api/users")
            {
                if (context.Request.Query.ContainsKey("countrycode") && context.Request.Query.ContainsKey("phone"))
                {
                    context.Request.Path = "/api/users/byphone";
                    context.Request.RouteValues["action"] = nameof(UsersController.GetUserByPhone);
                }
            }

            await next(context);
        }

    }
}
