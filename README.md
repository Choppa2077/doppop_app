# doppop

Mobile app for finding and creating sport-lobby pickup games. Built with Expo,
React Native, expo-router, and TypeScript.

## Quickstart

```bash
cp .env.example .env
npm install --legacy-peer-deps
npx expo start
```

Then press `i` for iOS simulator or `a` for Android emulator. To run on a
physical device, scan the QR code with Expo Go (Android) or the Camera app
(iOS).

> The `--legacy-peer-deps` flag is required because NativeWind v4 ships a
> `react-dom` peer that's slightly newer than the one Expo SDK 54 pins. It's
> safe — `react-dom` isn't used on native.

## Configure the API URL

The backend base URL is read from `EXPO_PUBLIC_API_URL`. Set it in `.env`:

| Where you're running                | URL                                          |
| ----------------------------------- | -------------------------------------------- |
| iOS Simulator                       | `http://localhost:8000/api/v1`               |
| Android Emulator                    | `http://10.0.2.2:8000/api/v1`                |
| Physical device (same Wi-Fi as Mac) | `http://<your-LAN-ip>:8000/api/v1`           |

To find your LAN IP on macOS: `ipconfig getifaddr en0`.

After changing `.env`, restart Metro:

```bash
npx expo start --clear
```

## Requirements

- Node 20+ (tested on Node 24)
- Xcode 15+ for iOS simulator builds
- Android Studio with an emulator image for Android
- Optional: Expo Go on a physical device for the fastest dev loop

## Project layout

```
app/                          expo-router file-based routes
  (auth)/                     login + register
  (onboarding)/               6-step onboarding flow
  (tabs)/                     lobbies, venues, profile
  lobbies/[id].tsx            lobby details (full state machine)
  lobbies/filters.tsx         lobby filters (modal)
  venues/[id].tsx             venue details + time slots
  venues/filters.tsx          venue filters (modal)
  profile/edit.tsx            edit profile form
  _layout.tsx                 providers, fonts, auth gate
src/
  api/                        axios client + endpoint callers
  components/                 reusable UI primitives
  constants/                  parameter mirrors of the backend
  hooks/                      react-query hooks
  stores/                     zustand stores (auth, onboarding, filters, toasts)
  theme/                      colors, typography, spacing tokens
  types/api.ts                response shapes from the API contract
  utils/                      format helpers, validators, lobby state machine
```

## Useful scripts

```bash
npx expo start                start Metro
npx expo start --clear        start Metro with a cleared bundler cache
npx tsc --noEmit              type-check the project
```

## Tech notes

- **Routing**: expo-router (file-based) with typed routes enabled.
- **Styling**: NativeWind v4 (Tailwind for RN) plus typed theme tokens in
  `src/theme/`. Components consume tokens, never inline hex literals.
- **Fonts**: Space Grotesk (display) + DM Sans (body) loaded via
  `@expo-google-fonts/*`. Splash is held until fonts and the auth store have
  hydrated.
- **Auth**: JWT stored in `expo-secure-store`. The axios client refreshes
  access tokens once on 401, then retries the original request. On refresh
  failure, tokens are cleared and the gate routes back to `/(auth)/login`.
- **State**: `@tanstack/react-query` for server state, zustand for client
  state. Query keys are centralized in `src/api/keys.ts`.
- **Toasts**: lightweight in-house toaster in `src/components/Toaster.tsx`.

## Backend contract

The mobile client expects the API documented in the project specification:

- Base URL: `http://localhost:8000/api/v1/`
- Authentication: JWT (`Authorization: Bearer <access_token>`)
- Error shape: `{ detail, code, extra }` on every 4xx/5xx
- Onboarding requires six parameter values (see `src/constants/parameters.ts`)
  to be saved before `/me/onboarding/complete/` will accept the user.

See the project spec for full endpoint details.
