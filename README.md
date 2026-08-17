# Digital Clock & Stopwatch

A live digital clock and a manual stopwatch, built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

## Files

- `index.html` — markup
- `style.css` — all styling
- `script.js` — all behavior (clock + stopwatch logic)

Open `index.html` directly in any browser (it links `style.css` and `script.js` relatively, so keep all three files in the same folder), or deploy the folder as a static site.

## Approach

- **Clock:** `setInterval(renderClock, 1000)` reads `new Date()` every second and writes the formatted `HH:MM:SS` string to the DOM. The first paint happens immediately on load (rather than waiting for the first tick) so the clock doesn't show a blank/zero state for up to a second.
- **Stopwatch:** state (`isRunning`, `elapsedMs`, `startTimestamp`, `laps`) is kept entirely in JavaScript variables, never read back from the DOM. On Start, `startTimestamp = Date.now()` and a single `setInterval` (33ms, ~30fps) re-renders the display. On Pause, the interval is cleared and the run's duration is folded into `elapsedMs`. On Resume, a new interval starts from the accumulated `elapsedMs`. Reset clears everything, including recorded laps.
- **No stacked intervals:** every start path clears any existing interval before creating a new one, and pause/reset always call `clearInterval`.
- **Accuracy while the tab is inactive:** the stopwatch doesn't count ticks — it stores a real timestamp (`Date.now()`) at start and computes elapsed time as `elapsedMs + (Date.now() - startTimestamp)` on every render. Browsers throttle `setInterval` in background tabs, but because the actual elapsed time is derived from wall-clock timestamps rather than "how many ticks fired," the displayed time is still correct once the tab becomes active again — it just doesn't visually update while backgrounded.
- **Formatting:** all values are zero-padded with a small `pad()` helper (`String(n).padStart(2, '0')`).
- **Laps:** each Lap click snapshots the current elapsed time into a `laps` array and re-renders a list (newest on top).

## Key decisions

- Single self-contained `index.html` — easiest to review, deploy, and grade with zero setup.
- Two visually distinct "instrument panels" (clock in amber, stopwatch in cyan) so the two features read as separate tools despite sharing one page.
- Centiseconds (`.CS`) shown on the stopwatch for finer feedback than whole seconds, per the MM:SS.CS in the UI.

## Known limitations

- Stopwatch state is in-memory only — refreshing the page resets it (no `localStorage` persistence was requested/added).
- No audio/vibration cues on lap or reset.
- Not tested against every timezone edge case for the clock's date label; it relies on the browser's `Intl` API.

## Tools

HTML5, CSS3, vanilla JavaScript (`Date`, `setInterval`, `clearInterval`).