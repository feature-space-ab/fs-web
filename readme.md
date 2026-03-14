# Feature Space Website (`fs-web`)

Static multi-page marketing site for Feature Space.

## Pages

- `index.html` - homepage
- `services.html` - service offerings
- `work.html` - delivery patterns and mission types
- `contact.html` - contact details and inquiry form
- `about.html` - deprecated page kept for compatibility

## Local preview

1. Open a terminal in this repo.
2. Run: `python3 -m http.server 8080`
3. Open: `http://localhost:8080`

## Structure

- `css/base.css` - theme tokens, reset, typography
- `css/layout.css` - layouts, grids, responsive behavior
- `css/branding.css` - logo and brand-specific styles
- `css/motion.css` - reveal animations and motion preferences
- `js/video.js` - background video behavior
- `js/site.js` - mobile nav, reveal animations, contact form mailto flow

## Loader animation assets

- Output folder: `fs-assets/anim`
- Generated files:
  - `feature-space-loader.gif` (web fallback)
  - `feature-space-loader.apng` (animated PNG)
  - `feature-space-loader.png` (animated PNG with `.png` extension for app assets)
- Generator script: `scripts/create_logo_loader.py`
- Regenerate:
  1. Create/activate a Python env with Pillow installed.
  2. Run `python scripts/create_logo_loader.py`
