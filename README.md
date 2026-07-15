# 🚀 Ashley PayHub - Group Run Automation System

Intelligent automation for PayHub payroll calculation group runs

---

## 📋 Quick Links

- 🚀 **[Quick Start Guide](QUICK_START_GUIDE.md)** - Get running in 5 minutes
- 📖 **[Full Documentation](GROUP_RUN_AUTOMATION_DOCUMENTATION.md)** - Complete user manual
- 🔧 **[Technical Reference](TECHNICAL_REFERENCE.md)** - For developers

---

## ✨ What Does This Do?

Automates the entire process of starting and managing payroll calculation group runs in Ashley PayHub:

- ✅ **Detects** existing runs automatically
- ✅ **Cancels** conflicting runs (when possible)
- ✅ **Starts** fresh runs with correct dates
- ✅ **Creates** correction runs on existing submissions
- ✅ **Handles** all edge cases intelligently

**Saves 15-30 minutes** of manual work per run!

---

## 🎯 Key Features

### 🎛️ Multiple Modes
- **Check Only**: See if runs exist (read-only)
- **Start Run**: Create fresh group runs
- **Auto-Cancel**: Cancel and re-run automatically
- **Correction Run**: Fix existing submissions

### 🧠 Smart Automation
- Automatically detects conflicts
- Handles different run statuses
- Falls back to alternatives when needed
- Provides clear guidance

### 🖥️ User-Friendly Interface
- Beautiful Web UI
- Live action preview
- Real-time logs
- One-click operation

### 🛡️ Robust & Safe
- Comprehensive error handling
- Screenshots on failures
- Detailed logging
- Graceful recovery

---

## 🚀 Quick Start

### 1. Install
```powershell
npm install
```

### 2. Configure
Create `.env` file:
```env
ASHLEY_USERNAME=your.email@ashleyfurniture.com
ASHLEY_PASSWORD=YourPassword123
```

### 3. Run
```powershell
npm run ui
```

### 4. Open Browser
```
http://localhost:3000
```

### 5. Automate!
1. Select environment and group
2. Enter dates
3. Choose options
4. Click button
5. Done! ✅

---

## 📊 What Can It Do?

### Scenario 1: Check for Runs
**Goal**: See if runs exist without changes

**Steps**:
1. Select group and dates
2. Click "Check Only"
3. View results

**Result**: 
```
✅ No existing run found
```

### Scenario 2: Start Fresh Run
**Goal**: Create new group run

**Steps**:
1. Select group and dates (no conflicts)
2. Click "Start Group Run"
3. Run created!

**Result**:
```
✅ Group run started successfully
```

### Scenario 3: Cancel & Re-Run
**Goal**: Cancel existing and start fresh

**Steps**:
1. Select group and dates (with existing run)
2. Check "Auto-cancel"
3. Click "Start Group Run"

**Result**:
```
⚠️ Existing run found
✅ Cancelled successfully
✅ New run started
```

### Scenario 4: Correction Run
**Goal**: Correct existing submission

**Steps**:
1. Select group and dates (completed submission)
2. Check "Correction run"
3. Click "Start Group Run"
4. Select original run
5. Submit!

**Result**:
```
✅ Correction run submitted successfully
```

---

## 🎨 Screenshots

### Web Interface
```
┌────────────────────────────────────────────┐
│  🚀 Group Run Automation                   │
├────────────────────────────────────────────┤
│  Environment:     [Stage ▼]                │
│  Group:           [KWFHBW - Pay Process ▼] │
│  Start Date:      [03/22/2026]             │
│                                             │
│  ☑ Auto-cancel existing runs               │
│  ☐ Run as correction                       │
│                                             │
│  ⚠️ What will happen:                      │
│  • If existing run found → Cancel it       │
│  • If cancellation succeeds → Start fresh  │
│                                             │
│  [🔍 Check Only]  [🚀 Start Group Run]    │
├────────────────────────────────────────────┤
│  📋 Logs:                                  │
│  [10:23:45] Logging in...                  │
│  [10:23:50] ✅ Logged in                   │
│  [10:23:55] Navigating to group...         │
│  [10:24:00] ✅ Group run started           │
└────────────────────────────────────────────┘
```

---

## 📖 Documentation

### For Users
- **[Quick Start Guide](QUICK_START_GUIDE.md)** - 5-minute setup
- **[Full Documentation](GROUP_RUN_AUTOMATION_DOCUMENTATION.md)** - Complete guide

### For Developers
- **[Technical Reference](TECHNICAL_REFERENCE.md)** - Architecture & API

---

## 🎓 How It Works

```
User fills form in Web UI
        ↓
Server receives configuration
        ↓
Playwright test starts
        ↓
Logs into PayHub (Microsoft SSO)
        ↓
Navigates to group page
        ↓
Detects existing runs
        ↓
Executes selected mode
        ↓
Returns results to UI
```

---

## 🔧 Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Automation**: Playwright (Chromium)
- **Authentication**: Microsoft OAuth2 SSO

---

## 📦 Project Structure

```
playwright-new/
├── ui/
│   ├── index.html         # Web interface
│   ├── script.js          # Frontend logic
│   └── server.js          # Backend server
├── tests/
│   └── group-run-ui-driven.spec.ts  # Main automation
├── screenshots/           # Error screenshots
├── .env                  # Credentials (create this)
├── package.json          # Dependencies
├── README.md             # This file
├── QUICK_START_GUIDE.md  # 5-min guide
├── GROUP_RUN_AUTOMATION_DOCUMENTATION.md
└── TECHNICAL_REFERENCE.md
```

---

## ⚙️ Requirements

- **Node.js** v14 or higher
- **Playwright** installed
- **Valid PayHub credentials**
- **Network access** to PayHub environments

---

## 🐛 Troubleshooting

### Common Issues

**"Failed to connect to server"**
```powershell
# Restart server
npm run ui
```

**Login fails**
- Check `.env` credentials
- Verify network access

**Button disabled**
- Enable "Correction run" checkbox
- Select original run from dropdown

See [Full Documentation](GROUP_RUN_AUTOMATION_DOCUMENTATION.md#troubleshooting) for more.

---

## 🤝 Contributing

Improvements welcome! Consider:
- Adding new groups
- Enhancing error messages
- Adding batch operations
- Improving performance

---

## 📝 Version History

**v1.0** (Current)
- ✅ Web UI interface
- ✅ Check Only mode
- ✅ Start Run mode
- ✅ Auto-cancel feature
- ✅ Correction run support
- ✅ Live action preview
- ✅ Real-time logging

---

## 📞 Support

Need help?
1. Check the [Quick Start Guide](QUICK_START_GUIDE.md)
2. Read [Full Documentation](GROUP_RUN_AUTOMATION_DOCUMENTATION.md)
3. Review [Technical Reference](TECHNICAL_REFERENCE.md)
4. Contact the development team

---

## 📄 License

Internal tool for Ashley Furniture

---

## 🙏 Credits

**Developed by**: Ashley Furniture IT Team  
**Platform**: Ashley PayHub  
**Technology**: Playwright + Node.js

---

**Ready to automate? Start here: [Quick Start Guide](QUICK_START_GUIDE.md)** 🚀
