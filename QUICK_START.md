# 🚀 Quick Start Guide

## Installation & Setup

```bash
# Navigate to project directory
cd c:\Users\saile\Desktop\habit-tracker

# Install dependencies (if needed - they should be pre-installed)
npm install

# Start the development server
npm start
```

## First Run

1. **Select Platform**:

   - Press `i` for iOS Simulator (Mac only)
   - Press `a` for Android Emulator
   - Press `w` for Web Browser (simplest for testing)

2. **Wait for Build** (~30-60 seconds on first launch)

3. **App Opens** with the Grid tab showing "No habits yet!"

## Using the App

### Step 1: Create Your First Habit

- Tap the **"Habits"** tab at the bottom
- Type a habit name (e.g., "Morning Run")
- Tap **"Add"**
- Repeat for more habits (e.g., "Read", "Sleep", "Exercise")

### Step 2: Track Your Habits

- Go to **"Grid"** tab
- You'll see a calendar for the current month
- Tap any cell to toggle its status:
  - **Empty** (white) → **Done** (green ✅) → **Missed** (red ❌) → **Empty**
- Changes save automatically

### Step 3: View Your Progress

- Go to **"Stats"** tab
- See your **completion percentage** for the month
- View per-habit breakdown

## Understanding the Layout

### Grid Tab

```
         January 2026
     ┌─ Run Read Sleep ──┐
   1 │ ✅  ❌          → (scrollable)
   2 │     ✅  ✅
   3 │ ✅  ✅  ✅
   ...
```

- **Left column**: Day numbers (fixed)
- **Other columns**: Habit status (scroll right for more)

### Habits Tab

- **Input field**: Name of new habit
- **Add button**: Create the habit
- **List**: All habits with delete buttons

### Stats Tab

- **Big percentage**: Overall completion for the month
- **4 boxes**: Total cells, ✅ Done, ❌ Missed, Empty
- **Per-Habit list**: Individual completion rates

## Tips & Tricks

### Data Persistence

- All data saves **automatically** to your phone
- Even if you close the app, your data is safe
- Data stored locally - no cloud sync

### Understanding Cell States

| State  | Icon   | Color | Meaning                |
| ------ | ------ | ----- | ---------------------- |
| Empty  | (none) | White | Not tracked yet        |
| Done   | ✅     | Green | Successfully completed |
| Missed | ❌     | Red   | Failed to complete     |

### Viewing More Habits

- If you have many habits, scroll right on the grid
- The day number column stays fixed
- Your habits scroll horizontally

## Troubleshooting

### "Loading..." spinner stuck?

- Cold restart the app (close completely and reopen)
- Check that your phone has enough storage (>50MB free)

### Changes not saving?

- Changes auto-save after tapping a cell
- If issues persist, try restarting the app

### Text too small/large?

- Adjust device text size in system settings
- The app respects your device preferences

## Clearing All Data

To start fresh (clear all habits and history):

1. On **Habits tab**: Delete habits individually
2. This removes all associated tracking data

Or to completely reset storage, run in terminal:

```javascript
// In Expo dev console (press 'j' while running):
import AsyncStorage from "@react-native-async-storage/async-storage";
await AsyncStorage.multiRemove(["habits:v1", "entries:v1"]);
```

## Common Questions

**Q: Can I track past months?**
A: Currently shows the current month. Future versions may add month navigation.

**Q: How many habits can I track?**
A: Unlimited! The grid scrolls horizontally as needed.

**Q: Does this sync across devices?**
A: No, data is local only. Each device has its own storage.

**Q: Can I export my data?**
A: Currently no export feature. Data stored in AsyncStorage (local only).

**Q: Does it work offline?**
A: Yes! Everything works without internet. No cloud sync.

## File Structure (For Reference)

```
habit-tracker/
├── app/(tabs)/              # App screens
│   ├── index.tsx           # Grid screen
│   ├── habits.tsx          # Manage habits
│   ├── stats.tsx           # Statistics
│   └── _layout.tsx         # Tab navigation
│
├── src/                     # Business logic
│   ├── components/         # Reusable components
│   ├── store/             # Zustand state
│   ├── storage/           # AsyncStorage helpers
│   └── utils/             # Date utilities
│
└── package.json           # Dependencies
```

## Need Help?

- Check **BUILD_SUMMARY.md** for technical details
- Check **IMPLEMENTATION.md** for architecture info
- Review **README.md** for project overview

---

**Ready to track your habits!** 🎯
