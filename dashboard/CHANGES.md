# CattleVision AI - Overview Dashboard Changes

This package contains only the modified and newly created files for the **Overview Dashboard** (including hero pastoral artwork restoration, SVG farm animations, light-green glassmorphism design system, contrast enhancements, and responsive layout).

---

## 1. Files Included & Summary of Changes

### Added Components & Assets
- **`src/components/HeroScannerCard.jsx`**: Hero card container featuring the full-card pastoral canvas, frosted glass left text panel (`.glass-hero-panel`) with clean diagonal clip-path, WCAG AA compliant text contrast, and glass CTA pill button.
- **`src/components/PastoralScene.jsx`**: High-performance SVG-driven animated pastoral scene (continuous rotating windmill blades, rotating sun rays & face warmth pulse, cow eating/chewing grass motion with snout sprite, eye blink, ear flick, breathing expansion, tail swish, swaying grass tufts and tree canopies, 60fps micro-parallax).
- **`src/components/TopBar.jsx`**: Glassmorphic top navigation bar with sync indicator pill (`3 Scans Pending Sync`), profile avatar, and responsive drawer trigger.
- **`src/components/KpiMetricCards.jsx`**: 3 KPI metric cards ("Identified", "Avg. confidence", "Breeds covered") styled with light-green glassmorphism, inner highlights, and trend badges.
- **`src/components/RightColumnAnalytics.jsx`**: Right column analytics cards ("Scans Distribution by Breed" donut chart, "Recent Scan Image Thumbnails", "Quick Actions" census export, "Local Animal Hospitals") styled with light-green glassmorphism.
- **`src/components/RecentIdentificationsLog.jsx`**: Field identification log table styled with a light-green glassmorphic surface and confidence status badges.
- **`src/components/ScanFAB.jsx`**: Floating Action Button (FAB) styled as a light-green frosted glass circle with deep green camera icon and notification ping.
- **`src/assets/hero_pastoral_art_v2.jpg`**: High-resolution canonical pastoral background artwork (1376×768) anchored right/top to keep the full cow, smiling sun, and windmill in view.
- **`src/assets/cow_snout_chew.png`**: Transparent feathered snout and grass mouthful sprite used by `PastoralScene.jsx` for the chewing animation.

### Modified Existing Files
- **`src/index.css`**: Defined CSS variables for the light-green glassmorphic design system (`--glass-base`, `--glass-strong`, `--glass-border`, etc.), utility classes (`.glass`, `.glass-hover`, `.glass-hero-panel`, `.glass-pill`), animation keyframes, mobile blur limits, and compatibility fixes.
- **`src/pages/Home.jsx`**: Overview dashboard view assembling all hero, metric, analytics, and log components, plus 3 fixed ambient background blobs (`#CFE8CF`, `#B9CDB3`, `#F6D9A8`) providing rich refraction beneath glass cards.
- **`tailwind.config.js`**: Extended design system tokens including custom palette (`forest`, `sage`, `wheat`), typography (`font-serif`, `font-sans`), and shadows.
- **`src/App.jsx`**: Wired `TopBar`, `ScanFAB`, and drawer navigation into the application shell.
- **`src/components/Navbar.jsx`**: Updated drawer navigation to support both controlled state (via `TopBar` hamburger button) and standalone usage.
- **`.env.example`**: Clean template specifying required environment variable names without secrets.

---

## 2. Dependencies

The animations are implemented purely with native SVG `<animateTransform>`, CSS keyframes, and requestAnimationFrame, keeping the bundle lightweight without heavy 3D or animation libraries.

Make sure the following UI dependency is installed:
```bash
npm install lucide-react
```

---

## 3. Environment Variables

Create or update `.env` in your frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 4. How to Apply to Your Project

1. Extract the contents of this ZIP directly into your `frontend/` directory (or wherever your Vite/React root resides):
   ```bash
   unzip -o dashboard-changes.zip -d frontend/
   ```
2. Verify all files are placed according to the folder structure:
   - `src/components/` -> component files
   - `src/pages/` -> `Home.jsx`
   - `src/assets/` -> `hero_pastoral_art_v2.jpg`, `cow_snout_chew.png`
   - `src/index.css` -> overwrites/updates `index.css`
   - `tailwind.config.js` -> updates Tailwind theme extensions
3. Run the development server:
   ```bash
   npm run dev
   ```
