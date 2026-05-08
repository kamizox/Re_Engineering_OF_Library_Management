# 🔐 Admin Setup Guide

## Step 1: Set Your Admin Email

Open `src/context/AuthContext.jsx` line 14:

```js
const ADMIN_EMAIL = 'admin@libravault.com'; // 👈 Change this to YOUR email
```

**Example:**
```js
const ADMIN_EMAIL = 'kamran@gmail.com'; // Your real email
```

Also update `src/pages/AuthPage.jsx` — search for `admin@libravault.com` and replace with your email (2 places).

## Step 2: Create Admin Account in Firebase

**Option A — Email/Password:**
1. Go to Firebase Console → Authentication → Users
2. Click "Add User"
3. Email: your admin email (same as above)
4. Password: strong password (only you know)

**Option B — Just login with that email in the app**
1. Go to `/auth` page
2. Login with your admin email & password
3. You will auto-redirect to `/admin` dashboard

## ✅ Security Rules
- Students can signup/login normally — they CANNOT access Admin Dashboard
- Only the exact `ADMIN_EMAIL` gets admin access
- Google Login with any other email = regular user only
- Admin using Google Login also works IF their Google account email matches ADMIN_EMAIL

## ⚠️ Important
Do NOT share your admin email publicly.
