# --- Stage 1: Build ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copia i .csproj prima e fa restore (layer cache)
COPY Posts.Core/Posts.Core.csproj                       Posts.Core/
COPY Posts.Application/Posts.Application.csproj         Posts.Application/
COPY Posts.Infrastructure/Posts.Infrastructure.csproj   Posts.Infrastructure/
COPY Posts.Api/Posts.Api.csproj                         Posts.Api/
RUN dotnet restore Posts.Api/Posts.Api.csproj

# Copia tutto il sorgente e builda
COPY . .
RUN dotnet publish Posts.Api/Posts.Api.csproj -c Release -o /app/out

# --- Stage 2: Runtime (immagine finale, piccola) ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/out .

# Porta esterna del container
EXPOSE 8080

ENTRYPOINT ["dotnet", "Posts.Api.dll"]
