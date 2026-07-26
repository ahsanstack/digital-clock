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
}

formatToggleBtn.addEventListener("click", () => {
  is24Hour = !is24Hour;
  formatToggleBtn.textContent = is24Hour
    ? "Switch to 12-Hour"
    : "Switch to 24-Hour";
  updateClock();
});

updateClock();
setInterval(updateClock, 1000);
