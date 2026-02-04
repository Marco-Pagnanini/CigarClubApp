# 🍃 CigarClub Catalog Service - API Documentation

## Panoramica

Il servizio **Catalog** gestisce il catalogo dei prodotti (Tobacconist) del CigarClub. Tutti gli endpoint sono protetti con **JWT Authentication** (dove richiesto).

---

## 🔐 Autenticazione JWT

### Configurazione

L'autenticazione JWT è configurata in `Program.cs` e legge le impostazioni da `appsettings.json`:

```json
"Jwt": {
  "SecretKey": "CigarClub-Users-SuperSecretKey-Change-In-Production!",
  "Issuer": "CigarClub.Users",
  "Audience": "CigarClub.Clients"
}
```

### Utilizzo del Token

Per accedere agli endpoint protetti, includi il token JWT nell'header `Authorization`:

```
Authorization: Bearer {token}
```

### Endpoint Pubblici vs Protetti

| Metodo | Endpoint | Autenticazione | Autorizzazione |
|--------|----------|---|---|
| **GET** | `/api/tobacconists` | ❌ No | - |
| **GET** | `/api/tobacconists/{id}` | ❌ No | - |
| **GET** | `/api/tobacconists/code/{code}` | ❌ No | - |
| **POST** | `/api/tobacconists` | ✅ Sì | Admin |
| **PUT** | `/api/tobacconists/{id}` | ✅ Sì | Admin |
| **DELETE** | `/api/tobacconists/{id}` | ✅ Sì | Admin |

---

## 📍 Endpoint API

### 1. GET `/api/tobacconists` - Ottieni tutti i prodotti

**Descrizione:** Restituisce una lista di tutti i prodotti disponibili nel catalogo.

**Autenticazione:** ❌ No

**Esempio di richiesta:**

```bash
curl -X GET http://localhost:5000/api/tobacconists \
  -H "Content-Type: application/json"
```

**Esempio di risposta (200 OK):**

```json
{
  "success": true,
  "message": "Tobacconists retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "CUB-001",
      "category": "Cubani",
      "description": "Prodotto di qualità premium",
      "priceKg": 150.50,
      "stackPrice": 25.00,
      "stackType": "Box",
      "currentPricingValidity": "2025-02-04T00:00:00Z",
      "nextPrice": 160.00,
      "nextStackPrice": 26.00,
      "nextPricingValidity": "2025-03-04T00:00:00Z",
      "barcodes": []
    }
  ],
  "errors": null
}
```

---

### 2. GET `/api/tobacconists/{id}` - Ottieni un prodotto per ID

**Descrizione:** Restituisce i dettagli di un prodotto specifico.

**Autenticazione:** ❌ No

**Parametri:**
- `id` (path) - UUID del prodotto (es: `550e8400-e29b-41d4-a716-446655440000`)

**Esempio di richiesta:**

```bash
curl -X GET http://localhost:5000/api/tobacconists/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json"
```

**Esempio di risposta (200 OK):**

```json
{
  "success": true,
  "message": "Tobacconist retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "CUB-001",
    "category": "Cubani",
    "description": "Prodotto di qualità premium",
    "priceKg": 150.50,
    "stackPrice": 25.00,
    "stackType": "Box",
    "currentPricingValidity": "2025-02-04T00:00:00Z",
    "nextPrice": 160.00,
    "nextStackPrice": 26.00,
    "nextPricingValidity": "2025-03-04T00:00:00Z",
    "barcodes": []
  },
  "errors": null
}
```

**Esempio di risposta (404 Not Found):**

```json
{
  "success": false,
  "message": "Tobacconist with ID 550e8400-e29b-41d4-a716-446655440000 not found",
  "data": null,
  "errors": null
}
```

---

### 3. GET `/api/tobacconists/code/{code}` - Ottieni un prodotto per codice

**Descrizione:** Restituisce un prodotto cercato per il suo codice univoco.

**Autenticazione:** ❌ No

**Parametri:**
- `code` (path) - Codice univoco del prodotto (es: `CUB-001`)

**Esempio di richiesta:**

```bash
curl -X GET http://localhost:5000/api/tobacconists/code/CUB-001 \
  -H "Content-Type: application/json"
```

**Esempio di risposta (200 OK):**

```json
{
  "success": true,
  "message": "Tobacconist retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "CUB-001",
    "category": "Cubani",
    "description": "Prodotto di qualità premium",
    "priceKg": 150.50,
    "stackPrice": 25.00,
    "stackType": "Box",
    "currentPricingValidity": "2025-02-04T00:00:00Z",
    "nextPrice": 160.00,
    "nextStackPrice": 26.00,
    "nextPricingValidity": "2025-03-04T00:00:00Z",
    "barcodes": []
  },
  "errors": null
}
```

---

### 4. POST `/api/tobacconists` - Crea un nuovo prodotto

**Descrizione:** Crea un nuovo prodotto nel catalogo. **Richiede autenticazione JWT con ruolo Admin.**

**Autenticazione:** ✅ Sì (JWT Token + Admin Role)

**Header richiesto:**

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body della richiesta:**

```json
{
  "code": "CUB-002",
  "category": "Cubani Premium",
  "description": "Prodotto nuovo di qualità eccellente",
  "priceKg": 180.00,
  "stackPrice": 30.00,
  "stackType": "Box",
  "currentPricingValidity": "2025-02-04T00:00:00Z",
  "nextPrice": 190.00,
  "nextStackPrice": 31.00,
  "nextPricingValidity": "2025-03-04T00:00:00Z"
}
```

**Esempio di richiesta completa:**

```bash
curl -X POST http://localhost:5000/api/tobacconists \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CUB-002",
    "category": "Cubani Premium",
    "description": "Prodotto nuovo",
    "priceKg": 180.00,
    "stackPrice": 30.00,
    "stackType": "Box",
    "currentPricingValidity": "2025-02-04T00:00:00Z",
    "nextPrice": 190.00,
    "nextStackPrice": 31.00,
    "nextPricingValidity": "2025-03-04T00:00:00Z"
  }'
```

**Esempio di risposta (201 Created):**

```json
{
  "success": true,
  "message": "Tobacconist created successfully",
  "data": {
    "id": "660f9411-f30c-52e5-b727-557766551111",
    "code": "CUB-002",
    "category": "Cubani Premium",
    "description": "Prodotto nuovo",
    "priceKg": 180.00,
    "stackPrice": 30.00,
    "stackType": "Box",
    "currentPricingValidity": "2025-02-04T00:00:00Z",
    "nextPrice": 190.00,
    "nextStackPrice": 31.00,
    "nextPricingValidity": "2025-03-04T00:00:00Z",
    "barcodes": []
  },
  "errors": null
}
```

**Errori possibili:**

- **401 Unauthorized** - Token mancante o non valido
- **403 Forbidden** - Token valido ma non hai il ruolo Admin
- **500 Internal Server Error** - Errore durante la creazione

---

### 5. PUT `/api/tobacconists/{id}` - Aggiorna un prodotto

**Descrizione:** Aggiorna un prodotto esistente. **Richiede autenticazione JWT con ruolo Admin.**

**Autenticazione:** ✅ Sì (JWT Token + Admin Role)

**Parametri:**
- `id` (path) - UUID del prodotto da aggiornare

**Header richiesto:**

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body della richiesta:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "CUB-001",
  "category": "Cubani Premium Updated",
  "description": "Descrizione aggiornata",
  "priceKg": 155.00,
  "stackPrice": 26.00,
  "stackType": "Box",
  "currentPricingValidity": "2025-02-04T00:00:00Z",
  "nextPrice": 165.00,
  "nextStackPrice": 27.00,
  "nextPricingValidity": "2025-03-04T00:00:00Z"
}
```

**Esempio di richiesta completa:**

```bash
curl -X PUT http://localhost:5000/api/tobacconists/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "CUB-001",
    "category": "Cubani Premium Updated",
    "description": "Descrizione aggiornata",
    "priceKg": 155.00,
    "stackPrice": 26.00,
    "stackType": "Box",
    "currentPricingValidity": "2025-02-04T00:00:00Z",
    "nextPrice": 165.00,
    "nextStackPrice": 27.00,
    "nextPricingValidity": "2025-03-04T00:00:00Z"
  }'
```

**Esempio di risposta (204 No Content):**

```
(nessun body, solo status code 204)
```

**Errori possibili:**

- **400 Bad Request** - ID nel URL non corrisponde all'ID nel body
- **401 Unauthorized** - Token mancante o non valido
- **403 Forbidden** - Token valido ma non hai il ruolo Admin
- **404 Not Found** - Prodotto con ID non trovato
- **500 Internal Server Error** - Errore durante l'aggiornamento

---

### 6. DELETE `/api/tobacconists/{id}` - Elimina un prodotto

**Descrizione:** Elimina un prodotto dal catalogo. **Richiede autenticazione JWT con ruolo Admin.**

**Autenticazione:** ✅ Sì (JWT Token + Admin Role)

**Parametri:**
- `id` (path) - UUID del prodotto da eliminare

**Header richiesto:**

```
Authorization: Bearer {JWT_TOKEN}
```

**Esempio di richiesta:**

```bash
curl -X DELETE http://localhost:5000/api/tobacconists/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Esempio di risposta (204 No Content):**

```
(nessun body, solo status code 204)
```

**Errori possibili:**

- **401 Unauthorized** - Token mancante o non valido
- **403 Forbidden** - Token valido ma non hai il ruolo Admin
- **404 Not Found** - Prodotto con ID non trovato
- **500 Internal Server Error** - Errore durante l'eliminazione

---

## 🔑 Ottenere un JWT Token

Per testare gli endpoint protetti, devi prima ottenere un token dal servizio **Users**:

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

Risposta:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "errors": null
}
```

Copia il token dalla risposta e usalo in tutti gli endpoint protetti.

---

## 🧪 Test con Swagger UI

Il servizio include Swagger UI per testare gli endpoint interattivamente:

```
http://localhost:5000/swagger/index.html
```

### Come usare Swagger per testare gli endpoint protetti:

1. Apri `http://localhost:5000/swagger/index.html`
2. Clicca su **"Authorize"** in alto a destra
3. Seleziona **"Bearer"** e incolla il JWT token nel campo di testo
4. Clicca **"Authorize"** per confermare
5. Ora puoi testare gli endpoint protetti direttamente da Swagger

---

## 🛠️ CORS Configuration

Il servizio è configurato per accettare richieste da:

**Sviluppo (appsettings.json):**
- `http://localhost:3000` (React)
- `http://localhost:4200` (Angular)
- `http://localhost:5173` (Vite)

**Produzione (appsettings.Production.json):**
- `https://cigarclub.prod.com`

Per aggiungere nuovi origin, modifica la sezione `Cors` in `appsettings.json`.

---

## 📝 Modello di Dati - Tobacconist

```csharp
public class Tobacconist
{
    public Guid Id { get; set; }
    public string Code { get; set; }
    public string Category { get; set; }
    public string Description { get; set; }
    public decimal PriceKg { get; set; }
    public decimal StackPrice { get; set; }
    public string StackType { get; set; }
    public DateTimeOffset CurrentPricingValidity { get; set; }
    public decimal NextPrice { get; set; }
    public decimal NextStackPrice { get; set; }
    public DateTimeOffset NextPricingValidity { get; set; }
    public ICollection<Barcode> Barcodes { get; set; }
}
```

---

## ⚠️ Codici di Stato HTTP

| Codice | Significato | Azione |
|--------|---|---|
| **200** | OK | Richiesta completata con successo |
| **201** | Created | Risorsa creata con successo |
| **204** | No Content | Operazione completata, nessun contenuto nella risposta |
| **400** | Bad Request | Dati non validi nella richiesta |
| **401** | Unauthorized | Token mancante o non valido |
| **403** | Forbidden | Accesso negato (ruolo insufficiente) |
| **404** | Not Found | Risorsa non trovata |
| **500** | Internal Server Error | Errore del server |

---

## 🔒 Sicurezza

- ✅ JWT validation su tutti gli endpoint protetti
- ✅ Role-based authorization (Admin-only per POST/PUT/DELETE)
- ✅ CORS configurato per domini specifici
- ✅ Exception handling globale
- ✅ Logging di tutte le richieste autenticate

---

## 📞 Supporto

Per domande o problemi, contatta il team di sviluppo.
