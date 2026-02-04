# 🚀 Catalog Service - Setup & Usage Guide

## Quick Start

### 1️⃣ Prerequisites
- .NET 9.0
- PostgreSQL running on `localhost:5432`
- A JWT token from the Users service

### 2️⃣ Build & Run

```bash
cd backend/Services/Catalog/Catalog.Api

# Restore dependencies
dotnet restore

# Build
dotnet build

# Run
dotnet run
```

Server starts on: `http://localhost:5000`

### 3️⃣ Test Endpoints

#### Option A: Swagger UI
```
http://localhost:5000/swagger/index.html
```

1. Click "Authorize" button
2. Select "Bearer" scheme
3. Paste your JWT token
4. Start testing!

#### Option B: REST Client Extension (VS Code)
1. Install "REST Client" extension
2. Open `test-api.http`
3. Replace `YOUR_JWT_TOKEN_HERE` with actual token
4. Click "Send Request" on any endpoint

#### Option C: cURL
```bash
# Public endpoint (no auth)
curl http://localhost:5000/api/tobacconists

# Protected endpoint (requires admin token)
curl -X POST http://localhost:5000/api/tobacconists \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"code":"TEST","category":"Test",...}'
```

---

## 📚 Key Files

| File | Purpose | Status |
|------|---------|--------|
| `Program.cs` | Main configuration, DI, middleware setup | ✅ Modified |
| `Controllers/TobacconistController.cs` | API endpoints with JWT protection | ✅ Enhanced |
| `Middleware/ExceptionHandlingMiddleware.cs` | Global error handling | ✅ New |
| `Middleware/JwtLoggingMiddleware.cs` | Request logging for audit trail | ✅ New |
| `Models/ApiResponse.cs` | Standardized response format | ✅ New |
| `appsettings.json` | Development configuration | ✅ Updated |
| `appsettings.Production.json` | Production configuration | ✅ Updated |
| `API_DOCUMENTATION.md` | Complete API reference | ✅ New |
| `test-api.http` | REST Client test file | ✅ New |

---

## 🔐 Authentication Flow

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │ 1. Login request
       ├──────────────────────────────────────┐
       │                                      │
       ▼                                      │
┌──────────────┐                             │
│ Users Service│  2. Returns JWT token       │
└──────────────┘                             │
                                             │
                                      3. Store token
                                             │
                                             ▼
                        ┌─────────────────────────────┐
                        │ Frontend Authorization Header│
                        │ Bearer {JWT_TOKEN}          │
                        └─────────────────────────────┘
                                             │
                        4. Send request with token
                                             │
                                             ▼
                        ┌─────────────────────────────┐
                        │  Catalog Service            │
                        │  - Validate signature       │
                        │  - Check issuer/audience    │
                        │  - Check lifetime           │
                        │  - Verify role permissions  │
                        └─────────────────────────────┘
                                             │
                        5. Allow/Deny based on auth
                                             │
                                             ▼
                        ┌─────────────────────────────┐
                        │  Execute endpoint logic     │
                        └─────────────────────────────┘
```

---

## 📝 API Endpoints Summary

### Public Endpoints (No Authentication)

```
GET    /api/tobacconists              → List all products
GET    /api/tobacconists/{id}         → Get product by ID
GET    /api/tobacconists/code/{code}  → Get product by code
```

### Protected Endpoints (Admin Role Required)

```
POST   /api/tobacconists              → Create new product
PUT    /api/tobacconists/{id}         → Update product
DELETE /api/tobacconists/{id}         → Delete product
```

---

## 🔑 Getting a JWT Token

The JWT token comes from the **Users Service**:

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

⚠️ **Token expires in 1 hour** - You'll need to login again to get a new one.

---

## ⚙️ Configuration

### JWT Settings (appsettings.json)

```json
{
  "Jwt": {
    "SecretKey": "CigarClub-Users-SuperSecretKey-Change-In-Production!",
    "Issuer": "CigarClub.Users",
    "Audience": "CigarClub.Clients"
  }
}
```

⚠️ **CRITICAL:** Change `SecretKey` in production!

### CORS Settings (appsettings.json)

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:4200",
      "http://localhost:5173"
    ]
  }
}
```

These are the default development origins. Update for your frontend URLs.

### Database Connection (appsettings.json)

```json
{
  "ConnectionStrings": {
    "CatalogDb": "Host=localhost;Port=5432;Database=catalog_db;Username=postgres;Password=postgres"
  }
}
```

---

## 🧪 Testing Scenarios

### Test 1: Get All Products (Public)
✅ No authentication required

```bash
curl http://localhost:5000/api/tobacconists
```

Expected: 200 OK with product list

### Test 2: Create Product (Protected)
✅ Requires valid JWT token with Admin role

```bash
curl -X POST http://localhost:5000/api/tobacconists \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"code":"NEW","category":"Premium","description":"New product","priceKg":100,...}'
```

Expected: 201 Created

### Test 3: Invalid Token (Protected)
❌ Should fail without token

```bash
curl -X POST http://localhost:5000/api/tobacconists \
  -H "Content-Type: application/json" \
  -d '{...}'
```

Expected: 401 Unauthorized

### Test 4: Insufficient Permissions (Protected)
❌ Should fail with non-Admin token

If token doesn't have `role: "Admin"` claim:

```bash
curl -X POST http://localhost:5000/api/tobacconists \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

Expected: 403 Forbidden

---

## 🐛 Common Issues

### Issue: "401 Unauthorized"
**Possible causes:**
- Token not included in Authorization header
- Token is expired
- Token signature doesn't match (different SecretKey)

**Solution:**
- Get a new token from Users service
- Ensure token is in format: `Bearer {token}`
- Verify SecretKey matches in all services

### Issue: "403 Forbidden"
**Possible causes:**
- Token is valid but user doesn't have Admin role

**Solution:**
- Login with an admin account
- Check that token includes `"role": "Admin"` claim

### Issue: "CORS Error"
**Error message:** `Access to XMLHttpRequest... blocked by CORS`

**Possible causes:**
- Frontend origin not in `AllowedOrigins`
- Frontend using different port than configured

**Solution:**
- Update `appsettings.json` Cors section
- Add your frontend URL to `AllowedOrigins`
- Restart the service

### Issue: "Connection refused" (Database)
**Possible causes:**
- PostgreSQL not running
- Wrong host/port
- Wrong credentials

**Solution:**
```bash
# Check PostgreSQL is running
psql -U postgres

# Update connection string in appsettings.json
# Default: Host=localhost;Port=5432;Database=catalog_db;Username=postgres;Password=postgres
```

---

## 📊 Middleware Stack

```
┌─────────────────────────────────────────────┐
│ 1. ExceptionHandlingMiddleware              │
│    (Catches all exceptions)                 │
├─────────────────────────────────────────────┤
│ 2. UseCors()                                │
│    (Validates origin)                       │
├─────────────────────────────────────────────┤
│ 3. JwtLoggingMiddleware                     │
│    (Logs authenticated requests)            │
├─────────────────────────────────────────────┤
│ 4. UseAuthentication()                      │
│    (Validates JWT token)                    │
├─────────────────────────────────────────────┤
│ 5. UseAuthorization()                       │
│    (Checks [Authorize] attributes)          │
├─────────────────────────────────────────────┤
│ 6. MapControllers()                         │
│    (Routes to controller actions)           │
└─────────────────────────────────────────────┘
```

---

## 🔍 Debugging

### Enable More Logging
Update `appsettings.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Debug"
    }
  }
}
```

### Check JWT Token Contents
Visit https://jwt.io and paste your token to see:
- Header (algorithm, type)
- Payload (claims like sub, email, role)
- Signature

### View Request/Response
Use VS Code REST Client or Postman to see:
- Request headers (Authorization)
- Response status code
- Response body

---

## 📚 Learn More

- **Full API Docs:** See `API_DOCUMENTATION.md`
- **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`
- **Quick Tests:** See `test-api.http`
- **Security Best Practices:** Check IMPLEMENTATION_SUMMARY.md security section

---

## ✅ Checklist

Before going to production:

- [ ] Change JWT `SecretKey` in `appsettings.Production.json`
- [ ] Update CORS `AllowedOrigins` to production domain
- [ ] Set database connection string for production
- [ ] Disable Swagger UI in production (automatic)
- [ ] Configure logging level for production
- [ ] Test all endpoints with production credentials
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Monitor logs for security issues

---

## 🆘 Support

For issues with:
- **JWT & Authentication:** See `API_DOCUMENTATION.md` → JWT Authentication section
- **CORS:** See `IMPLEMENTATION_SUMMARY.md` → CORS Protection section
- **API Endpoints:** See `API_DOCUMENTATION.md` → Endpoint API section
- **Testing:** See `test-api.http` for examples
- **Middleware:** See `Program.cs` and middleware files

---

**Last Updated:** 04/02/2025
**Version:** 1.0 (Stable)
