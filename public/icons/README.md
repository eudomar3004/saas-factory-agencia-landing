# PWA Icons

## Current Status
SVG icons have been generated in multiple sizes for PWA support.

## Sizes Available
- 72x72px
- 96x96px
- 128x128px
- 144x144px
- 152x152px
- 192x192px
- 384x384px
- 512x512px

## For Production

### Option 1: Manual Conversion
1. Use online converter: https://convertio.co/svg-png/
2. Upload each SVG file
3. Download as PNG
4. Replace SVG files with PNG files

### Option 2: Automated Conversion (Recommended)
Install sharp for image processing:
```bash
npm install --save-dev sharp
```

Then create a conversion script or use existing tools.

## Custom Icons
To use custom icons:
1. Replace the SVG content in `scripts/generate-icons.js`
2. Or directly replace the icon files in this directory
3. Ensure all required sizes are available
