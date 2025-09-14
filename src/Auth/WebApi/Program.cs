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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
