using Catalog.Api.Middleware;
using Catalog.Application.Abstractions.Repository;
using Catalog.Application.Abstractions.Service;
using Catalog.Application.Services;
using Catalog.Infrastructure.Data;
using Catalog.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- CORS Configuration ---
// Permette le richieste dal frontend
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
// La connection string la mettiamo in appsettings.json (per ora placeholder)
builder.Services.AddDbContext<CatalogDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("CatalogDb"))
);

// --- DI: registra interface -> implementazione ---
builder.Services.AddScoped<ITobacconistRepository, TobacconistRepository>();
builder.Services.AddScoped<ITobacconistService, TobacconistService>();

// ─── JWT Authentication ─────────────────────────────────────────────────────
// Valida i token generati dal servizio Users (stesso SecretKey / Issuer / Audience)
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidIssuer              = builder.Configuration["Jwt:Issuer"],
            ValidateAudience         = true,
            ValidAudience            = builder.Configuration["Jwt:Audience"],
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey         = new SymmetricSecurityKey(
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
        Title = "CigarClub – Catalog Service",
        Version = "v1",
        Description = "API per la gestione del catalogo dei prodotti"
    });

    // Autorizzazione Bearer nel Swagger UI
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description  = "Inserisci il JWT access token (ruolo Admin per POST/PUT/DELETE)",
        Type         = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme       = "Bearer",
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

// Swagger attivo solo in Development (non in produzione/Docker)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// --- Exception Handling Middleware (deve essere primo) ---
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Middleware di autenticazione e autorizzazione
app.UseCors("AllowFrontend");
app.UseMiddleware<JwtLoggingMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
