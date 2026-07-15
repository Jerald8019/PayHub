# 📊 How to Create PowerPoint from PRESENTATION.md

## 🎯 **Recommended: Use Pandoc (One-time setup)**

### Step 1: Download Pandoc Installer

**Direct Download Link**:
```
https://github.com/jgm/pandoc/releases/download/3.1.11/pandoc-3.1.11-windows-x86_64.msi
```

Or visit: https://pandoc.org/installing.html

### Step 2: Install Pandoc

1. Run the downloaded `.msi` file
2. Click "Next" through the installer
3. Accept defaults
4. Click "Install"
5. Click "Finish"

### Step 3: Convert to PowerPoint

Open PowerShell in your project folder and run:

```powershell
pandoc PRESENTATION-PANDOC.md -o presentation.pptx
```

### Step 4: Open in PowerPoint

```powershell
start presentation.pptx
```

Done! Your presentation is ready to customize!

---

## 📋 **Alternative: Manual Creation (No Installation)**

I've created **PRESENTATION-SIMPLE.txt** with slide-by-slide content.

### Steps:

1. **Open PowerPoint**
2. **Create new presentation**
3. **For each slide in PRESENTATION-SIMPLE.txt**:
   - Add new slide
   - Copy title
   - Copy bullet points
   - Add relevant screenshot from `screenshots/` folder
4. **Apply Ashley branding**:
   - Company colors
   - Logo
   - Fonts

---

## 🖼️ **Screenshots Available**

Screenshots in `screenshots/` folder:
- `ui-group-5-page.png` - Web UI interface
- `ui-group-5-check.png` - Check mode example
- `group-9-check-runs.png` - Existing runs detection
- `employee-page-*.png` - Employee calculation pages

Add these to relevant slides!

---

## 🎨 **Design Tips**

### Recommended Layout:

**Title Slides**: Bold, large text
**Content Slides**: 
- Title at top
- 3-5 bullet points
- Screenshot on right (if applicable)

### Color Scheme:
- Primary: Ashley brand colors
- Success: Green (#28a745)
- Warning: Orange (#ffc107)  
- Error: Red (#dc3545)
- Info: Blue (#007bff)

### Fonts:
- Headers: Bold, 36-44pt
- Body: Regular, 18-24pt
- Code/Logs: Monospace, 14-16pt

---

## ⏱️ **Time Estimates**

| Method | Time | Quality |
|--------|------|---------|
| **Pandoc** | 2 min | Good (needs polish) |
| **Manual** | 1-2 hours | Excellent (full control) |

---

## 🎯 **What You Have**

Files ready for you:

1. **PRESENTATION.md** - Full markdown (30 slides)
2. **PRESENTATION-PANDOC.md** - Pandoc-ready version  
3. **PRESENTATION-SIMPLE.txt** - Manual copy-paste format
4. **screenshots/** folder - Images to insert

---

## 🚀 **Quick Start**

### If you want automated conversion:
```powershell
# Download Pandoc installer:
# https://github.com/jgm/pandoc/releases/download/3.1.11/pandoc-3.1.11-windows-x86_64.msi

# After installing:
pandoc PRESENTATION-PANDOC.md -o presentation.pptx
start presentation.pptx
```

### If you want manual creation:
```powershell
# Open the simple text version:
notepad PRESENTATION-SIMPLE.txt

# Then copy-paste into PowerPoint
```

---

## ❓ Need Help?

**Pandoc not working?**
- Make sure you downloaded the Windows installer (.msi)
- Restart PowerShell after installing
- Run: `pandoc --version` to verify installation

**PowerPoint issues?**
- Use PRESENTATION-SIMPLE.txt for manual creation
- Each section is clearly marked with slide number
- Just copy-paste content into PowerPoint

---

## 📞 Contact

Need assistance creating the presentation?
- IT Support: [Your IT contact]
- Documentation: See PRESENTATION.md for full content

---

**Created**: June 11, 2026  
**Files**: PRESENTATION.md, PRESENTATION-PANDOC.md, PRESENTATION-SIMPLE.txt
