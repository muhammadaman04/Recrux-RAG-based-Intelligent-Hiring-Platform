# Frontend JWT Authentication - Setup Complete! 🎉

## ✅ Files Created/Updated

### **New Files:**
1. `src/api/axios.js` - Axios instance with JWT interceptors
2. `src/context/AuthContext.jsx` - Global auth state management
3. `src/components/ProtectedRoute.jsx` - Route guard component
4. `src/pages/Dashboard.jsx` - User dashboard page

### **Updated Files:**
1. `src/pages/Login.jsx` - Added authentication logic
2. `src/pages/SignUp.jsx` - Added registration logic
3. `src/App.jsx` - Added AuthProvider and protected routes

---

## 🚀 How to Run

### Step 1: Install Dependencies

```bash
cd frontend
npm install axios
```

### Step 2: Start Frontend

```bash
npm run dev
```

Frontend runs at: http://localhost:5173

### Step 3: Make Sure Backend is Running

```bash
cd backend
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000

---

## 🎯 Testing the Flow

### **1. Register New Account**
1. Go to http://localhost:5173/signup
2. Fill in:
   - Company Name: "TechCorp"
   - Email: "hr@techcorp.com"
   - Password: "password123"
3. Click "Create Account"
4. Should redirect to `/dashboard`

### **2. Logout**
1. Click "Logout" button in dashboard
2. Should redirect to `/login`

### **3. Login**
1. Go to http://localhost:5173/login
2. Enter same credentials
3. Click "Sign In"
4. Should redirect to `/dashboard`

### **4. Protected Route Test**
1. Logout
2. Try to access http://localhost:5173/dashboard directly
3. Should redirect to `/login`

---

## 🔧 What's Working

✅ **User Registration**
- Creates company + user in database
- Returns JWT token
- Stores token in localStorage
- Redirects to dashboard

✅ **User Login**
- Verifies credentials
- Returns JWT token
- Stores token in localStorage
- Redirects to dashboard

✅ **Protected Routes**
- Checks for token
- Redirects to login if not authenticated
- Shows loading spinner during check

✅ **Auto-Logout**
- If token expires (401 error)
- Clears localStorage
- Redirects to login

✅ **Dashboard**
- Shows user info
- Logout button
- Stats cards (static for now)

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js              # API client with interceptors
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx    # Route guard
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx             # ✅ Updated
│   │   ├── SignUp.jsx            # ✅ Updated
│   │   └── Dashboard.jsx         # ✅ New
│   ├── App.jsx                   # ✅ Updated
│   └── index.css
```

---

## 🔑 How Authentication Works

### **1. User Signs Up:**
```
SignUp Form → AuthContext.register() → POST /api/auth/register
→ Backend creates company + user → Returns JWT token
→ Store in localStorage → Redirect to /dashboard
```

### **2. User Logs In:**
```
Login Form → AuthContext.login() → POST /api/auth/login
→ Backend verifies password → Returns JWT token
→ Store in localStorage → Redirect to /dashboard
```

### **3. Protected Route Access:**
```
User visits /dashboard → ProtectedRoute checks localStorage
→ If token exists → Show Dashboard
→ If no token → Redirect to /login
```

### **4. API Calls:**
```
API call → Axios interceptor adds: Authorization: Bearer {token}
→ Backend verifies token → Returns data
→ If 401 error → Clear localStorage → Redirect to /login
```

---

## 🎨 UI Features

✅ **Error Handling**
- Shows error messages in red alert boxes
- Clear error messages from backend

✅ **Loading States**
- Button shows "Signing in..." or "Creating Account..."
- Button disabled during submission

✅ **Form Validation**
- Required fields
- Email validation
- Password minimum 8 characters

✅ **Responsive Design**
- Works on mobile, tablet, desktop
- Tailwind CSS styling

---

## 🔒 Security Features

✅ **Password Hashing**
- Passwords hashed with bcrypt on backend
- Never stored in plain text

✅ **JWT Tokens**
- Expire after 24 hours
- Signed with SECRET_KEY
- Verified on every request

✅ **Protected Routes**
- Can't access dashboard without login
- Auto-redirect to login

✅ **Auto-Logout**
- If token expires
- If token is invalid

---

## 🐛 Troubleshooting

### **Error: "Network Error"**
- Make sure backend is running on port 8000
- Check CORS settings in backend

### **Error: "Invalid credentials"**
- Check email/password are correct
- Make sure user exists in database

### **Dashboard not showing user info**
- Check browser console for errors
- Verify token is in localStorage
- Check backend is returning user data

---

## ✅ Next Steps

1. ✅ Authentication working
2. ⏭️ Create job posting page
3. ⏭️ Upload resume page
4. ⏭️ Candidate ranking page
5. ⏭️ AI chat integration

**Your authentication is complete and working!** 🚀
