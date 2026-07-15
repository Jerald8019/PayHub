# 🔍 How to Find Group IDs - Simple Manual Guide

Since the automatic discovery script is having trouble with the page structure, here's the **easiest manual method** to find all group IDs.

---

## 🎯 **Quick Method** (2-3 minutes per environment)

### Step 1: Open the Groups Page

**Dev Environment:**
```
https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups
```

**Stage Environment:**
```
https://people.stage.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups
```

### Step 2: For Each Group

1. **Click on the group name** (e.g., "AGRHBW - Pay Process")
2. **Look at the URL in your browser**
3. The URL will be something like:
   ```
   https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/15
                                                                                             ^^
                                                                                          This is the ID!
   ```
4. **Write down the number** at the end

---

## 📋 **ID Collection Sheet**

Use this template to record the IDs:

### Dev Environment IDs:

| Group Name | Group ID | URL |
|------------|----------|-----|
| AGRHBW - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |
| AHSHBW - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |
| DSGHRL - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |
| DSGSAL - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |
| DSMHRL - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |
| DSMSAL - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |
| ECMHBW - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |
| KWFHBW - Pay Process | **5** ✅ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/5` |
| KWFSBW - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |
| RLFHBW - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |
| RLFSBW - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |
| SLFCAB - Pay Process | **10** ✅ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/10` |
| SLFNSB - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |
| SLFNVB - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |
| SWFHBW - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |
| SWFSBW - Pay Process | ___ | `https://people.dev.ashleyfurniture.com/payhub/calculation-engine/calculation-set-groups/___` |

---

## ⚡ **After You Collect All IDs**

### Option 1: Send Me the List

Just paste the IDs here in chat like this:
```
AGRHBW: 12
AHSHBW: 13
DSGHRL: 14
... etc
```

And I'll automatically update all the config files for you!

### Option 2: Update Manually

Edit these 2 files:

#### 1. `tests/group-run-config.ts`
Replace `'TBD'` with the actual ID and set `enabled: true`:
```typescript
{
  groupName: 'AGRHBW - Pay Process',
  groupId: '12',  // ← Change this
  payPeriodStart: '02/22/2026',
  payPeriodEnd: '03/07/2026',
  description: 'AGRHBW Weekly Pay Run',
  enabled: true,  // ← Change this
  tags: ['weekly', 'agrhbw']
}
```

#### 2. `ui/script.js`
Replace `'TBD'` with the actual ID:
```javascript
const groupMapping = {
    'AGRHBW - Pay Process': '12',  // ← Change this
    // ... rest
};
```

---

## 🚀 **Pro Tip: Browser DevTools Method**

If you want to be fancy, you can use the browser console:

1. Open Dev Tools (F12)
2. Go to the groups page
3. Paste this in the console:

```javascript
// Extract all group IDs from the page
const groups = {};
document.querySelectorAll('a, button').forEach(el => {
    const text = el.textContent?.trim();
    const href = el.getAttribute('href');
    
    if (text && href && href.includes('calculation-set-groups/')) {
        const match = href.match(/calculation-set-groups\/(\d+)/);
        if (match) {
            groups[text] = match[1];
        }
    }
});
console.table(groups);
```

This will show a nice table of all groups and their IDs!

---

## 📝 **Quick Reference: Known IDs**

**Dev Environment:**
- KWFHBW - Pay Process: **5** ✅
- SLFCAB - Pay Process: **10** ✅

**Need to find:**
- 14 other groups

---

## ❓ **Troubleshooting**

**Q: I don't see the groups on the page?**  
A: Make sure you're logged in. The page might also use pagination - scroll down or look for "Next" buttons.

**Q: The URL doesn't have a number at the end?**  
A: Make sure you clicked on the group name itself, not just selected the row.

**Q: Do Dev and Stage have the same IDs?**  
A: Not necessarily! IDs might be different between environments. For now, collect Dev IDs.

---

## ✅ **Once You Have All IDs**

1. **Share them with me** (paste in chat)
2. I'll update all config files automatically
3. Restart the UI: `npm run ui`
4. All 16 groups will be enabled! 🎉

---

**Need help? Just paste what you found and I'll take it from there!** 🚀
