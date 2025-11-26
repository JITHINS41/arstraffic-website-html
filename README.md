# Tailwind Starter Site

A minimal static website scaffolded with HTML, Tailwind CSS (CDN), and vanilla JavaScript. No build tools required.

## Quick Start

- Open `index.html` directly in your browser, or
- Serve the folder locally to enable smooth routing/history and consistent CORS behavior.

### Option 1: Open the file
Just double-click `index.html` in File Explorer.

### Option 2: Serve locally (PowerShell)
If you have Python installed:

```powershell
# From the project folder
cd e:\POC\arstraffic
python -m http.server 5173
```
Then open http://localhost:5173 in your browser.

If you have Node.js and `npx`:

```powershell
cd e:\POC\arstraffic
npx serve -l 5173 .
```

## What’s Included
- Responsive navigation with mobile menu
- Light/Dark mode toggle with persisted preference
- Hero, Features, About, and Contact sections
- Simple contact form with client-side handler

## Customize
- Update colors in the Tailwind inline config inside `index.html`.
- Add custom CSS rules in `assets/css/styles.css`.
- Extend interactions in `assets/js/app.js`.

## Notes
- This uses Tailwind via CDN for speed; for production apps, switch to a proper Tailwind build to enable purging and advanced configuration.
