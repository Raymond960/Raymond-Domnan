# ARIMO STORE HUB — Production Web Application

Official digital store & design platform for **ARIMO STORE HUB** featuring instant checkout via Paystack, Stripe, and Flutterwave in Nigerian Naira (₦) and US Dollars ($).

---

## 🔥 Step-by-Step Deployment to Firebase Hosting

### Step 1: Install Firebase CLI
If you haven't installed Firebase CLI yet, run:
```bash
npm install -g firebase-tools
```

### Step 2: Log In to Firebase
```bash
firebase login
```

### Step 3: Initialize / Build the Application
```bash
# Install dependencies
npm install

# Build the production assets into dist/
npm run build
```

### Step 4: Deploy to Firebase Hosting
Deploy your static single-page app and assets directly to Firebase Hosting:
```bash
firebase deploy --only hosting
```
*(The configured `firebase.json` automatically handles single-page app routing to `/index.html`, security headers, and asset caching).*

---

## 🚀 Step-by-Step 100% FREE Deployment to Vercel

### Step 1: Export Your Project Code
1. Click the **Options / Settings menu** (the **⋯** button in the top header) and choose **"Download as ZIP"** (or export to **GitHub**).
2. If downloaded as ZIP, extract the ZIP file to a folder on your computer.

---

### Step 2: Deploy to Vercel (Takes 60 Seconds)
1. Go to [https://vercel.com](https://vercel.com) and create a **Free Hobby Account** (log in with GitHub or Email).
2. Click **"Add New..."** → **"Project"**.
3. **If using GitHub**: Select your repository and click **Import**.
   **If uploading locally**: Install Vercel CLI by running `npm install -g vercel` and then run `vercel` inside your project folder.
4. Verify Build Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**. Your application will be live immediately on a free `.vercel.app` domain.

---

## 🌐 Step 3: Connect Custom Domain (`arimostorehub.com`)

1. In your **Vercel Project Dashboard**, navigate to **Settings** → **Domains**.
2. Type **`arimostorehub.com`** and click **Add**.
3. Also add **`www.arimostorehub.com`** (Select "Redirect to arimostorehub.com").
4. Open the DNS Management portal at your domain registrar (GoDaddy, Namecheap, Cloudflare, Whogohost, etc.) and add these 2 records:

| Record Type | Host / Name | Value / Destination | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Automatic / 300s |
| **CNAME** | `www` | `cname.vercel-dns.com` | Automatic / 300s |

---

## 🔒 Step 4: Automatic Free SSL & Padlock (`https://`)
- As soon as your DNS records propagate (typically 2 to 15 minutes), **Vercel automatically provisions and installs a free, auto-renewing Let's Encrypt SSL Certificate**.
- The security padlock 🔒 and `https://arimostorehub.com` will activate automatically with no manual server configuration required.
- All HTTP requests will automatically redirect to HTTPS.

---

## 🛠️ Local Development & Testing

```bash
# 1. Install all dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Test production build
npm run build
```
