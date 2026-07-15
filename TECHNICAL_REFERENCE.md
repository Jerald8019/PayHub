# 🔧 Group Run Automation - Technical Reference

## For Developers and System Administrators

---

## Architecture Overview

### System Flow

```
User Input (Web UI)
    ↓
Express Server (ui/server.js)
    ↓
Environment Variables
    ↓
Playwright Test (tests/group-run-ui-driven.spec.ts)
    ↓
Browser Automation
    ↓
PayHub Platform
```

---

## Component Details

### 1. Web UI Frontend (`ui/index.html` + `ui/script.js`)

**Purpose**: User interface for automation control

**Key Features**:
- Form inputs for configuration
- Live action preview
- Real-time log streaming via Server-Sent Events (SSE)
- Responsive design

**JavaScript Functions**:
```javascript
// Main automation trigger
async function runAutomation(checkOnly = false)

// Show status message
function showStatus(message, type = 'info')

// Add log entry
function addLog(message)

// Update action preview based on selections
function updateActionPreview()

// Format dates from HTML input to MM/DD/YYYY
function formatDate(dateString)
```

**Group Mapping**:
Located in `ui/script.js`:
```javascript
const groupMapping = {
    'KWFHBW - Pay Process': '5',
    'AGRHBW - Pay Process': '9',
    // ... more groups
};
```

To add new groups, edit this object.

---

### 2. Express Backend (`ui/server.js`)

**Purpose**: Bridge between Web UI and Playwright

**Key Endpoints**:

#### POST `/api/run`
**Request Body**:
```json
{
    "environment": "stage",
    "groupName": "KWFHBW - Pay Process",
    "groupId": "5",
    "startDate": "03/22/2026",
    "endDate": "04/05/2026",
    "autoCancel": true,
    "correctionRun": false,
    "checkOnly": false
}
```

**Response**: Server-Sent Events (SSE) stream with logs

**Process**:
1. Receives configuration from Web UI
2. Sets environment variables for Playwright
3. Spawns Playwright test as child process
4. Streams stdout/stderr back to client via SSE
5. Returns exit code on completion

**Environment Variables Set**:
```javascript
{
    TEST_ENV: "stage",
    GROUP_NAME: "KWFHBW - Pay Process",
    GROUP_ID: "5",
    PAY_PERIOD_START: "03/22/2026",
    PAY_PERIOD_END: "04/05/2026",
    AUTO_CANCEL: "true",
    CORRECTION_RUN: "false",
    CHECK_ONLY: "false"
}
```

---

### 3. Playwright Automation (`tests/group-run-ui-driven.spec.ts`)

**Purpose**: Core automation engine

**Configuration**:
```typescript
const TEST_ENV = process.env.TEST_ENV || 'dev';
const GROUP_NAME = process.env.GROUP_NAME || '';
const GROUP_ID = process.env.GROUP_ID || '';
const PAY_PERIOD_START = process.env.PAY_PERIOD_START || '';
const PAY_PERIOD_END = process.env.PAY_PERIOD_END || '';
const AUTO_CANCEL = process.env.AUTO_CANCEL === 'true';
const CORRECTION_RUN = process.env.CORRECTION_RUN === 'true';
const CHECK_ONLY = process.env.CHECK_ONLY === 'true';
```

**Test Steps**:

1. **Login to PayHub**
   - Navigate to base URL
   - Handle Microsoft SSO OAuth2 flow
   - Fill email (wait for field visibility)
   - Fill password
   - Handle "Stay signed in" prompt
   - Wait for redirect to PayHub

2. **Navigate to Group**
   - Click "Calculation Set Groups" link
   - Click specific group button
   - Wait for group page to load
   - Scroll to "Group Job Runs" section

3. **Check for Existing Runs**
   - Call `checkForExistingRun()` function
   - Search page content for date patterns
   - Detect run status from HTML

4. **Handle Existing Run (if found)**
   - If CHECK_ONLY: Report and exit
   - If AUTO_CANCEL: Attempt cancellation
   - If CORRECTION_RUN: Proceed to dialog

5. **Cancel Existing Run** (if AUTO_CANCEL enabled)
   - Find "Force Cancel This Run" button
   - Click and confirm
   - Wait for cancellation
   - Refresh page to verify

6. **Start New Run**
   - Click "Start Group Run" button
   - Navigate date picker to correct month
   - Select start day
   - Wait for end date to auto-populate
   - Handle correction run if needed
   - Submit form

---

## Key Functions

### `checkForExistingRun(page, groupId, startDate, endDate)`

**Purpose**: Detect existing runs on group page

**Algorithm**:
```typescript
1. Get page HTML and text content
2. Normalize dates to MM/DD/YYYY format
3. Search for both date formats:
   - MM/DD/YYYY (e.g., 03/22/2026)
   - DD/MM/YYYY (e.g., 22/03/2026)
4. If both dates found:
   a. Extract surrounding context
   b. Detect status from nearby text
   c. Return { exists: true, status: "..." }
5. If not found:
   a. Return { exists: false }
```

**Status Detection**:
Looks for keywords in nearby text:
- "AwaitingApproval"
- "AwaitingPostAction"
- "Completed"
- "Cancelled"
- "Processing"
- "Queued"

---

## Authentication Flow

### Microsoft SSO (OAuth2)

**Step 1**: Navigate to PayHub
```
https://people.stage.ashleyfurniture.com/payhub/calculation-engine
```

**Step 2**: Redirect to Microsoft login
```
https://login.microsoftonline.com/...
```

**Step 3**: Fill email
```typescript
await page.getByRole('textbox', { name: 'someone@ashleyfurniture.com' }).fill(email);
await page.getByRole('button', { name: 'Next' }).click();
```

**Step 4**: Fill password
```typescript
await page.getByRole('textbox', { name: 'Password' }).fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
```

**Step 5**: Handle "Stay signed in"
```typescript
await page.getByRole('button', { name: 'Yes' }).click();
```

**Step 6**: Redirect back to PayHub
```
https://people.stage.ashleyfurniture.com/payhub/calculation-engine
```

---

## Date Handling

### Format Conversion

**HTML Input**: `YYYY-MM-DD` (standard HTML date format)
```
2026-03-22
```

**Frontend Conversion**: `MM/DD/YYYY` (PayHub format)
```typescript
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;  // "03/22/2026"
}
```

**Detection**: Supports both formats
- `MM/DD/YYYY` → 03/22/2026
- `DD/MM/YYYY` → 22/03/2026

### Auto-Population

When start date is selected in the dialog:
1. PayHub automatically sets end date to 14 days later (inclusive)
2. Automation reads this value
3. No manual end date selection needed

---

## Error Handling

### Screenshot Capture

On errors, screenshots are saved to:
```
screenshots/
├── login-failed-{timestamp}.png
├── email-field-not-found-{timestamp}.png
├── password-field-not-found-{timestamp}.png
├── submit-disabled-{timestamp}.png
└── correction-run-disabled-{timestamp}.png
```

### Error Types

**Login Errors**:
- Email field not found
- Password field not found
- Stuck on Microsoft login page

**Navigation Errors**:
- Group page not loaded
- "Group Job Runs" section not found

**Execution Errors**:
- Force Cancel button not found
- Submit button disabled
- Correction run dropdown issues

### Retry Logic

Currently no automatic retries. Test fails on first error.

**Future Enhancement**: Implement exponential backoff retry logic

---

## Configuration Files

### `.env`
```env
ASHLEY_USERNAME=your.email@ashleyfurniture.com
ASHLEY_PASSWORD=YourPassword123
```

**Security**: This file is gitignored. Never commit credentials!

### `package.json`

**Scripts**:
```json
{
  "scripts": {
    "ui": "node ui/server.js"
  }
}
```

**Dependencies**:
```json
{
  "@playwright/test": "^1.40.0",
  "express": "^4.18.2",
  "dotenv": "^16.0.3"
}
```

---

## API Reference

### Server Endpoints

#### `GET /`
Returns the Web UI HTML

#### `POST /api/run`
Starts automation with provided configuration

**Parameters**:
- `environment`: "dev" | "stage"
- `groupName`: String (e.g., "KWFHBW - Pay Process")
- `groupId`: String (e.g., "5")
- `startDate`: String in MM/DD/YYYY format
- `endDate`: String in MM/DD/YYYY format
- `autoCancel`: Boolean
- `correctionRun`: Boolean
- `checkOnly`: Boolean

**Returns**: SSE stream with logs

---

## Extending the System

### Adding New Groups

Edit `ui/script.js`:
```javascript
const groupMapping = {
    'KWFHBW - Pay Process': '5',
    'NEW_GROUP - Pay Process': '99',  // Add here
};
```

Then update the HTML select:
```html
<option value="NEW_GROUP - Pay Process">NEW_GROUP - Pay Process</option>
```

### Adding New Environments

Edit `tests/group-run-ui-driven.spec.ts`:
```typescript
const BASE_URLS = {
  dev: 'https://people.dev.ashleyfurniture.com/payhub/calculation-engine',
  stage: 'https://people.stage.ashleyfurniture.com/payhub/calculation-engine',
  prod: 'https://people.ashleyfurniture.com/payhub/calculation-engine'  // Add here
};
```

### Adding New Automation Modes

1. Add checkbox in `ui/index.html`
2. Read value in `ui/script.js` `runAutomation()`
3. Send to backend in request body
4. Add to environment variables in `ui/server.js`
5. Read in `tests/group-run-ui-driven.spec.ts`
6. Implement logic in test

---

## Performance Optimization

### Current Performance

- **Login**: 15-20 seconds
- **Navigation**: 5-10 seconds
- **Detection**: 2-5 seconds
- **Execution**: 10-20 seconds
- **Total**: 1-3 minutes per run

### Optimization Opportunities

1. **Reuse browser sessions** (persistent context)
2. **Parallel execution** (multiple groups)
3. **Cache authentication tokens**
4. **Reduce wait times** (smart waiting instead of fixed delays)

---

## Security Considerations

### Credentials

- ✅ Stored in `.env` file (gitignored)
- ✅ Never logged to console
- ✅ Not sent to frontend
- ❌ No encryption at rest (consider using secret manager)

### Network

- All traffic over HTTPS
- OAuth2 for authentication
- No sensitive data in URLs

### Access Control

- Requires valid Ashley Furniture credentials
- No additional authentication on Web UI (consider adding)

---

## Monitoring & Logging

### Log Levels

**Console logs**:
- Info: Regular progress updates
- Warning: Existing runs detected, edge cases
- Error: Failures, exceptions

**Screenshots**:
- Captured on all errors
- Saved to `screenshots/` directory

### Metrics to Track

- Success rate
- Average execution time
- Error types and frequency
- Groups most commonly used

---

## Testing

### Manual Testing Checklist

- [ ] Login succeeds
- [ ] Group navigation works
- [ ] Check Only detects existing runs
- [ ] Normal start works with no conflicts
- [ ] Auto-cancel works for AwaitingApproval status
- [ ] Correction run selects original run correctly
- [ ] Error messages are clear
- [ ] Logs stream in real-time

### Automated Testing

Currently no unit tests. Consider adding:
- Mock PayHub responses
- Test date formatting
- Test status detection logic

---

## Deployment

### Prerequisites

- Node.js v14+
- Network access to PayHub
- Valid credentials

### Steps

1. Clone repository
2. Run `npm install`
3. Create `.env` file
4. Start server: `npm run ui`
5. Access via browser

### Production Considerations

- Use process manager (PM2, forever)
- Add logging/monitoring
- Implement authentication on Web UI
- Use secret manager for credentials
- Set up SSL/TLS
- Implement rate limiting

---

**Document Version**: 1.0  
**Last Updated**: June 11, 2026
