using Posts.Api.Middleware;
using Posts.Application.Abstractions.Repository;
using Posts.Application.Abstractions.Service;
using Posts.Application.Services;
using Posts.Infrastructure.Data;
using Posts.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
var builder = WebApplication.CreateBuilder(args);

// --- CORS Configuration ---
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:3000", "http://localhost:4200", "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// --- DbContext: connessione al Postgres ---
builder.Services.AddDbContext<PostsDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostsDb"))
);

// --- DI: registra interface -> implementazione ---
builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<IPostService, PostService>();


builder.Services.AddHttpClient("ModerationApi", opt =>
{
    var baseUrl = builder.Configuration["ModerationService:BaseUrl"]
        ?? "http://localhost:8083";
    opt.BaseAddress = new Uri(baseUrl);
});
// --- JWT Authentication ---
// Valida i token generati dal servizio Users (stesso SecretKey / Issuer / Audience)
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!)
            )
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers();

// --- Swagger ---
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "CigarClub - Posts Service",
        Version = "v1",
        Description = "API per la gestione dei post e dei like"
    });

    // Autorizzazione Bearer nel Swagger UI
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "Inserisci il JWT access token per gli endpoint protetti",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Auto-migrate: applica le migrations al database all'avvio
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<PostsDbContext>();
        context.Database.Migrate();
        Console.WriteLine("Posts DB migrations applied successfully.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the Posts database.");
        throw;
    }
}

// Swagger attivo solo in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// --- Exception Handling Middleware ---
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Middleware di autenticazione e autorizzazione
app.UseCors("AllowFrontend");

app.UseHttpMetrics();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapMetrics();

app.Run();
