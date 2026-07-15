# 🚀 Ashley PayHub - Group Run Automation System

## Documentation v1.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [User Guide](#user-guide)
5. [Automation Modes](#automation-modes)
6. [Scenario Coverage](#scenario-coverage)
7. [Technical Architecture](#technical-architecture)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## 🎯 Overview

The **Group Run Automation System** is an enterprise-grade automation tool built for Ashley Furniture's PayHub platform. It automates the process of starting, managing, and monitoring payroll calculation group runs, eliminating manual work and reducing human errors.

### Key Benefits

- ⏱️ **Time Savings**: Reduces 15-30 minutes of manual work to 2-3 minutes
- ✅ **Error Prevention**: Eliminates mistakes from manual date entry and navigation
- 🔄 **Intelligent Handling**: Automatically handles conflicts and edge cases
- 👁️ **Full Transparency**: Shows exactly what will happen before execution
- 📊 **Comprehensive Logging**: Detailed logs of all actions taken

### Supported Environments

- **Development**: `people.dev.ashleyfurniture.com/payhub`
- **Stage**: `people.stage.ashleyfurniture.com/payhub`

---

## ✨ Features

### 1. **Multiple Automation Modes**

- **Check Only**: Read-only mode to detect existing runs
- **Start Run**: Start a fresh group run
- **Auto-Cancel**: Automatically cancel existing runs and start fresh
- **Correction Run**: Start a correction run on existing submissions

### 2. **Smart Decision Making**

- Automatically detects existing runs on the group page
- Handles different run statuses intelligently
- Falls back to correction run when cancellation isn't possible
- Provides clear guidance when manual intervention is needed

### 3. **User-Friendly Web Interface**

- Beautiful, intuitive UI with live preview
- Real-time logs showing automation progress
- Clear status messages and error handling
- Action preview that shows what will happen before you click

### 4. **Robust Error Handling**

- Detects when runs cannot be cancelled
- Provides helpful suggestions for resolution
- Takes screenshots on errors for debugging
- Graceful recovery from edge cases

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v14 or higher)
2. **Playwright** installed
3. **Valid PayHub credentials** (Ashley Furniture account)
4. **Network access** to PayHub environments

### Installation

1. **Clone or download the repository** to your local machine

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Configure credentials**:
   Create a `.env` file in the root directory:
   ```env
   ASHLEY_USERNAME=your.email@ashleyfurniture.com
   ASHLEY_PASSWORD=YourPassword123
   ```

4. **Start the Web UI**:
   ```powershell
   npm run ui
   ```

5. **Open your browser** to `http://localhost:3000`

---

## 📖 User Guide

### Basic Workflow

1. **Select Environment**: Choose Dev or Stage
2. **Select Group**: Pick from the dropdown (e.g., KWFHBW - Pay Process)
3. **Enter Dates**: Start date (end date auto-populates to 2 weeks later)
4. **Choose Options**:
   - ☑️ Auto-cancel existing runs (optional)
   - ☑️ Run as correction (optional)
5. **Review Action Preview**: See what will happen
6. **Click Button**:
   - 🔍 **Check Only** - Just reports status
   - 🚀 **Start Group Run** - Executes the automation

### Understanding the Action Preview

The yellow preview box shows **exactly what will happen** based on your selections:

**Example 1**: Auto-cancel checked only
```
⚠️ What will happen:
• If existing run found → Will attempt to cancel it
• If cancellation succeeds → Will start fresh run
• If cancellation fails → Will show error
```

**Example 2**: Correction run checked only
```
⚠️ What will happen:
• If submission exists → Will start as correction run
• You will select which run to correct from a dropdown
```

**Example 3**: Both checked
```
⚠️ What will happen:
• If existing run is cancellable → Will cancel and start fresh run
• If existing run is NOT cancellable → Will try correction run instead
```

---

## 🎛️ Automation Modes

### 1. Check Only Mode 🔍

**Purpose**: Read-only check to see if runs exist

**When to use**:
- Before planning a new run
- To verify run status without making changes
- For reporting purposes

**What it does**:
1. Logs into PayHub
2. Navigates to the group page
3. Searches for runs matching the dates
4. Reports findings (status, dates)
5. **Does NOT** start, cancel, or modify anything

**Example Output**:
```
⚠️ EXISTING RUN FOUND
Start date found: 02/22/2026
End date found: 03/07/2026
Status: AwaitingApproval

✅ CHECK COMPLETE - Existing run detected, no action taken
```

### 2. Normal Start Run 🚀

**Purpose**: Start a fresh group run when no conflicts exist

**When to use**:
- Starting a run for new pay period dates
- When you've confirmed no existing runs exist

**What it does**:
1. Logs into PayHub
2. Checks for existing runs (warns if found)
3. Clicks "Start Group Run"
4. Selects start date (end date auto-populates)
5. Submits the run

**Example Output**:
```
✅ No existing run for this period
Starting new group run...
  Setting start date: 03/22/2026
  Auto-populated end date: 04/05/2026
✅ Group run started successfully
```

### 3. Auto-Cancel + Re-Run ♻️

**Purpose**: Cancel existing run and start fresh

**When to use**:
- Need to re-run with different settings
- Previous run has errors
- Run is stuck in AwaitingApproval status

**What it does**:
1. Detects existing run on group page
2. Scrolls to find "Force Cancel This Run" button
3. Clicks cancel and confirms
4. Waits for cancellation to complete
5. Refreshes page to verify
6. Starts new run

**Important Notes**:
- ⚠️ Only works for runs in **AwaitingApproval**, **NotSubmitted**, or **Queued** status
- ❌ Cannot cancel runs in **AwaitingPostAction**, **Completed**, or **Cancelled** status
- ✅ If cancellation fails, will fall back to correction run (if enabled)

**Example Output**:
```
⚠️ EXISTING RUN FOUND
Status: AwaitingApproval

Auto-cancel is enabled, attempting to cancel existing run...
  Found 1 "Force Cancel" button(s)
  Clicked "Force Cancel This Run"
  Confirmed cancellation
  Waiting for cancellation to complete...
✅ Existing run cancelled successfully

Starting new group run...
✅ Group run started successfully
```

### 4. Correction Run 🔄

**Purpose**: Start a correction run on an existing submission

**When to use**:
- Existing submission is in **AwaitingPostAction** status
- Need to correct data from a previous run
- PayHub shows "A submission already exists for this period"

**✅ RECOMMENDED Configuration** (most reliable):
- ✅ **Check** "Automatically cancel existing runs"
- ✅ **Check** "Run as correction (if submission already exists)"

**Why both checkboxes?**
- If run is cancellable → Cancels and starts fresh
- If run is NOT cancellable (e.g., `AwaitingPostAction`) → Falls back to correction run
- Handles ALL scenarios without errors!

**What it does**:
1. Opens "Start Group Run" dialog
2. Detects "submission already exists" or "Cannot Start Group Run" error
3. Clicks "CONTINUE AS CORRECTION RUN" button
4. Selects the original run from dropdown
5. Submits as correction run

**Example Output**:
```
⚠️ Submission already exists for this pay period
Correction run mode enabled - looking for "CONTINUE AS CORRECTION RUN" button...
  Found "CONTINUE AS CORRECTION RUN" button
  Clicked "CONTINUE AS CORRECTION RUN"
  Looking for "Original Run to Correct" dropdown...
  Found "Original Run to Correct" dropdown
  Selecting first option: "2026-PP08 — Completed"
  ✓ Selected original run to correct
  Found enabled "START GROUP RUN" button
✅ Correction run submitted successfully
```

---

## 📊 Scenario Coverage

### Complete Decision Matrix

| Existing Run Status | Auto-Cancel ☑️ | Correction Run ☑️ | Result |
|---------------------|----------------|-------------------|--------|
| **None** | Any | Any | ✅ Starts fresh run |
| **AwaitingApproval** | ✅ Yes | ❌ No | ✅ Cancels + fresh run |
| **AwaitingApproval** | ❌ No | ❌ No | ❌ Error: Enable auto-cancel or correction |
| **AwaitingPostAction** | ✅ Yes | ❌ No | ⚠️ Error: Cannot cancel |
| **AwaitingPostAction** | ✅ Yes | ✅ Yes | ✅ Falls back to correction |
| **AwaitingPostAction** | ❌ No | ✅ Yes | ✅ Correction run |
| **Completed** | Any | ✅ Yes | ✅ Correction run |
| **Any (submission exists)** | ❌ No | ❌ No | ❌ Error with suggestions |

### Status Definitions

**Cancellable Statuses** ✅:
- **AwaitingApproval**: Run created but not submitted
- **NotSubmitted**: Draft run
- **Queued**: Waiting to process

**Non-Cancellable Statuses** ❌:
- **AwaitingPostAction**: Final processing stage
- **Completed**: Run finished
- **Cancelled**: Already cancelled
- **Processing**: Currently running

---

## 🏗️ Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Web UI (Frontend)                     │
│  - HTML/CSS/JavaScript                                   │
│  - User input forms                                      │
│  - Live action preview                                   │
│  - Real-time logs display                                │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP POST /api/run
                 ▼
┌─────────────────────────────────────────────────────────┐
│                 Express Server (Backend)                 │
│  - Receives user input                                   │
│  - Sets environment variables                            │
│  - Spawns Playwright process                             │
│  - Streams logs back to UI                               │
└────────────────┬────────────────────────────────────────┘
                 │ spawn child process
                 ▼
┌─────────────────────────────────────────────────────────┐
│            Playwright Test (Automation Engine)           │
│  - Reads configuration from env vars                     │
│  - Logs into PayHub (Microsoft SSO)                      │
│  - Navigates to group page                               │
│  - Detects existing runs                                 │
│  - Executes selected automation mode                     │
│  - Handles errors and edge cases                         │
└────────────────┬────────────────────────────────────────┘
                 │ Browser automation
                 ▼
┌─────────────────────────────────────────────────────────┐
│                  PayHub (Target System)                  │
│  - Ashley Furniture's payroll calculation platform       │
│  - Environments: Dev, Stage                              │
└─────────────────────────────────────────────────────────┘
```

### Key Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Automation**: Playwright (Chromium)
- **Authentication**: Microsoft SSO (OAuth2)
- **Environment**: dotenv for configuration

### File Structure

```
playwright-new/
├── ui/
│   ├── index.html              # Web UI interface
│   ├── script.js               # Frontend logic
│   └── server.js               # Express server
├── tests/
│   ├── group-run-ui-driven.spec.ts  # Main automation test
│   ├── start-group-run-simple.spec.ts  # Command-line version
│   └── verify-calculations-current-page.spec.ts  # Math verification
├── screenshots/                # Error screenshots
├── test-results/              # Test execution logs
├── .env                       # Credentials (gitignored)
├── package.json               # Dependencies
└── GROUP_RUN_AUTOMATION_DOCUMENTATION.md  # This file
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Failed to connect to server"

**Symptom**: Web UI shows "Failed to fetch" error

**Cause**: Backend server not running

**Solution**:
```powershell
# Stop any existing server
Ctrl+C

# Restart the server
npm run ui
```

#### Issue 2: Login Fails

**Symptom**: Test times out at Microsoft login page

**Cause**: Incorrect credentials or network issues

**Solution**:
1. Verify `.env` file has correct credentials
2. Check network connectivity to PayHub
3. Try logging in manually to verify credentials
4. Check if MFA/2FA is required (may need different auth flow)

#### Issue 3: "Force Cancel" Button Not Found

**Symptom**: Auto-cancel fails with "button not found"

**Cause**: Run status doesn't allow cancellation

**Solution**:
- Check the run status (AwaitingPostAction cannot be cancelled)
- Enable "Correction Run" checkbox to fall back to correction mode
- Or wait for the run to complete, then try again

#### Issue 4: Date Picker Issues

**Symptom**: Wrong dates selected or date picker doesn't open

**Cause**: Month navigation issues

**Solution**:
- Use dates close to the current month
- The system auto-populates end date to 2 weeks after start date
- Check browser console for JavaScript errors

#### Issue 5: Submit Button Disabled

**Symptom**: "START GROUP RUN" button remains disabled

**Cause**:
- Submission already exists (need correction mode)
- Form validation errors
- Original run not selected (correction mode)

**Solution**:
1. Enable "Correction Run" checkbox
2. Make sure to select an original run from dropdown
3. Check for validation errors in the form

---

## ❓ FAQ

### General Questions

**Q: How long does a typical automation run take?**
A: 1-2 minutes for check-only mode, 2-3 minutes for starting a run (includes login time).

**Q: Can I run this for multiple groups at once?**
A: Currently, no. You need to run each group separately. Batch operations are a planned future feature.

**Q: Is this safe to use in production?**
A: The tool currently supports Dev and Stage environments. Production support would require additional testing and approvals.

**Q: What happens if the automation fails midway?**
A: The system takes screenshots and logs all actions. You can review the logs to see what happened and resume manually if needed.

### Technical Questions

**Q: Can I run this from the command line without the Web UI?**
A: Yes! See `tests/start-group-run-simple.spec.ts` for the command-line version.

**Q: How does authentication work?**
A: Uses Microsoft OAuth2 SSO flow. Credentials are stored in `.env` and never logged or transmitted insecurely.

**Q: Can I customize the date range?**
A: Yes, you can enter any start date. The end date auto-populates to 14 days later (inclusive).

**Q: Where are the logs stored?**
A: Logs are displayed in real-time in the Web UI and also saved in `test-results/` directory.

**Q: How do I update the group list?**
A: Edit the `groupMapping` object in `ui/script.js` to add/remove groups.

---

## 🎓 Best Practices

### When to Use Each Mode

1. **Use Check Only** when:
   - Planning ahead
   - Verifying before manual work
   - Generating reports

2. **Use Normal Start** when:
   - Starting fresh runs for new periods
   - No existing runs exist

3. **Use Auto-Cancel** when:
   - Need to re-run with corrections
   - Previous run has errors
   - Run is in draft/approval status

4. **Use Correction Run** when:
   - Existing submission is complete
   - Need to adjust calculation data
   - Cannot cancel existing run

### Safety Tips

- ✅ **Always check the action preview** before clicking
- ✅ **Use Check Only first** to verify what exists
- ✅ **Start with Stage environment** before Dev
- ✅ **Review logs** after each run to confirm success
- ⚠️ **Be careful with Auto-Cancel** - it permanently cancels runs
- ⚠️ **Double-check dates** before submitting

---

## 📞 Support

### Getting Help

1. **Check the logs** in the Web UI for detailed error messages
2. **Review screenshots** in the `screenshots/` directory
3. **Check this documentation** for common issues
4. **Contact the development team** for persistent issues

### Reporting Issues

When reporting issues, please include:
- ✅ Environment (Dev/Stage)
- ✅ Group name
- ✅ Dates used
- ✅ Checkboxes selected
- ✅ Error message
- ✅ Screenshots (if available)
- ✅ Console logs

---

## 🚀 Future Enhancements

### Planned Features

- [ ] Batch operations (multiple groups at once)
- [ ] Scheduling (run at specific times)
- [ ] Email notifications
- [ ] Excel/CSV export of results
- [ ] Production environment support
- [ ] Advanced filtering and search
- [ ] Run history dashboard
- [ ] Retry logic with exponential backoff

---

## 📄 Version History

### v1.0 (Current)
- ✅ Web UI interface
- ✅ Check Only mode
- ✅ Normal start run
- ✅ Auto-cancel existing runs
- ✅ Correction run support
- ✅ Live action preview
- ✅ Comprehensive error handling
- ✅ Real-time logging

---

## 👏 Credits

**Developed by**: Ashley Furniture IT Team
**Technology**: Playwright, Node.js, Express
**Platform**: Ashley PayHub

---

**Last Updated**: June 11, 2026
**Document Version**: 1.0
**System Version**: 1.0

