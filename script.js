// ---------- CLOCK ----------
  const clockDigitsEl = document.getElementById('clock-digits');
  const clockDateEl = document.getElementById('clock-date');
  const clockZoneEl = document.getElementById('clock-zone');
  const footerClockEl = document.getElementById('footer-clock');

  function pad(n){ return String(n).padStart(2, '0'); }

  function renderClock(){
    const now = new Date();
    const h = pad(now.getHours());
    const m = pad(now.getMinutes());
    const s = pad(now.getSeconds());
    clockDigitsEl.innerHTML = `${h}<span class="sep">:</span>${m}<span class="sep">:</span>${s}`;
    footerClockEl.textContent = `${h}:${m}:${s}`;

    clockDateEl.textContent = now.toLocaleDateString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
    clockZoneEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  }

  renderClock(); // paint immediately, don't wait 1s
  let clockIntervalId = setInterval(renderClock, 1000);

  // ---------- STOPWATCH ----------
  const swDigitsEl = document.getElementById('stopwatch-digits');
  const swStateEl = document.getElementById('sw-state');
  const swLapsCountEl = document.getElementById('sw-laps-count');
  const lapsEl = document.getElementById('laps');
  const btnStart = document.getElementById('btn-start');
  const btnLap = document.getElementById('btn-lap');
  const btnReset = document.getElementById('btn-reset');

  // All state lives here — never read back from the DOM.
  let swIntervalId = null;
  let elapsedMs = 0;       // accumulated elapsed time
  let startTimestamp = 0;  // Date.now() when current run began
  let isRunning = false;
  let laps = [];

  function formatStopwatch(ms){
    const totalCentis = Math.floor(ms / 10);
    const centis = totalCentis % 100;
    const totalSeconds = Math.floor(totalCentis / 100);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return { minutes: pad(minutes), seconds: pad(seconds), centis: pad(centis) };
  }

  function renderStopwatch(){
    const currentElapsed = isRunning ? elapsedMs + (Date.now() - startTimestamp) : elapsedMs;
    const { minutes, seconds, centis } = formatStopwatch(currentElapsed);
    swDigitsEl.innerHTML = `${minutes}<span class="sep">:</span>${seconds}<span class="ms">.${centis}</span>`;
  }

  function renderLaps(){
    lapsEl.innerHTML = '';
    laps.forEach((lapMs, i) => {
      const { minutes, seconds, centis } = formatStopwatch(lapMs);
      const row = document.createElement('div');
      row.className = 'lap-row';
      row.innerHTML = `<span>Lap ${i + 1}</span><span>${minutes}:${seconds}.${centis}</span>`;
      lapsEl.appendChild(row);
    });
    swLapsCountEl.textContent = `${laps.length} lap${laps.length === 1 ? '' : 's'}`;
  }

  function startStopwatch(){
    if (isRunning) return;
    isRunning = true;
    startTimestamp = Date.now();
    // Only ever one interval alive at a time — clear before creating.
    if (swIntervalId) clearInterval(swIntervalId);
    swIntervalId = setInterval(renderStopwatch, 33); // ~30fps, enough for centiseconds display

    btnStart.textContent = 'Pause';
    btnStart.classList.remove('primary');
    btnLap.disabled = false;
    swStateEl.textContent = 'Running';
  }

  function pauseStopwatch(){
    if (!isRunning) return;
    isRunning = false;
    elapsedMs += Date.now() - startTimestamp;
    clearInterval(swIntervalId);
    swIntervalId = null;
    renderStopwatch();

    btnStart.textContent = 'Resume';
    btnStart.classList.add('primary');
    btnLap.disabled = true;
    swStateEl.textContent = 'Paused';
  }

  function resetStopwatch(){
    isRunning = false;
    if (swIntervalId) clearInterval(swIntervalId);
    swIntervalId = null;
    elapsedMs = 0;
    laps = [];
    renderStopwatch();
    renderLaps();

    btnStart.textContent = 'Start';
    btnStart.classList.add('primary');
    btnLap.disabled = true;
    swStateEl.textContent = 'Ready';
  }

  btnStart.addEventListener('click', () => {
    isRunning ? pauseStopwatch() : startStopwatch();
  });

  btnLap.addEventListener('click', () => {
    if (!isRunning) return;
    const currentElapsed = elapsedMs + (Date.now() - startTimestamp);
    laps.push(currentElapsed);
    renderLaps();
  });

  btnReset.addEventListener('click', resetStopwatch);

  renderStopwatch();
  renderLaps();