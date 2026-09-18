# Firebase Hosting & Google Authentication Setup Guide 🔥

This guide outlines how to connect **Better Every Day** with your own Firebase Project for production hosting, Google Authentication, and automated CI/CD deployments via GitHub Actions.

---

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (e.g., `better-every-day-app`).
3. (Optional) Enable Google Analytics for your project.

---

## 2. Enable Google Authentication

1. In your Firebase Console, navigate to **Build** → **Authentication**.
2. Click **Get Started**, then go to the **Sign-in method** tab.
3. Select **Google** from the providers list:
   - Toggle **Enable**.
   - Set the **Project support email** to your email.
   - Click **Save**.

---

## 3. Register a Web App & Copy API Credentials

1. In Firebase Project Overview, click the **Web icon (</>)** to register a web app.
2. Name your app (e.g. `Better Every Day Web`).
3. Check the box for **"Also set up Firebase Hosting for this app"**.
4. Copy the `firebaseConfig` object values into your local `.env` file (see [`.env.example`](./.env.example)):

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789...
VITE_FIREBASE_APP_ID=1:123456789:web:...
VITE_FIREBASE_MEASUREMENT_ID=G-...
```

---

## 4. Setup GitHub Actions Automated Hosting Deployment

The repository includes a GitHub Action in [`.github/workflows/firebase-hosting-merge.yml`](./.github/workflows/firebase-hosting-merge.yml) that automatically builds and deploys to Firebase Hosting on every commit to `main`.

### To generate your Firebase Service Account Secret:
1. In your local terminal, run:
   ```bash
   npx firebase-tools login
   npx firebase-tools init hosting:github
   ```
2. Follow the prompt to log in and select your GitHub repository (`rohinimoodley-creator/better-every-day`).
3. Firebase CLI will automatically create a Service Account key and add it as a secret named `FIREBASE_SERVICE_ACCOUNT_...` in your GitHub repository secrets.

Alternatively, you can manually generate a Service Account Key in **Firebase Project Settings** → **Service accounts** → **Generate new private key** and paste the JSON content into your GitHub Repository Secret named `FIREBASE_SERVICE_ACCOUNT_BETTER_EVERY_DAY`.

---

## 5. Local Development

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```
