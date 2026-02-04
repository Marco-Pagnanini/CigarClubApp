# --- Stage 1: Build ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copia i .csproj prima e fa restore (layer cache: se i .csproj non cambiano, restore viene da cache)
COPY Users.Core/Users.Core.csproj                       Users.Core/
COPY Users.Application/Users.Application.csproj         Users.Application/
COPY Users.Infrastructure/Users.Infrastructure.csproj   Users.Infrastructure/
COPY Users.Api/Users.Api.csproj                         Users.Api/
RUN dotnet restore Users.Api/Users.Api.csproj

# Copia tutto il sorgente e builda
COPY . .
RUN dotnet publish Users.Api/Users.Api.csproj -c Release -o /app/out

# --- Stage 2: Runtime (immagine finale, piccola) ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/out .

# Porta esterna del container
EXPOSE 8080

ENTRYPOINT ["dotnet", "Users.Api.dll"]
