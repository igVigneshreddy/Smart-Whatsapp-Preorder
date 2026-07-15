# Testing Instructions for Android APK

I have built the Android APK for the Smart Canteen system. Since I cannot directly run it on your device from here, please follow these steps to test it:

### 1. Locate the APK
The generated APK is located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

### 2. Start the Backend Server
The Android app needs to talk to the Node.js backend. Run the following command in your terminal on your computer:
```bash
npm run dev
```
Make sure your computer and Android device are on the **same Wi-Fi network**.

### 3. Identify your Computer's IP Address
Find your local IP (e.g., `192.168.1.X` or `10.0.0.X`).
- On Windows: Run `ipconfig` in CMD.
- On macOS/Linux: Run `ifconfig` or `hostname -I`.

### 4. Install and Run the App
- Transfer the `app-debug.apk` to your phone.
- Install it (you might need to allow "Unknown Sources").
- Open the app.

### 5. Point to the Backend
If the app doesn't load data, I have updated the `App.tsx` (see implementation plan) to look for the backend at your computer's IP. 

> [!TIP]
> If you are using an **Android Emulator** on the same machine, you can use `http://10.0.2.2:3000` as the backend URL.
