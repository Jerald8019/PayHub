# 📋 Group List Updated - All 16 Groups Added

## ✅ **Update Complete!**

I've successfully updated the group list across all configuration files to include all 16 pay process groups you requested.

---

## 📊 **All 16 Groups Now Available**

### ✅ **Fully Configured (IDs Known)**
1. **KWFHBW - Pay Process** (ID: 5) - ENABLED ✅
2. **SLFCAB - Pay Process** (ID: 10) - ENABLED ✅

### ⚠️ **Needs Group ID (Currently TBD)**
3. **AGRHBW - Pay Process** (ID: TBD) - Disabled until ID is set
4. **AHSHBW - Pay Process** (ID: TBD) - Disabled until ID is set
5. **DSGHRL - Pay Process** (ID: TBD) - Disabled until ID is set
6. **DSGSAL - Pay Process** (ID: TBD) - Disabled until ID is set
7. **DSMHRL - Pay Process** (ID: TBD) - Disabled until ID is set
8. **DSMSAL - Pay Process** (ID: TBD) - Disabled until ID is set
9. **ECMHBW - Pay Process** (ID: TBD) - Disabled until ID is set
10. **KWFSBW - Pay Process** (ID: TBD) - Disabled until ID is set
11. **RLFHBW - Pay Process** (ID: TBD) - Disabled until ID is set
12. **RLFSBW - Pay Process** (ID: TBD) - Disabled until ID is set
13. **SLFNSB - Pay Process** (ID: TBD) - Disabled until ID is set
14. **SLFNVB - Pay Process** (ID: TBD) - Disabled until ID is set
15. **SWFHBW - Pay Process** (ID: TBD) - Disabled until ID is set
16. **SWFSBW - Pay Process** (ID: TBD) - Disabled until ID is set

---

## 📁 **Files Updated**

### 1. `tests/group-run-config.ts` ✅
- Added all 16 groups to `ALL_GROUP_RUNS` array
- Set default pay period: `02/22/2026` to `03/07/2026`
- Groups with unknown IDs are marked as `enabled: false`
- Each group has proper tags and description

### 2. `ui/index.html` ✅
- Updated dropdown menu with all 16 groups
- Groups appear in alphabetical order
- All groups are selectable from the web UI

### 3. `ui/script.js` ✅
- Updated `groupMapping` object with all 16 groups
- Groups with unknown IDs are marked as `'TBD'`
- Includes helpful comment to update as IDs are discovered

---

## 🚀 **How to Use Right Now**

### **Web UI** (Recommended!)
The UI is already running at **http://localhost:3000**

1. Refresh your browser (F5) to see all 16 groups in the dropdown
2. Select any group from the list
3. Currently, only **KWFHBW** and **SLFCAB** will work (they have IDs)
4. Other groups will show in the list but need their IDs first

### **Command Line**
```bash
npx playwright test start-group-run-simple.spec.ts --headed
```
This will run only the enabled groups (KWFHBW and SLFCAB).

---

## 🔍 **Finding Group IDs**

To enable the other 14 groups, you need to find their group IDs. Here's how:

### **Option 1: Manual Discovery**
1. Go to PayHub: https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups
2. Click on each group name (e.g., "AGRHBW - Pay Process")
3. Look at the URL: `...calculation-set-groups/12` - the number at the end is the ID

### **Option 2: Use the Group ID Finder Script**
```bash
npx playwright test tests/helpers/find-group-ids.spec.ts -g "Discover" --headed
```

This will:
- Navigate to the groups page
- Click through all groups
- Log their IDs
- Create a mapping for you

---

## ⚙️ **Enabling a Group**

Once you know a group's ID, update it in **3 places**:

### 1. `tests/group-run-config.ts`
```typescript
{
  groupName: 'AGRHBW - Pay Process',
  groupId: '15',  // ← Change from 'TBD' to actual ID
  payPeriodStart: '02/22/2026',
  payPeriodEnd: '03/07/2026',
  description: 'AGRHBW Weekly Pay Run',
  enabled: true,  // ← Change to true
  tags: ['weekly', 'agrhbw']
}
```

### 2. `ui/script.js`
```javascript
const groupMapping = {
    'AGRHBW - Pay Process': '15',  // ← Change from 'TBD'
    // ... rest
};
```

### 3. Restart UI Server (if running)
```bash
# Stop server (Ctrl+C in the terminal)
npm run ui
```

---

## 📊 **Current Status**

| Status | Count | Groups |
|--------|-------|--------|
| ✅ **Enabled & Working** | 2 | KWFHBW, SLFCAB |
| ⚠️ **Needs ID** | 14 | All others |

**Progress: 12.5% (2/16 groups configured)**

---

## 🎯 **Next Steps**

### **Immediate:**
1. Refresh your browser at http://localhost:3000
2. You'll now see all 16 groups in the dropdown!
3. Test with KWFHBW or SLFCAB (they work!)

### **To Enable More Groups:**
1. Find the group IDs (manually or with script)
2. Update `tests/group-run-config.ts` with IDs
3. Update `ui/script.js` with IDs
4. Set `enabled: true` for each group
5. Restart UI server

---

## 💡 **Pro Tips**

1. **Find IDs in batches:** Use the group ID finder script to get all IDs at once
2. **Test one at a time:** Enable and test each group individually
3. **Keep IDs documented:** Create a separate file with all group IDs for reference
4. **Different pay periods:** Some groups might have different pay period dates

---

## 🌐 **Web UI Access**

**URL:** http://localhost:3000  
**Status:** Running (refresh to see updates!)

The dropdown now shows:
```
-- Select a group --
AGRHBW - Pay Process
AHSHBW - Pay Process
DSGHRL - Pay Process
DSGSAL - Pay Process
DSMHRL - Pay Process
DSMSAL - Pay Process
ECMHBW - Pay Process
KWFHBW - Pay Process ✅ (ID known)
KWFSBW - Pay Process
RLFHBW - Pay Process
RLFSBW - Pay Process
SLFCAB - Pay Process ✅ (ID known)
SLFNSB - Pay Process
SLFNVB - Pay Process
SWFHBW - Pay Process
SWFSBW - Pay Process
```

---

## ✅ **Summary**

🎉 **All 16 groups are now in the configuration!**
- ✅ Web UI dropdown updated
- ✅ Configuration file updated
- ✅ Script mapping updated
- ⚠️ 14 groups need IDs to be enabled

**You're ready to use the automation with the 2 working groups, and can enable others as you discover their IDs!**

---

**Happy Automating! 🚀**
