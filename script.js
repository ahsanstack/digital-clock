/* ===== Sidebar Navigation ===== */
const navItems = document.querySelectorAll(".nav-item");
const tabPanels = document.querySelectorAll(".tab-panel");
const panelTitle = document.getElementById("panelTitle");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((n) => n.classList.remove("active"));
    tabPanels.forEach((p) => p.classList.remove("active"));
    item.classList.add("active");
    document.getElementById(item.dataset.tab).classList.add("active");
    panelTitle.textContent = item.dataset.title;
  });
});

const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const ampmEl = document.getElementById("ampm");
const dateEl = document.getElementById("date");
const greetingEl = document.getElementById("greeting");
const formatToggleBtn = document.getElementById("formatToggle");

let is24Hour = false;

function pad(num) {
  return num.toString().padStart(2, "0");
}

function updateGreeting(hours) {
  let text = "Good Night";
  if (hours >= 5 && hours < 12) text = "Good Morning";
  else if (hours >= 12 && hours < 17) text = "Good Afternoon";
  else if (hours >= 17 && hours < 21) text = "Good Evening";
  greetingEl.textContent = text;
}

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  updateGreeting(hours);

  if (!is24Hour) {
    ampmText = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    ampmEl.style.display = "inline";
    ampmEl.textContent = ampmText;
  } else {
    ampmEl.style.display = "none";
  }

  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  dateEl.textContent = now.toLocaleDateString("en-US", options);
  checkAlarms(now);
}

formatToggleBtn.addEventListener("click", () => {
  is24Hour = !is24Hour;
  formatToggleBtn.textContent = is24Hour
    ? "Switch to 12-Hour"
    : "Switch to 24-Hour";
  updateClock();
});

/* ===== Beep sound (no audio file needed) ===== */
function playBeep(duration = 250, frequency = 880, times = 1) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();
  let i = 0;

  function beepOnce() {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration / 1000);
    i++;
    if (i < times) setTimeout(beepOnce, duration + 150);
  }
  beepOnce();
}

/* ===== Alarm ===== */
const alarmInput = document.getElementById("alarmInput");
const addAlarmBtn = document.getElementById("addAlarmBtn");
const alarmList = document.getElementById("alarmList");
const alarmRinging = document.getElementById("alarmRinging");
const dismissAlarmBtn = document.getElementById("dismissAlarmBtn");

let alarms = [];
let ringingAlarmId = null;

function renderAlarms() {
  alarmList.innerHTML = "";
  alarms.forEach((alarm) => {
    const li = document.createElement("li");
    if (!alarm.enabled) li.classList.add("disabled");

    const label = document.createElement("span");
    label.textContent = formatAlarmTime(alarm.time);

    const controlsWrap = document.createElement("span");

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "alarm-toggle";
    toggleBtn.textContent = alarm.enabled ? "ON" : "OFF";
    toggleBtn.addEventListener("click", () => {
      alarm.enabled = !alarm.enabled;
      renderAlarms();
    });

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => {
      alarms = alarms.filter((a) => a.id !== alarm.id);
      renderAlarms();
    });
    controlsWrap.appendChild(toggleBtn);
    controlsWrap.appendChild(removeBtn);
    li.appendChild(label);
    li.appendChild(controlsWrap);
    alarmList.appendChild(li);
  });
}

function formatAlarmTime(time24) {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  let hour = h % 12;
  hour = hour === 0 ? 12 : hour;
  return `${pad(hour)}:${pad(m)} ${period}`;
}

addAlarmBtn.addEventListener("click", () => {
  if (!alarmInput.value) return;
  alarms.push({ id: Date.now(), time: alarmInput.value, enabled: true });
  alarmInput.value = "";
  renderAlarms();
});

function checkAlarms(now) {
  if (ringingAlarmId !== null) return;
  const currentHM = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  if (now.getSeconds() !== 0) return;

  const match = alarms.find((a) => a.enabled && a.time === currentHM);
  if (match) {
    ringingAlarmId = match.id;
    alarmRinging.classList.remove("hidden");
    playBeep(300, 880, 6);
  }
}

dismissAlarmBtn.addEventListener("click", () => {
  alarmRinging.classList.add("hidden");
  ringingAlarmId = null;
});

updateClock();
setInterval(updateClock, 1000);

/* ===== Stopwatch ===== */
const stopwatchDisplay = document.getElementById("stopwatchDisplay");
const swStartBtn = document.getElementById("swStartBtn");
const swLapBtn = document.getElementById("swLapBtn");
const swResetBtn = document.getElementById("swResetBtn");
const lapList = document.getElementById("lapList");

let swRunning = false;
let swStartTime = 0;
let swElapsed = 0;
let swIntervalId = null;
let lapCount = 0;

function formatStopwatch(ms) {
  const totalMs = Math.floor(ms);
  const centis = Math.floor((totalMs % 1000) / 10);
  const totalSeconds = Math.floor(totalMs / 1000);
  const secs = totalSeconds % 60;
  const mins = Math.floor(totalSeconds / 60) % 60;
  const hrs = Math.floor(totalSeconds / 3600);
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}.${pad(centis)}`;
}

function tickStopwatch() {
  swElapsed = Date.now() - swStartTime;
  stopwatchDisplay.textContent = formatStopwatch(swElapsed);
}

swStartBtn.addEventListener("click", () => {
  if (!swRunning) {
    swRunning = true;
    swStartTime = Date.now() - swElapsed;
    swIntervalId = setInterval(tickStopwatch, 10);
    swStartBtn.textContent = "Pause";
  } else {
    swRunning = false;
    clearInterval(swIntervalId);
    swStartBtn.textContent = "Start";
  }
});

swLapBtn.addEventListener("click", () => {
  if (!swRunning) return;
  lapCount++;
  const li = document.createElement("li");
  li.innerHTML = `<span>Lap ${lapCount}</span><span>${formatStopwatch(swElapsed)}</span>`;
  lapList.prepend(li);
});

swResetBtn.addEventListener("click", () => {
  swRunning = false;
  clearInterval(swIntervalId);
  swElapsed = 0;
  lapCount = 0;
  stopwatchDisplay.textContent = "00:00:00.00";
  swStartBtn.textContent = "Start";
  lapList.innerHTML = "";
});
