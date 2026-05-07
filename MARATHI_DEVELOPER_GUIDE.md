# Marathi Language - Developer Quick Reference Guide

## Quick Access Paths

### Translation Files
```
artifacts/cyber-safety-hub/src/locales/
├── en/translation.json    (English - Reference)
├── hi/translation.json    (Hindi)
├── kn/translation.json    (Kannada)
└── mr/translation.json    (Marathi) ← UPDATED
```

### Configuration Files
```
artifacts/cyber-safety-hub/src/
├── i18n.ts                        (i18n Config)
├── main.tsx                       (i18n Initialization)
└── components/ui/
    └── language-switcher.tsx      (Language Selector)
```

---

## How to Use Translations in Components

### Basic Usage
```typescript
import { useTranslation } from "react-i18next";

export function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('home.hero_badge')}</h1>;
  // Output in Marathi: राष्ट्रीय सायबर जागरूकता उपक्रम
}
```

### With Variables
```typescript
const { t } = useTranslation();
return <p>{t('dashboard.streak_label')}: 7 Days</p>;
```

### Nested Keys
```typescript
const { t } = useTranslation();
// Accesses: "home": { "hero_badge": "..." }
t('home.hero_badge')
```

---

## Marathi Translation Key Structure

### Available Sections
```json
{
  "home": {...},          // Hero section, features, showcase
  "learn": {...},         // Learning modules
  "nav": {...},           // Navigation and language labels
  "dash": {...},          // Dashboard statistics
  "scanner": {...},       // AI Scam Scanner
  "report": {...},        // Cyber threat reporting
  "dashboard": {...},     // Full dashboard UI
  "signup": {...},        // User registration
  "trainer": {...},       // Learning games
  "learn_ui": {...}       // Interactive components
}
```

### Common Keys in Marathi

| Key | Example Value |
|-----|---------------|
| `nav.lang_mr` | मराठी |
| `nav.home` | होम |
| `nav.learn` | शिका |
| `nav.dashboard` | डॅशबोर्ड |
| `dash.national_loss_t` | राष्ट्रीय आर्थिक नुकसान |
| `dashboard.intel_badge` | लाइव्ह इंटेल फीड |

---

## Adding New Translations

### Step 1: Add to English First
File: `artifacts/cyber-safety-hub/src/locales/en/translation.json`
```json
{
  "new_section": {
    "new_key": "English text here"
  }
}
```

### Step 2: Add to All Languages
File: `artifacts/cyber-safety-hub/src/locales/mr/translation.json`
```json
{
  "new_section": {
    "new_key": "नई मराठी पाठ येथे"
  }
}
```

### Step 3: Use in Component
```typescript
const { t } = useTranslation();
return <div>{t('new_section.new_key')}</div>;
```

### Step 4: Test All Languages
- Switch to each language
- Verify text displays correctly
- Check for layout issues

---

## Language Codes

| Language | Code | Script | Native Name |
|----------|------|--------|-------------|
| English | `en` | Latin | English |
| Hindi | `hi` | Devanagari | हिंदी |
| Kannada | `kn` | Kannada | ಕನ್ನಡ |
| **Marathi** | **`mr`** | **Devanagari** | **मराठी** |

---

## Testing Marathi Language

### 1. Check Language Switcher
```
✓ Globe icon visible in header
✓ "मराठी" option in dropdown
✓ Page updates to Marathi when selected
✓ Indicator shows Marathi is selected
```

### 2. Verify Dashboard
```
✓ Header: "सायबर डॅशबोर्ड" visible
✓ Statistics: "राष्ट्रीय आर्थिक नुकसान" shown
✓ Charts: Tooltips in Marathi
✓ Buttons: "डॅशबोर्ड उघडा" text correct
```

### 3. Check All Pages
```
✓ Home: "शिकण्यास सुरुवात करा" button
✓ Learn: "शिक्षण मॉड्यूल्स" title
✓ Trainer: "लर्निंग गेम्स" header
✓ Scanner: "एआय स्कॅम स्कॅनर" title
✓ Report: "सायबर धोक्याची तक्रार करा" title
```

---

## Common Issues & Solutions

### Issue: Text Not Updating
**Solution:** 
- Clear browser cache
- Reload page (Ctrl+Shift+R)
- Check console for errors
- Verify key exists in translation file

### Issue: Marathi Text Not Displaying
**Solution:**
- Verify system fonts support Devanagari
- Check font family in CSS
- Inspect element to see actual text
- Verify JSON is valid (no syntax errors)

### Issue: Language Not Persisting
**Solution:**
- Check browser localStorage
- Verify i18next-browser-languagedetector enabled
- Clear browser data
- Check console for storage errors

### Issue: Missing Translations
**Solution:**
```javascript
// Check if key exists
const { t } = useTranslation();
console.log(t('key.that.might.not.exist'));

// Add fallback text
t('missing.key', { defaultValue: 'Fallback text' })
```

---

## Performance Optimization

### Translation Files
- Size: ~15 KB per language (optimal)
- Format: Static JSON (cached)
- Loading: On-demand per language
- Impact: Negligible performance impact

### Best Practices
✅ Use translation keys consistently  
✅ Keep keys short and descriptive  
✅ Group related translations  
✅ Use dot notation for nesting  
✅ Avoid dynamic key generation  

---

## API Integration with Marathi

### Dashboard API Example
```typescript
// API returns English data
const apiData = await api.getDashboardData();

// UI renders with Marathi labels
<div>
  <p>{t('dash.national_loss_t')}</p>  // "राष्ट्रीय आर्थिक नुकसान"
  <p>{apiData.loss}</p>                // "₹1,750 Cr+"
</div>
```

---

## Marathi Typography Notes

### Script: Devanagari
- Uses Devanagari script (like Hindi)
- Proper encoding: UTF-8 (handled by JSON)
- Font support: Most modern browsers
- Combines consonants + vowel marks
- Right-to-left considerations: Not needed (LTR)

### Common Marathi Characters
```
Consonants: क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण
Vowels: आ इ ई उ ऊ ऋ ऌ ए ऐ ओ औ
Vowel Marks: ा ि ी ु ू ृ ॄ े ै ो ौ
```

---

## Maintenance Checklist

### Weekly
- [ ] Monitor language switching functionality
- [ ] Check for console errors in different languages
- [ ] Verify dashboard displays correctly

### Monthly
- [ ] Review translation quality
- [ ] Check for missing translations
- [ ] Update translation tool metadata

### Quarterly
- [ ] Audit all translation files
- [ ] Update font packages if needed
- [ ] Performance testing across languages
- [ ] User feedback review

---

## Resources

### i18next Documentation
- https://www.i18next.com/
- https://react.i18next.com/

### React i18next
- https://github.com/i18next/react-i18next
- API Reference: https://react.i18next.com/

### Marathi Language Resources
- Marathi Script: Devanagari
- Unicode Range: U+0900 to U+0950
- Language Code: ISO 639-1 "mr"

---

## Support & Escalation

### For Translation Issues
1. Check translation file for typos
2. Verify JSON syntax
3. Test in browser console
4. Check i18next logs

### For Display Issues
1. Verify font support
2. Check CSS styling
3. Inspect HTML elements
4. Check browser console

### For Performance Issues
1. Profile with DevTools
2. Check bundle size
3. Monitor translation loading
4. Analyze network requests

---

## Quick Commands

### Development
```bash
# Start dev server
cd artifacts/cyber-safety-hub
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

### Git Operations
```bash
# Check status
git status

# View language-related changes
git log --grep="language" --grep="marathi" --grep="i18n"

# Create new branch for language updates
git checkout -b feature/language-updates
```

---

**Last Updated:** May 7, 2026  
**Version:** 1.0  
**Status:** Marathi Language - Production Ready ✅
