const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const ampmEl = document.getElementById("ampm");
const dateEl = document.getElementById("date");
const greetingEl = document.getElementById("greeting");
const formatToggleBtn = document.getElementById("formatToggle");
const themeToggleBtn = document.getElementById("themeToggle");

let is24Hour = false;

const themes = [
  {
    bg1: "#0f0c29",
    bg2: "#302b63",
    bg3: "#24243e",
    accent: "#00f5d4",
    accent2: "#f15bb5",
  },
  {
    bg1: "#1a2980",
    bg2: "#26d0ce",
    bg3: "#0f2027",
    accent: "#ffe066",
    accent2: "#38ef7d",
  },
  {
    bg1: "#3a1c71",
    bg2: "#d76d77",
    bg3: "#ffaf7b",
    accent: "#ffffff",
    accent2: "#ffd700",
  },
  {
    bg1: "#000000",
    bg2: "#434343",
    bg3: "#1c1c1c",
    accent: "#00ff9c",
    accent2: "#00b8ff",
  },
];

let themeIndex = 0;

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

  let ampmText = "";
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
}

formatToggleBtn.addEventListener("click", () => {
  is24Hour = !is24Hour;
  formatToggleBtn.textContent = is24Hour
    ? "Switch to 12-Hour"
    : "Switch to 24-Hour";
  updateClock();
});

function applyTheme(theme) {
  const root = document.documentElement.style;
  root.setProperty("--bg-1", theme.bg1);
  root.setProperty("--bg-2", theme.bg2);
  root.setProperty("--bg-3", theme.bg3);
  root.setProperty("--accent", theme.accent);
  root.setProperty("--accent-2", theme.accent2);
}

themeToggleBtn.addEventListener("click", () => {
  themeIndex = (themeIndex + 1) % themes.length;
  applyTheme(themes[themeIndex]);
});

applyTheme(themes[themeIndex]);
updateClock();
setInterval(updateClock, 1000);
