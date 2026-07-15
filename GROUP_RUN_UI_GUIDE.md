# 🎨 Group Run Automation - Web UI Guide

## 🚀 **NEW! Web Interface for Group Run Automation**

I've created a beautiful web UI that lets you control the automation without touching code!

### ✨ Features

- 🌐 Select environment (Dev/Stage)
- 📋 Choose group from dropdown
- 📅 Visual date pickers for pay period
- ✅ Auto-cancel existing runs option
- 🔍 Check-only mode (verify without starting)
- 📊 Live progress logs
- 🎨 Modern, responsive design

---

## 🎯 Quick Start

### Step 1: Start the UI Server

```bash
npm run ui
```

Or:

```bash
npm start
```

### Step 2: Open Your Browser

Navigate to: **http://localhost:3000**

### Step 3: Fill the Form

1. **Environment**: Select `Development` or `Stage`
2. **Group Name**: Choose `KWFHBW - Pay Process` or `SLFCAB - Pay Process`
3. **Start Date**: Pick pay period start (e.g., 02/22/2026)
4. **End Date**: Pick pay period end (e.g., 03/07/2026)
5. **Auto-Cancel**: ✅ Check to automatically cancel existing runs

### Step 4: Run!

- Click **🚀 Start Group Run** to run the automation
- Click **🔍 Check Only** to just verify (no start)

---

## 📸 What It Looks Like

```
╔═══════════════════════════════════════════════╗
║  🚀 Group Run Automation                      ║
║  Ashley PayHub - Automated Group Run Management
╠═══════════════════════════════════════════════╣
║  Environment *                                 ║
║  ┌─────────────────────────────────────────┐ ║
║  │ Development (dev.ashleyfurniture.com) ▼│ ║
║  └─────────────────────────────────────────┘ ║
║                                                ║
║  Group Name *                                  ║
║  ┌─────────────────────────────────────────┐ ║
║  │ KWFHBW - Pay Process                  ▼│ ║
║  └─────────────────────────────────────────┘ ║
║                                                ║
║  Pay Period Start Date *                      ║
║  ┌─────────────────────────────────────────┐ ║
║  │ 📅 02/22/2026                            │ ║
║  └─────────────────────────────────────────┘ ║
║                                                ║
║  Pay Period End Date *                        ║
║  ┌─────────────────────────────────────────┐ ║
║  │ 📅 03/07/2026                            │ ║
║  └─────────────────────────────────────────┘ ║
║                                                ║
║  ☑ Automatically cancel existing runs         ║
║                                                ║
║  ┌──────────────┐ ┌───────────────────────┐ ║
║  │🚀 Start Group│ │🔍 Check Only (No Start│ ║
║  │    Run       │ │                       │ ║
║  └──────────────┘ └───────────────────────┘ ║
╚═══════════════════════════════════════════════╝
```

---

## 🎬 Example Usage

### Scenario 1: Start a New Group Run

1. Select `SLFCAB - Pay Process`
2. Set dates: `02/22/2026` to `03/07/2026`
3. Check ✅ Auto-cancel
4. Click **🚀 Start Group Run**
5. Watch the browser open and automation run!

### Scenario 2: Just Check for Existing Runs

1. Select `KWFHBW - Pay Process`
2. Set your dates
3. Click **🔍 Check Only**
4. See if there are existing runs without starting a new one

---

## 📊 Live Progress Logs

The UI shows real-time logs:

```
[12:34:56] Environment: DEV
[12:34:56] Group: KWFHBW - Pay Process (ID: 5)
[12:34:56] Pay Period: 02/22/2026 - 03/07/2026
[12:34:56] Auto-cancel: Yes
[12:34:56] ---
[12:34:57] ✅ Logged in successfully
[12:34:58] ✅ Navigated to group page
[12:35:00] ⚠️  Found existing run for this period!
[12:35:00] Status detected: NotSubmitted
```

---

## 🔧 Adding More Groups

### Step 1: Edit `ui/script.js`

Find the `groupMapping` and add your group:

```javascript
const groupMapping = {
    'KWFHBW - Pay Process': '5',
    'SLFCAB - Pay Process': '10',
    'YOUR GROUP NAME': 'YOUR_GROUP_ID'  // Add here
};
```

### Step 2: Edit `ui/index.html`

Add option to the dropdown (around line 100):

```html
<option value="YOUR GROUP NAME">YOUR GROUP NAME</option>
```

### Step 3: Restart Server

```bash
# Stop the server (Ctrl+C)
npm run ui
```

---

## 📁 Files Created

```
ui/
├── index.html       # Main UI page
├── script.js        # Client-side JavaScript
└── server.js        # Express server

tests/
└── group-run-ui-driven.spec.ts  # Test script
```

---

## 🎯 **Next Steps**

1. **Try it now:**
   ```bash
   npm run ui
   ```

2. **Open browser:** http://localhost:3000

3. **Run automation** with the visual interface!

---

## ✅ **Benefits of Using the UI**

- ✨ No need to edit code
- 🎨 Visual, user-friendly interface
- 📊 Real-time progress monitoring
- 🔍 Easy to verify before running
- 🌐 Switch environments easily
- 📅 Calendar date pickers

---

**Enjoy the new UI! 🚀**

Need help? The server console shows detailed logs too!
