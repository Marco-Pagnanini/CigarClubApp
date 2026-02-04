# 🔐 JWT Backend Implementation - Catalog Service

## 📋 Riepilogo delle Modifiche

Questo documento riassume tutte le modifiche apportate al servizio **Catalog** per implementare correttamente l'autenticazione JWT e le best practice di sicurezza.

---

## ✅ Implementazioni Completate

### 1. **JWT Authentication** ✓
- ✅ Configurazione JWT in `Program.cs` con validazione token
- ✅ Lettura delle credenziali da `appsettings.json`
- ✅ Validazione di: Issuer, Audience, Lifetime, Signature Key
- ✅ `[Authorize]` attribute su endpoint protetti

**File modificati:**
- `Program.cs` - Configurazione JWT Bearer authentication

### 2. **CORS Configuration** ✓
- ✅ Configurazione CORS per permettere richieste dal frontend
- ✅ Origins diversi per development e production
- ✅ Support per credentials e metodi HTTP

**File modificati:**
- `Program.cs` - Aggiunta CORS policy
- `appsettings.json` - Aggiunta sezione Cors
- `appsettings.Production.json` - Origins per produzione

**Default origins (Development):**
```
- http://localhost:3000 (React)
- http://localhost:4200 (Angular)
- http://localhost:5173 (Vite)
```

### 3. **Middleware - Exception Handling** ✓
- ✅ Middleware globale per catturare eccezioni
- ✅ Conversione automatica in risposte JSON standardizzate
- ✅ Logging di errori

**File creato:**
- `Middleware/ExceptionHandlingMiddleware.cs`

### 4. **Middleware - JWT Logging** ✓
- ✅ Middleware per logging di richieste autenticate
- ✅ Registrazione di: User ID, Roles, Method, Path, Status Code
- ✅ Utile per audit trail e debugging

**File creato:**
- `Middleware/JwtLoggingMiddleware.cs`

### 5. **API Response Wrapper** ✓
- ✅ Classe `ApiResponse<T>` per risposte standardizzate
- ✅ Wrapper non-generico `ApiResponse` per operazioni senza dati
- ✅ Formato coerente per successi e errori

**File creato:**
- `Models/ApiResponse.cs`

### 6. **Controller Improvements** ✓
- ✅ Response standardizzate con `ApiResponse` wrapper
- ✅ Logging dettagliato in tutti gli endpoint
- ✅ Try-catch per gestione errori robusta
- ✅ Documentazione XML completa
- ✅ ProducesResponseType per Swagger

**File modificato:**
- `Controllers/TobacconistController.cs`

**Endpoint pubblici (GET):**
- `GET /api/tobacconists` - Tutti i prodotti
- `GET /api/tobacconists/{id}` - Prodotto per ID
- `GET /api/tobacconists/code/{code}` - Prodotto per codice

**Endpoint protetti (Admin-only):**
- `POST /api/tobacconists` - Crea nuovo prodotto
- `PUT /api/tobacconists/{id}` - Aggiorna prodotto
- `DELETE /api/tobacconists/{id}` - Elimina prodotto

### 7. **Documentazione Completa** ✓
- ✅ `API_DOCUMENTATION.md` - Documentazione dettagliata di tutti gli endpoint
- ✅ Esempi di curl per ogni endpoint
- ✅ Esempi di request/response
- ✅ Spiegazione autenticazione JWT
- ✅ Guide per Swagger UI

**File creato:**
- `API_DOCUMENTATION.md`

### 8. **Testing File** ✓
- ✅ File `.http` compatibile con VS Code REST Client
- ✅ Tutti gli endpoint con esempi di test
- ✅ Test di scenario di errore

**File creato:**
- `test-api.http`

---

## 📁 Struttura File

```
Catalog.Api/
├── Program.cs                          (Configurazione principale)
├── Controllers/
│   └── TobacconistController.cs        (API endpoints - MIGLIORATO)
├── Middleware/
│   ├── ExceptionHandlingMiddleware.cs  (NUOVO)
│   └── JwtLoggingMiddleware.cs         (NUOVO)
├── Models/
│   └── ApiResponse.cs                  (NUOVO)
├── appsettings.json                    (MODIFICATO - CORS aggiunto)
├── appsettings.Production.json         (MODIFICATO - CORS aggiunto)
├── API_DOCUMENTATION.md                (NUOVO - Documentazione completa)
└── test-api.http                       (NUOVO - File di test)
```

---

## 🔑 JWT Configuration

### appsettings.json

```json
{
  "Jwt": {
    "SecretKey": "CigarClub-Users-SuperSecretKey-Change-In-Production!",
    "Issuer": "CigarClub.Users",
    "Audience": "CigarClub.Clients"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:4200",
      "http://localhost:5173"
    ]
  }
}
```

### Token Usage

```
Authorization: Bearer {JWT_TOKEN}
```

---

## 🧪 Testing

### Con VS Code REST Client

1. Installa extension: "REST Client" by Huachao Mao
2. Apri `test-api.http`
3. Sostituisci `YOUR_JWT_TOKEN_HERE` con un token valido
4. Clicca "Send Request" su ogni endpoint

### Con Swagger UI

```
http://localhost:5000/swagger/index.html
```

1. Clicca "Authorize" in alto a destra
2. Seleziona "Bearer"
3. Incolla il JWT token
4. Clicca "Authorize"
5. Testa gli endpoint direttamente

### Con cURL

```bash
# Richiesta pubblica (GET)
curl http://localhost:5000/api/tobacconists

# Richiesta protetta (POST)
curl -X POST http://localhost:5000/api/tobacconists \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"code":"TEST","category":"Test",...}'
```

---

## 📊 Flusso di Autenticazione

```
1. Client richiede un token al servizio Users (login)
   POST /auth/login → JWT token

2. Client include il token in tutte le richieste protette
   Authorization: Bearer {token}

3. Catalog Service valida il token
   - Controlla firma (SecretKey)
   - Controlla Issuer (CigarClub.Users)
   - Controlla Audience (CigarClub.Clients)
   - Controlla scadenza (lifetime)

4. Se valido, estrae i claims (UserID, Roles)
   [Authorize(Roles = "Admin")] - Verifica il ruolo

5. Se autorizzato, esegue l'operazione
   Se non autorizzato, ritorna 403 Forbidden
   Se token non valido, ritorna 401 Unauthorized
```

---

## 🔒 Sicurezza

### Implementazioni di Sicurezza

✅ **JWT Validation**
- Signature verification (HMAC-SHA256)
- Issuer validation
- Audience validation
- Lifetime validation (token scaduto = non valido)

✅ **Role-Based Authorization**
- Solo Admin può fare POST/PUT/DELETE
- GET endpoints pubblici per consultazione catalogo

✅ **CORS Protection**
- Solo origin autorizzati possono fare richieste
- Previene attacchi cross-origin

✅ **Exception Handling**
- Nessun dettaglio di sistema esposto
- Errori gestiti gracefully
- Logging di tutti gli errori

✅ **Logging**
- Tutte le richieste autenticate sono loggata
- Audit trail per operazioni sensibili
- Facilita debugging e sicurezza

---

## ⚙️ Middleware Order

L'ordine dei middleware è **critico** per la sicurezza:

```csharp
1. ExceptionHandlingMiddleware     // Cattura eccezioni globalmente
2. UseCors()                       // Valida origin CORS
3. JwtLoggingMiddleware            // Loga richieste
4. UseAuthentication()             // Valida JWT token
5. UseAuthorization()              // Valida ruoli e permessi
```

---

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* dati */ },
  "errors": null
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "errors": { /* validation errors se presenti */ }
}
```

---

## 🚀 Deployment

### Environment Variables (Production)

Per la produzione, assicurati di:

1. **Cambiare il JWT SecretKey** (nel appsettings.Production.json)
   ```
   ⚠️ Non usare mai la default key in produzione!
   ```

2. **Configurare CORS Origins corretti**
   ```json
   "Cors": {
     "AllowedOrigins": ["https://yourdomain.com"]
   }
   ```

3. **Disabilitare Swagger in produzione**
   ```csharp
   // Già configurato: Swagger usato solo in Development
   if (app.Environment.IsDevelopment())
   {
       app.UseSwagger();
       app.UseSwaggerUI();
   }
   ```

4. **Verificare le impostazioni di logging**
   ```json
   "Logging": {
     "LogLevel": {
       "Default": "Information",
       "Microsoft.AspNetCore": "Warning"
     }
   }
   ```

---

## 🐛 Troubleshooting

### "401 Unauthorized"
- Token non incluso nell'header `Authorization: Bearer {token}`
- Token è scaduto (controllare ExpiresIn)
- Token signature non valida (SecretKey sbagliato)

### "403 Forbidden"
- Token è valido ma l'utente non ha il ruolo "Admin"
- Verifica che il token contenga il claim `role: "Admin"`

### "CORS Error"
- L'origin della richiesta non è nella lista `AllowedOrigins`
- Verifica che il frontend usa la porta corretta
- Controlla appsettings.json per gli origins configurati

### "Connection String Error"
- Database non raggiungibile
- Verificare host/porta/credenziali in `CatalogDb` connection string

---

## 📚 Risorse Esterne

- [ASP.NET Core JWT Authentication](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/jwt-authn)
- [CORS in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/cors)
- [ASP.NET Core Middleware](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware)
- [JWT.io - JWT Debugger](https://jwt.io/)

---

## ✨ Prossimi Passi (Optional Enhancements)

1. **Token Refresh Mechanism** - Aggiungere refresh token per estendere sessioni
2. **Rate Limiting** - Proteggere da brute force attacks
3. **API Key Support** - Support per application-to-application auth
4. **Audit Logging** - Database logging per compliance requirements
5. **Request Validation** - Aggiungere FluentValidation per validazioni più robuste

---

## 📞 Supporto

Per domande su JWT, CORS, middleware o testing, consulta:
- `API_DOCUMENTATION.md` per dettagli endpoint
- `test-api.http` per esempi di test
- `Program.cs` per configurazione

---

**Data implementazione:** 04/02/2025
**Versione:** 1.0
**Status:** ✅ Produzione-Ready
