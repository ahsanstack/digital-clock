const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function pad(num) {
  return num.toString().padStart(2, "0");
}

function updateClock() {
  const now = new Date();
  hoursEl.textContent = pad(now.getHours());
  minutesEl.textContent = pad(now.getMinutes());
  secondsEl.textContent = pad(now.getSeconds());
}

updateClock();
setInterval(updateClock, 1000);
