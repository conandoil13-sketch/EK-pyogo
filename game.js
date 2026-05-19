const frame = document.querySelector("#gameFrame");
const timeLeftEl = document.querySelector("#timeLeft");
const stageEl = document.querySelector("#stage");
const touchCountEl = document.querySelector("#touchCount");
const targetCountEl = document.querySelector("#targetCount");
const progressFill = document.querySelector("#progressFill");
const statusKicker = document.querySelector("#statusKicker");
const statusTitle = document.querySelector("#statusTitle");
const mushroomButton = document.querySelector("#mushroomButton");
const mushroomImage = document.querySelector("#mushroomImage");
const tapBurst = document.querySelector("#tapBurst");
const flashLayer = document.querySelector("#flashLayer");
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");

const ROUND_MS = 10000;
const BASE_TARGET = 46;
const TARGET_STEP = 16;
const flashColors = ["#00fff0", "#ff00d6", "#fff200", "#ffffff"];
const shoutLines = [
  "종이 한 장 차이",
  "표고버섯",
  "눈치 좀 볼래",
  "디지털",
  "벌레",
  "네온 한 장 차이",
  "불빛 좀 볼래",
  "스테이지 찢어",
  "클럽 모드",
  "터치 중독",
  "글리치 업",
  "XY GLOW",
];

let stage = 1;
let touches = 0;
let target = BASE_TARGET;
let roundStart = 0;
let rafId = 0;
let isRunning = false;
let lastTouchEnd = 0;

function setCopy(kicker, title) {
  statusKicker.textContent = kicker;
  statusTitle.textContent = title;
}

function syncHud(timeValue = ROUND_MS) {
  const progress = Math.min(1, touches / target);

  timeLeftEl.textContent = Math.max(0, timeValue / 1000).toFixed(1);
  stageEl.textContent = stage;
  touchCountEl.textContent = touches;
  targetCountEl.textContent = target;
  progressFill.style.width = `${progress * 100}%`;
  mushroomImage.style.setProperty("--grow", 0.48 + progress * 0.72);
  mushroomButton.style.setProperty("--aura-grow", 0.72 + progress * 0.32);
}

function targetForStage(value) {
  return BASE_TARGET + (value - 1) * TARGET_STEP;
}

function resetRound(nextStage = 1) {
  cancelAnimationFrame(rafId);
  stage = nextStage;
  touches = 0;
  target = targetForStage(stage);
  isRunning = false;
  startButton.textContent = "START";
  frame.classList.remove("game-over", "stage-clear");
  mushroomImage.src = "./assets/ek_1.png";
  setCopy("READY", "PYOGO RUSH");
  syncHud(ROUND_MS);
}

function startRound() {
  cancelAnimationFrame(rafId);
  touches = 0;
  roundStart = performance.now();
  isRunning = true;
  startButton.textContent = "BOOST";
  frame.classList.remove("game-over", "stage-clear");
  mushroomImage.src = "./assets/ek_1.png";
  setCopy("TAP FAST", "GROW EK");
  syncHud(ROUND_MS);
  tick();
}

function tick(now = performance.now()) {
  if (!isRunning) return;

  const elapsed = now - roundStart;
  const remaining = ROUND_MS - elapsed;
  syncHud(remaining);

  if (remaining <= 0) {
    failRound();
    return;
  }

  rafId = requestAnimationFrame(tick);
}

function clearStage() {
  isRunning = false;
  cancelAnimationFrame(rafId);
  frame.classList.add("stage-clear");
  mushroomImage.src = "./assets/ek_2smile.png";
  setCopy("CLEAR", `STAGE ${stage}`);
  startButton.textContent = "NEXT";
  fireFlash(50, 42, true);

  window.setTimeout(() => {
    stage += 1;
    target = targetForStage(stage);
    touches = 0;
    setCopy("NEXT LEVEL", `STAGE ${stage}`);
    startRound();
  }, 740);
}

function failRound() {
  isRunning = false;
  cancelAnimationFrame(rafId);
  frame.classList.add("game-over");
  setCopy("TIME UP", "TRY AGAIN");
  startButton.textContent = "RETRY";
  syncHud(0);
}

function fireFlash(x, y, big = false) {
  flashLayer.style.setProperty("--flash-x", `${x}%`);
  flashLayer.style.setProperty("--flash-y", `${y}%`);
  flashLayer.classList.remove("active");
  void flashLayer.offsetWidth;
  flashLayer.classList.add("active");

  tapBurst.classList.remove("active");
  void tapBurst.offsetWidth;
  tapBurst.classList.add("active");

  const burstCount = big ? 18 : 7;
  for (let i = 0; i < burstCount; i += 1) {
    const spark = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = (big ? 92 : 52) + Math.random() * 58;
    spark.className = "spark";
    spark.style.left = `${x}%`;
    spark.style.top = `${y}%`;
    spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    spark.style.setProperty("--spark-color", flashColors[i % flashColors.length]);
    frame.appendChild(spark);
    window.setTimeout(() => spark.remove(), 470);
  }
}

function showSpeechBubble(x, y) {
  const bubble = document.createElement("span");
  const line = shoutLines[Math.floor(Math.random() * shoutLines.length)];
  const driftX = Math.random() * 36 - 18;

  bubble.className = "speech-bubble";
  bubble.textContent = line;
  bubble.style.left = `${Math.min(82, Math.max(18, x + driftX))}%`;
  bubble.style.top = `${Math.min(72, Math.max(18, y - 7 - Math.random() * 12))}%`;
  bubble.style.setProperty("--bubble-tilt", `${(Math.random() * 12 - 6).toFixed(2)}deg`);
  bubble.style.setProperty("--bubble-color", flashColors[Math.floor(Math.random() * flashColors.length)]);
  frame.appendChild(bubble);
  window.setTimeout(() => bubble.remove(), 760);
}

function tapMushroom(event) {
  if (!isRunning) {
    startRound();
  }

  touches += 1;
  const rect = frame.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  const tilt = (Math.random() * 9 - 4.5).toFixed(2);

  mushroomImage.style.setProperty("--tilt", `${tilt}deg`);
  mushroomButton.classList.remove("hit");
  void mushroomButton.offsetWidth;
  mushroomButton.classList.add("hit");
  window.setTimeout(() => mushroomButton.classList.remove("hit"), 90);

  syncHud(ROUND_MS - (performance.now() - roundStart));
  fireFlash(x, y);
  showSpeechBubble(x, y);

  if (touches >= target) {
    clearStage();
  }
}

startButton.addEventListener("click", startRound);
resetButton.addEventListener("click", () => resetRound(1));
mushroomButton.addEventListener("pointerdown", tapMushroom);

document.addEventListener(
  "touchend",
  (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 360) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  { passive: false },
);

document.addEventListener(
  "gesturestart",
  (event) => {
    event.preventDefault();
  },
  { passive: false },
);

document.addEventListener("contextmenu", (event) => event.preventDefault());

resetRound();
