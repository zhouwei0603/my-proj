using Microsoft.EntityFrameworkCore;
using MyProj.WebApi.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add MySQL connection
{
    var key = "DefaultMySqlConnection";
    var connectionString = builder.Configuration.GetConnectionString(key) ?? throw new InvalidOperationException($"Connection string '{key}' is not found.");
    builder.Services.AddDbContextFactory<AuthDbContext>(options => options.UseMySQL(connectionString));
}

// WeChat helper
{
    var appIdKey = "WeChatAppId";
    var appId = builder.Configuration[appIdKey] ?? throw new InvalidOperationException($"The configuration '{appIdKey}' is not found.");
    var secretKey = "WeChatAppSecret";
    var secret = builder.Configuration[secretKey] ?? throw new InvalidOperationException($"The configuration '{secretKey}' is not found.");
    var snsEndpointKey = "WeChatSnsEndpoint";
    var snsEndpoint = builder.Configuration[snsEndpointKey] ?? throw new InvalidOperationException($"The configuration '{snsEndpointKey}' is not found.");
    builder.Services.AddSingleton(new WeChatCommunicator(appId, secret, snsEndpoint));
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

// Change the route configuration before ASP.NET handles the routing
app.UseMiddleware<UserQueryRoutingMiddleware>();

app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(e => { });

app.Run();
