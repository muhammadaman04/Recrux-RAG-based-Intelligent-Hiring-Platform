# JWT Authentication Backend - Setup Guide

## 📦 Files Created

### **Configuration**
- `app/config/settings.py` - Pydantic settings (auto-loads .env)
- `app/config/database.py` - SQLAlchemy engine & session

### **Models** (Python classes = Database tables)
- `app/models/company.py` - Company model
- `app/models/user.py` - User model

### **Utilities**
- `app/utils/jwt.py` - Create & decode JWT tokens
- `app/utils/password.py` - Hash & verify passwords

### **Schemas** (Request/Response validation)
- `app/schemas/auth.py` - Pydantic schemas

### **Routers** (API endpoints)
- `app/routers/auth.py` - `/register` & `/login`

### **Main App**
- `app/main.py` - FastAPI app with CORS

---

## 🚀 Setup Instructions

### Step 1: Generate SECRET_KEY

```bash
# Run this command
openssl rand -hex 32
```

Copy the output and add to `backend/.env`:
```env
SECRET_KEY=your-generated-key-here
```

### Step 2: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Update DATABASE_URL

In `backend/.env`, update:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.vkaipglpugbjcydjeabb.supabase.co:5432/postgres
```

Replace `YOUR_PASSWORD` with your Supabase database password.

### Step 4: Start Server

```bash
uvicorn app.main:app --reload
```

Server runs at: http://localhost:8000

---

## 📝 API Endpoints

### **1. Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "company_name": "TechCorp",
  "email": "hr@techcorp.com",
  "password": "securepassword123",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "hr@techcorp.com",
    "role": "admin",
    "company_name": "TechCorp"
  }
}
```

### **2. Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "hr@techcorp.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "hr@techcorp.com",
    "role": "admin",
    "company_name": "TechCorp"
  }
}
```

---

## 🧪 Testing

### **Option 1: Swagger UI**
1. Go to http://localhost:8000/docs
2. Click on `/api/auth/register`
3. Click "Try it out"
4. Fill in the request body
5. Click "Execute"

### **Option 2: cURL**

**Register:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "TechCorp",
    "email": "hr@techcorp.com",
    "password": "securepassword123",
    "full_name": "John Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr@techcorp.com",
    "password": "securepassword123"
  }'
```

---

## 🔍 Why SQLAlchemy Models?

### **Without Models (Raw SQL):**
```python
# ❌ Hard to maintain, no type safety
cursor.execute(
    "INSERT INTO users (tenant_id, email, password_hash) VALUES (%s, %s, %s)",
    (1, "hr@company.com", "hashed_pw")
)
```

### **With Models:**
```python
# ✅ Clean, type-safe, IDE autocomplete
user = User(
    tenant_id=1,
    email="hr@company.com",
    password_hash="hashed_pw"
)
db.add(user)
db.commit()

# ✅ IDE knows what fields exist!
print(user.email)  # Autocomplete works!
```

**Models = Python classes that map to database tables**

Benefits:
- ✅ Type safety
- ✅ IDE autocomplete
- ✅ Easy relationships (user.company.name)
- ✅ No SQL injection
- ✅ Cleaner code

---

## ✅ What's Working

- ✅ User registration (creates company + user)
- ✅ User login (verifies password)
- ✅ JWT token generation
- ✅ Password hashing (bcrypt)
- ✅ Multi-tenant support (tenant_id)
- ✅ CORS enabled for frontend

---

## 🎯 Next Steps

1. Generate SECRET_KEY
2. Install dependencies
3. Update DATABASE_URL
4. Start server
5. Test with Swagger UI
6. Implement frontend integration

**Your authentication backend is ready!** 🚀
