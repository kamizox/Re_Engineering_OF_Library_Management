# 🌥️ Cloudinary Setup (FREE - Replace Firebase Storage)

## Step 1: Create FREE Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up (no credit card needed)
3. After login, go to **Dashboard**
4. Copy your **Cloud Name** (e.g., `dxyz12345`)

## Step 2: Create Upload Preset
1. Go to **Settings** → **Upload** tab
2. Scroll to **Upload presets** section
3. Click **Add upload preset**
4. Set:
   - **Preset name**: `library_upload`
   - **Signing Mode**: `Unsigned` ← IMPORTANT!
   - **Folder**: `library` (optional)
5. Click **Save**

## Step 3: Update Your Code
Open `src/hooks/useBooks.js` and replace:
```js
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME'; // ← Replace with your cloud name
const CLOUDINARY_UPLOAD_PRESET = 'library_upload'; // ← Keep this same
```

## Step 4: Run App
```bash
npm install
npm run dev
```

## ✅ That's it! Now images and PDFs will upload for FREE via Cloudinary.

## Free Plan Limits:
- **25 GB** storage
- **25 GB** bandwidth/month
- No credit card needed
