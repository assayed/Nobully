// Renders the HeroKid app icon, Android adaptive icon layers, splash and favicon.
// Run: node scripts/make-icons.js   (uses the pre-installed Playwright Chromium)
const path = require('path');
const { chromium } = require('playwright');
const out = (f) => path.join(__dirname, '..', 'assets', f);

const hero = (bg) => `
  ${bg ? `<rect width="1024" height="1024" fill="#FF7A00"/><circle cx="512" cy="512" r="430" fill="#FFB347"/>` : ''}
  <g transform="translate(512 560)">
    <path d="M-230 40 Q-260 330 -300 360 L300 360 Q260 330 230 40 Z" fill="#DC2626"/>
    <rect x="-150" y="80" width="300" height="300" rx="80" fill="#2563EB"/>
    <path d="M0 150 l28 56 62 9 -45 44 11 62 -56 -29 -56 29 11 -62 -45 -44 62 -9 z" fill="#FDE047"/>
    <circle cx="0" cy="-90" r="210" fill="#EBB98F"/>
    <path d="M-205 -110 Q-205 -330 0 -330 Q205 -330 205 -110 Q140 -230 0 -230 Q-140 -230 -205 -110 Z" fill="#2B1B0E"/>
    <path d="M-200 -130 Q0 -170 200 -130 L200 -40 Q0 -80 -200 -40 Z" fill="#DC2626"/>
    <ellipse cx="-80" cy="-90" rx="34" ry="30" fill="#fff"/><ellipse cx="80" cy="-90" rx="34" ry="30" fill="#fff"/>
    <circle cx="-74" cy="-88" r="16" fill="#1F2937"/><circle cx="86" cy="-88" r="16" fill="#1F2937"/>
    <path d="M-90 10 Q0 90 90 10 Z" fill="#B91C1C"/>
    <circle cx="-140" cy="-10" r="26" fill="#FB7185" opacity=".45"/><circle cx="140" cy="-10" r="26" fill="#FB7185" opacity=".45"/>
  </g>`;
const svg = (inner, size = 1024, bg = 'none') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024" style="background:${bg}">${inner}</svg>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const shot = async (markup, file, size, transparent = true) => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0;background:transparent">${markup}</body></html>`);
    await page.locator('svg').screenshot({ path: out(file), omitBackground: transparent });
  };
  await shot(svg(hero(true)), 'icon.png', 1024, false);
  // adaptive foreground: keep the art inside the 66% safe zone
  await shot(svg(`<g transform="translate(512 512) scale(0.62) translate(-512 -512)">${hero(false)}</g>`), 'android-icon-foreground.png', 1024);
  await shot(svg('<rect width="1024" height="1024" fill="#FF7A00"/><circle cx="512" cy="512" r="380" fill="#FFB347"/>'), 'android-icon-background.png', 1024, false);
  await shot(svg(`<g transform="translate(512 512) scale(0.62) translate(-512 -512)" fill="#000"><circle cx="512" cy="470" r="210"/><rect x="362" y="640" width="300" height="300" rx="80"/></g>`), 'android-icon-monochrome.png', 1024);
  await shot(svg(`<g transform="translate(512 512) scale(0.8) translate(-512 -512)">${hero(false)}</g>`), 'splash-icon.png', 1024);
  await shot(svg(hero(true), 48), 'favicon.png', 48, false);
  // PWA (home-screen) icons
  await shot(svg(hero(true), 192), 'pwa-192.png', 192, false);
  await shot(svg(hero(true), 512), 'pwa-512.png', 512, false);
  await shot(svg(`<rect width="1024" height="1024" fill="#FF7A00"/><circle cx="512" cy="512" r="400" fill="#FFB347"/><g transform="translate(512 512) scale(0.7) translate(-512 -512)">${hero(false)}</g>`, 512), 'pwa-maskable-512.png', 512, false);
  await shot(svg(hero(true), 180), 'apple-touch-icon.png', 180, false);
  await browser.close();
  console.log('icons written');
})();
