using Microsoft.EntityFrameworkCore;
using MyProj.WebApi.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add MySQL connection
{
    const string key = "DefaultMySqlConnection";
    var connectionString = builder.Configuration.GetConnectionString(key) ?? throw new InvalidOperationException($"Connection string '{key}' is not found.");
    builder.Services.AddDbContextFactory<AuthDbContext>(options => options.UseMySQL(connectionString));
}

// WeChat helper
{
    const string key = "WeChatSnsEndpoint";
    var snsEndpoint = builder.Configuration[key] ?? throw new InvalidOperationException($"The configuration '{key}' is not found.");
    builder.Services.AddSingleton(new WeChatContext(snsEndpoint));
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
