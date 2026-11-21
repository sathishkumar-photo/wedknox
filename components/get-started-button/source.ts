// LOCATION: components/get-started-button/source.ts   (NEW FILE)
// get-started-button.html stays EXACTLY as ThreeUI published it (SHA-256 b1dcac0a...f9ff).
// This file only adapts it to your contact form, in memory, at load time. Three small adjustments:
//   1. label     - "SIGN UP" becomes the text you pass in. Use "\n" for a second line; the font
//                  size shrinks automatically so the longest line always fits left of the crystal.
//   2. click     - the button tells the page it was pressed (postMessage), because the iframe is sandboxed.
//   3. size/look - the button scales to a compact strip instead of a full 1080px stage, and the grey desk
//                  behind it becomes transparent so it sits directly on your page.

export const ACTIVATE_EVENT = "threeui-get-started:activate";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function swap(source: string, from: string, to: string): string {
  if (!source.includes(from)) {
    console.warn(`[GetStartedButton] Could not find "${from.slice(0, 40)}..." in the source; adjustment skipped.`);
    return source;
  }
  return source.replace(from, () => to); // function form: no "$&" surprises in `to`
}

// The text area runs from x=134 to about x=474 on the button's 706-unit design grid (the crystal starts at 502).
// Geist Mono letters are 0.6em wide plus the 4.1/50 letter-spacing the original uses.
const TEXT_WIDTH = 340;
const ORIGINAL_FONT = 50;
function fitFontSize(label: string): number {
  const longest = Math.max(...label.split("\n").map((l) => l.length), 1);
  return Math.min(ORIGINAL_FONT, Math.floor((TEXT_WIDTH / (longest * 0.682)) * 10) / 10);
}

export function buildSource(raw: string, label: string, ariaLabel: string): string {
  let out = raw;
  const font = fitFontSize(label);
  const ratio = font / ORIGINAL_FONT;

  // 1. label (the font shrinks automatically so the longest line fits)
  out = swap(out, `<span class="label" aria-hidden="true">SIGN UP</span>`, `<span class="label" aria-hidden="true">${escapeHtml(label)}</span>`);
  out = swap(out, `aria-label="Sign up"`, `aria-label="${escapeHtml(ariaLabel)}"`);
  out = swap(out, `<title>Sign Up</title>`, `<title>${escapeHtml(ariaLabel)}</title>`);

  // 2. click bridge
  out = swap(
    out,
    `const cta = document.querySelector('.cta');`,
    `const cta = document.querySelector('.cta');\n  cta.addEventListener('click', () => parent.postMessage({ type: '${ACTIVATE_EVENT}' }, '*'));`
  );

  // 3. compact sizing (the original sizes itself to a 1080px stage, far too tall for a form)
  out = swap(
    out,
    `</style>`,
    `:root{--u:min(calc(100vw / 830),calc(100vh / 330),0.62px);--bg:transparent}\n` +
      // same look as the original label, only the size follows the text length (and lines get a little air)
      `.label{font-size:calc(${font} * var(--u));letter-spacing:calc(${(4.1 * ratio).toFixed(2)} * var(--u));line-height:1.28;-webkit-text-stroke-width:calc(${(0.45 * ratio).toFixed(2)} * var(--u))}\n</style>`
  );

  return out;
}