# Implementation Plan - Android APK Development and Testing

The goal is to provide a functional Android APK for the "Smart WhatsApp Food Pre-booking System" and establish a workflow for testing it.

## User Review Required

> [!IMPORTANT]
> Since no Android devices or emulators are currently connected to this session, I have built the APK locally, but I cannot perform automated UI testing or deployment for you. You will need to manually install the APK on your device or start an emulator for further testing.

> [!WARNING]
> The application's React frontend currently uses relative API paths (e.g., `/api/stalls`). This works in a web browser but will fail on an Android device because the backend server is not running inside the APK. I will update the code to support a configurable Backend URL.

## Proposed Changes

### [Component] Android Build & Configuration

#### [MODIFY] [App.tsx](file:///C:/Users/vigne/Desktop/smart-whatsapp-food-pre-booking-system/src/App.tsx)
- Add a `getApiUrl` helper function to handle both web (relative) and mobile (absolute) environments.
- Update all `fetch` calls to use the absolute URL when running on a mobile device.

#### [MODIFY] [capacitor.config.json](file:///C:/Users/vigne/Desktop/smart-whatsapp-food-pre-booking-system/capacitor.config.json)
- Ensure `androidScheme` is set to `https` or `http` for better compatibility if needed (standard Capacitor 6+ defaults are usually fine).

### [Component] Testing Workflow

#### [NEW] [test_instructions.md](file:///C:/Users/vigne/Desktop/smart-whatsapp-food-pre-booking-system/.artifacts/abd50468-1697-4513-94d1-1bf64cc72378/test_instructions.md)
- Provide step-by-step instructions for the user to:
    1. Start the Node.js backend.
    2. Install the APK on their device.
    3. Configure the app to point to their computer's IP address.

## Verification Plan

### Automated Tests
- I have already verified that the APK builds successfully using Gradle: `android/app/build/outputs/apk/debug/app-debug.apk`.
- I will verify that `npm run build` and `npx cap sync` work without errors.

### Manual Verification
- User to verify the APK on a physical device or emulator following the provided instructions.
