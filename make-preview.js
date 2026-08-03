/* Rebuilds preview.png (the 1200x630 social card) from preview.src.html.
   Run after adding a piece to index.html:  node make-preview.js
   Uses the chromium playwright already has on this machine — no install. */
const { chromium } = require('playwright-core');
const path = require('path');

const EXE = path.join(process.env.LOCALAPPDATA, 'ms-playwright',
  'chromium_headless_shell-1234', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');

(async () => {
  // --disable-lcd-text forces greyscale antialiasing. DirectWrite's subpixel AA
  // leaves orange/blue fringes on thin light type over black once it's a PNG.
  const b = await chromium.launch({ executablePath: EXE, args: ['--disable-lcd-text', '--font-render-hinting=none'] });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.goto('file:///' + path.join(__dirname, 'preview.src.html').replace(/\\/g, '/'));
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(__dirname, 'preview.png') });
  await b.close();
  console.log('preview.png written — 1200x630');
})();
