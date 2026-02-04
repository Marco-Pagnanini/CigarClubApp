# --- Stage 1: Build ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copia i .csproj prima e fa restore (layer cache: se i .csproj non cambiano, restore viene da cache)
COPY Catalog.Core/Catalog.Core.csproj           Catalog.Core/
COPY Catalog.Application/Catalog.Application.csproj   Catalog.Application/
COPY Catalog.Infrastructure/Catalog.Infrastructure.csproj Catalog.Infrastructure/
COPY Catalog.Api/Catalog.Api.csproj             Catalog.Api/
RUN dotnet restore Catalog.Api/Catalog.Api.csproj

# Copia tutto il sorgente e builda
COPY . .
RUN dotnet publish Catalog.Api/Catalog.Api.csproj -c Release -o /app/out

# --- Stage 2: Runtime (immagine finale, piccola) ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/out .

# Porta esterna del container
EXPOSE 8080

ENTRYPOINT ["dotnet", "Catalog.Api.dll"]
