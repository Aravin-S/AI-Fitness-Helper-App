# AI Fitness Helper

A simple fitness tracking app built with Expo and React Native. Build a weekly workout plan, get a reminder each day telling you what you're training (e.g. "Today is Push Day"), log your sets, and track your progress.

## Features

- **Weekly plan builder** – assign each weekday a type (Push, Pull, Legs, Upper, Lower, Full Body, Cardio, Rest or a custom name) and add exercises with sets and reps. One-tap templates: Push/Pull/Legs, Upper/Lower, Full Body.
- **Today tab** – shows what day it is and today's exercises.
- **Daily reminders** – a local notification at the time you choose, such as "🏋️ Today is Push Day" with the first few exercises, or "😴 Rest day".
- **Workout logging** – record reps and weight for every set, plus notes.
- **History** – every past workout, with a day streak (planned rest days don't break it).
- **Progress** – personal records and a top-set weight chart for each exercise.

All data is stored on your phone (AsyncStorage). There is no account and no server.

## Run it on your phone with Expo Go

### 1. Install the tools (one time)

- **Node.js** (LTS or newer) – download from [nodejs.org](https://nodejs.org), or on macOS run `brew install node`.
- **Expo Go** on your phone – install it from the [App Store](https://apps.apple.com/app/expo-go/id982107779) (iPhone) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android).

### 2. Get the code and install dependencies

```bash
git clone https://github.com/Aravin-S/AI-Fitness-Helper-App.git
cd AI-Fitness-Helper-App
npm install --legacy-peer-deps
```

The `--legacy-peer-deps` flag is needed because UI Kitten's declared peer dependencies lag behind the latest React Native.

### 3. Start the dev server

```bash
npx expo start
```

A QR code appears in the terminal.

### 4. Open the app on your phone

- **iPhone:** open the built-in Camera app and scan the QR code, then tap the banner to open it in Expo Go.
- **Android:** open Expo Go, tap **Scan QR code**, and scan it.

Your phone and computer must be on the **same Wi-Fi network**. The first load takes a little while as the app bundles. After that, saving a file reloads the app automatically.

### 5. Try the reminders

1. Open the **Plan** tab and pick a template (or build your own).
2. Open **Settings**, turn on **Daily workout reminder**, and allow notifications when prompted.
3. Tap **Send test notification**. It arrives in about 3 seconds. Lock your phone or switch apps to see it.

Test notifications on a real device rather than a simulator, which often doesn't deliver them reliably.

## Troubleshooting

| Problem | Fix |
|---|---|
| The phone can't connect or the QR code times out | Make sure both devices are on the same Wi-Fi. Guest or corporate networks often block device-to-device traffic. Try `npx expo start --tunnel`. |
| "Project is incompatible with this version of Expo Go" | Update Expo Go to the latest version from your app store. This project uses Expo SDK 58. |
| No reminder arrives | Check that the toggle in Settings is on and that notifications are allowed for Expo Go in your phone's settings. Reminders do not work in the browser. |
| `npm install` fails with peer dependency errors | Use `npm install --legacy-peer-deps`. |

## Other ways to run

```bash
npx expo start --ios       # iOS simulator (macOS with Xcode)
npx expo start --android   # Android emulator
npx expo start --web       # browser (reminders unavailable)
```

## Project structure

```
App.js                      app entry: theme + navigation
navigation/RootNavigator.js tabs (Today, Plan, History, Progress, Settings) + stack screens
screens/                    one file per screen
storage/storage.js          AsyncStorage helpers for the plan, settings and workout logs
utils/                      days, workout templates, notifications, stats (streak, PRs)
```

## Tech stack

Expo SDK 58, React Native, React Navigation 7, UI Kitten (Eva dark theme), expo-notifications, AsyncStorage.
