# Better Every Day — Android Studio Setup & Run Guide 📱🤖

This guide explains how to open, build, run, and export the **Better Every Day** Android app in **Android Studio**.

---

## 🛠️ Prerequisites Verified on Your Machine

- **Android Studio**: Installed at `C:\Program Files\Android\Android Studio`
- **Android SDK**: Located at `C:\Users\devan\AppData\Local\Android\Sdk`
- **Android Studio JDK**: Located at `C:\Program Files\Android\Android Studio\jbr`

---

## 🚀 1. How to Open in Android Studio

You can open the project in Android Studio in either of two ways:

### Option A: From Terminal
Run the convenient script from the project folder:
```bash
npm run cap:open
```

### Option B: From Android Studio GUI
1. Open **Android Studio**.
2. Click **Open** (or **File** → **Open...**).
3. Browse to your project directory and select the **`android`** folder:
   ```
   C:\Users\devan\.gemini\antigravity-ide\scratch\better-every-day\android
   ```
4. Click **OK** to open. Android Studio will automatically sync the Gradle files.

---

## 📱 2. Running the App

### On an Android Emulator:
1. In Android Studio, open the **Device Manager** (top right toolbar or **Tools** → **Device Manager**).
2. Click **Create Virtual Device** (if you don't have one created yet), select a device (e.g., Pixel 8), and choose a system image (e.g. Android 14 / UpsideDownCake).
3. Select your emulator in the top toolbar run dropdown.
4. Click the green **Run (▶)** button (or press `Shift + F10`).

### On a Physical Android Device:
1. On your Android phone, enable **Developer Options** (Settings → About Phone → tap *Build Number* 7 times).
2. In **Developer Options**, turn on **USB Debugging**.
3. Connect your phone via USB cable (or pair via **Wireless Debugging** over Wi-Fi).
4. Select your phone in the Android Studio device dropdown and click **Run (▶)**.

---

## 🔄 3. Making Code Changes & Syncing with Android

Whenever you modify any code in `src/`, sync your latest changes to the Android app with:

```bash
npm run cap:sync
```

*(This automatically builds the production web assets and copies them into the native Android assets directory).*

---

## 📦 4. Building an APK for Installation

To generate an `.apk` file you can install directly on any Android device:
1. In Android Studio, go to the top menu: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
2. Once Gradle finishes building, a popup notification will appear at the bottom right. Click **locate**.
3. The APK will be generated at:
   ```
   android\app\build\outputs\apk\debug\app-debug.apk
   ```
4. You can transfer this APK to your phone or share it to install the app.

---

## 🔒 5. Android Features Included

- **Native Status Bar**: Synchronized with light/dark theme colors.
- **Smooth Splash Screen**: Calming botanical emerald theme splash screen.
- **Tactile Haptics**: Light haptic vibrations on checking off steps and completing routines.
- **Hardware Back Button**: Intelligently closes open drawers, modals, or returns to the home screen.
- **Android Cutout & Safe Areas**: Layout seamlessly handles notches and gesture bars.
