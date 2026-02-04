# 🍃 CigarClub Catalog Service

A secure, scalable microservice for managing the CigarClub product catalog. Built with ASP.NET Core 9.0, featuring JWT authentication, CORS support, and comprehensive API documentation.

---

## 🎯 Features

### 🔐 Security
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-Based Authorization** - Admin-only endpoints for mutations
- ✅ **CORS Protection** - Configurable cross-origin resource sharing
- ✅ **Exception Handling** - Global error handling with proper HTTP status codes
- ✅ **Audit Logging** - Track all authenticated requests

### 📍 API Endpoints
- **6 RESTful endpoints** for product management
- **3 public endpoints** (GET) - No authentication required
- **3 protected endpoints** (POST/PUT/DELETE) - Admin role required
- **Standardized response format** - Consistent JSON structure
- **Swagger UI** - Interactive API documentation

### 🛠️ Architecture
- **Clean Architecture** - Separation of concerns (API, Application, Infrastructure)
- **Dependency Injection** - Loosely coupled components
- **Entity Framework Core** - PostgreSQL database integration
- **Middleware Pipeline** - Extensible request processing

### 📚 Documentation
- **API_DOCUMENTATION.md** - Complete endpoint reference with examples
- **SETUP_GUIDE.md** - Quick start and troubleshooting guide
- **IMPLEMENTATION_SUMMARY.md** - Architecture and security details
- **test-api.http** - REST Client test file with all scenarios
- **CHANGES.md** - Detailed changelog of modifications

---

## 🚀 Quick Start

### Prerequisites
- .NET 9.0 SDK
- PostgreSQL 12+ running on `localhost:5432`
- A JWT token from the Users service

### Setup

```bash
# Navigate to project
cd backend/Services/Catalog/Catalog.Api

# Restore dependencies
dotnet restore

# Build
dotnet build

# Run
dotnet run
```

Server runs on: `http://localhost:5000`

### Test Endpoints

```bash
# Get all products (public)
curl http://localhost:5000/api/tobacconists

# Or visit Swagger UI
open http://localhost:5000/swagger/index.html
```

---

## 📚 Documentation

Start with the appropriate guide based on your needs:

| Document | Purpose | For |
|----------|---------|-----|
| **SETUP_GUIDE.md** | Quick start and common issues | Getting up and running |
| **API_DOCUMENTATION.md** | Complete endpoint reference | API consumers |
| **IMPLEMENTATION_SUMMARY.md** | Architecture and security | System design review |
| **test-api.http** | Interactive endpoint testing | Testing and validation |
| **CHANGES.md** | Detailed changelog | Understanding what changed |

---

## 🔑 Authentication

### Getting a Token

Request from Users service:

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
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### Using the Token

Include in all protected requests:

```bash
Authorization: Bearer {token}
```

---

## 📍 API Endpoints

### Public Endpoints (No Auth Required)

```
GET    /api/tobacconists              List all products
GET    /api/tobacconists/{id}         Get product by ID
GET    /api/tobacconists/code/{code}  Get product by code
```

### Protected Endpoints (Admin Role Required)

```
POST   /api/tobacconists              Create new product
PUT    /api/tobacconists/{id}         Update product
DELETE /api/tobacconists/{id}         Delete product
```

---

## 📝 Project Structure

```
Catalog.Api/
├── Program.cs                          Main configuration and DI setup
├── Controllers/
│   └── TobacconistController.cs       API endpoints with JWT protection
├── Middleware/
│   ├── ExceptionHandlingMiddleware.cs Global exception handler
│   └── JwtLoggingMiddleware.cs        Request audit logging
├── Models/
│   └── ApiResponse.cs                 Standardized response wrapper
├── appsettings.json                   Development configuration
├── appsettings.Production.json        Production configuration
└── Properties/
    └── launchSettings.json            Launch profiles

Catalog.Application/
├── Abstractions/
│   ├── Repository/
│   │   └── ITobacconistRepository.cs
│   └── Service/
│       └── ITobacconistService.cs
└── Services/
    └── TobacconistService.cs          Business logic

Catalog.Infrastructure/
├── Data/
│   └── CatalogDbContext.cs           EF Core DbContext
├── Repositories/
│   └── TobacconistRepository.cs       Data access
└── Migrations/
    └── *InitialMigration.cs           Database migrations

Catalog.Core/
└── Entities/
    ├── Tobacconist.cs                 Product entity
    └── Barcode.cs                     Barcode entity

Documentation/
├── API_DOCUMENTATION.md               API reference
├── SETUP_GUIDE.md                     Getting started
├── IMPLEMENTATION_SUMMARY.md          Architecture details
├── CHANGES.md                         Changelog
├── test-api.http                      Test scenarios
└── README.md                          This file
```

---

## 🧪 Testing

### Option 1: REST Client (VS Code)
1. Install "REST Client" extension
2. Open `test-api.http`
3. Replace token placeholder
4. Click "Send Request"

### Option 2: Swagger UI
```
http://localhost:5000/swagger/index.html
```
1. Click "Authorize"
2. Enter Bearer token
3. Test endpoints

### Option 3: cURL
```bash
curl -X GET http://localhost:5000/api/tobacconists \
  -H "Authorization: Bearer {token}"
```

---

## ⚙️ Configuration

### JWT Settings
```json
{
  "Jwt": {
    "SecretKey": "YOUR_SECRET_KEY",
    "Issuer": "CigarClub.Users",
    "Audience": "CigarClub.Clients"
  }
}
```

### CORS Settings
```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:4200"
    ]
  }
}
```

### Database Connection
```json
{
  "ConnectionStrings": {
    "CatalogDb": "Host=localhost;Port=5432;Database=catalog_db;Username=postgres;Password=postgres"
  }
}
```

---

## 🔒 Security Features

### JWT Validation
- Signature verification (HMAC-SHA256)
- Issuer and audience validation
- Token expiration checking
- Claims extraction

### Authorization
- Role-based access control (Admin-only endpoints)
- Endpoint-level authorization attributes
- Fine-grained permission management

### CORS Protection
- Origin whitelist
- Method restrictions
- Header validation
- Credential support

### Error Handling
- Global exception catching
- Secure error messages (no stack traces)
- Proper HTTP status codes
- Comprehensive logging

---

## 📊 Response Format

All responses follow a standardized format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ },
  "errors": null
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "errors": { /* validation errors if any */ }
}
```

---

## 🐛 Troubleshooting

### "401 Unauthorized"
- Token missing or invalid
- Token signature doesn't match
- Token has expired

**Solution:** Get a new token from Users service

### "403 Forbidden"
- Token valid but user lacks Admin role

**Solution:** Use an admin account to generate token

### "CORS Error"
- Frontend origin not in AllowedOrigins

**Solution:** Update `appsettings.json` CORS section

See **SETUP_GUIDE.md** for more troubleshooting tips.

---

## 📈 Performance

- Asynchronous operations throughout
- Proper database indexing
- Connection pooling
- Logging optimization
- Exception handling efficiency

---

## 🔄 CI/CD Integration

Service includes:
- ✅ Swagger API documentation
- ✅ Comprehensive error handling
- ✅ Audit logging
- ✅ Health check ready
- ✅ Docker-ready configuration

---

## 🚀 Production Deployment

Before deploying to production:

1. **Security**
   - [ ] Change JWT SecretKey
   - [ ] Update CORS AllowedOrigins
   - [ ] Set secure database credentials

2. **Configuration**
   - [ ] Review appsettings.Production.json
   - [ ] Configure logging level
   - [ ] Set up database backups

3. **Verification**
   - [ ] Test all endpoints
   - [ ] Verify authentication
   - [ ] Check CORS headers
   - [ ] Monitor logs

See **SETUP_GUIDE.md** "Production Deployment" section for checklist.

---

## 📞 Support & Documentation

- **API Reference:** `API_DOCUMENTATION.md`
- **Setup Help:** `SETUP_GUIDE.md`
- **Architecture:** `IMPLEMENTATION_SUMMARY.md`
- **Changelog:** `CHANGES.md`
- **Testing:** `test-api.http`

---

## 📄 License

© 2025 CigarClub. All rights reserved.

---

## 🙏 Contributing

For modifications or improvements:
1. Create a feature branch
2. Implement changes
3. Test thoroughly
4. Create a pull request
5. Update documentation

---

## ✨ Key Technologies

- **Framework:** ASP.NET Core 9.0
- **Authentication:** JWT Bearer tokens
- **Database:** PostgreSQL with EF Core
- **API Documentation:** Swagger/OpenAPI
- **Logging:** Built-in ILogger

---

## 🎓 Learning Resources

This implementation demonstrates:
- JWT authentication in ASP.NET Core
- Middleware pipeline and custom middleware
- Clean architecture principles
- Dependency injection and SOLID principles
- RESTful API design
- Exception handling best practices
- Documentation best practices

---

## 🔗 Related Services

- **Users Service** - Handles authentication and token generation
- **Frontend** - React/Angular/Vue consuming this API

---

**Version:** 1.0
**Status:** ✅ Production-Ready
**Last Updated:** 04/02/2025
