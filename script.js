const introScreen = document.getElementById("introScreen");
const surpriseScreen = document.getElementById("surpriseScreen");
const finalScreen = document.getElementById("finalScreen");
const tellBtn = document.getElementById("tellBtn");
const laterBtn = document.getElementById("laterBtn");
const laterHint = document.getElementById("laterHint");
const nextBtn = document.getElementById("nextBtn");
const typewriterEl = document.getElementById("typewriter");
const actionArea = document.getElementById("actionArea");
const musicToggle = document.getElementById("musicToggle");

const birthdayMessage =
"Happy Birthday, Suparna. You are truly special, and I hope your day is filled with laughter, beautiful surprises, and all the warmth you share with everyone around you.";

let laterAttempts = 0;
let audioCtx = null;
let melodyTimer = null;
let oscillator = null;
let gainNode = null;
let harmonyOscillator = null;
let harmonyGainNode = null;
let musicOn = false;
let boxConfettiOrigin = null;

function getEmitterOriginInParticlesLayer() {
const emitter = document.querySelector(".confetti-emitter");
const particlesLayer = document.getElementById("confettiParticles");
if (!emitter || !particlesLayer) {
return boxConfettiOrigin;
}

const emitterRect = emitter.getBoundingClientRect();
const particlesRect = particlesLayer.getBoundingClientRect();

if (emitterRect.width <= 0 || emitterRect.height <= 0) {
return boxConfettiOrigin;
}

boxConfettiOrigin = {
x: emitterRect.left + emitterRect.width / 2 - particlesRect.left,
y: emitterRect.top + emitterRect.height / 2 - particlesRect.top
};

return boxConfettiOrigin;
}

function showScreen(screen) {
[introScreen, surpriseScreen, finalScreen].forEach((item) => {
item.classList.remove("show");
item.setAttribute("aria-hidden", "true");
});
screen.classList.add("show");
screen.setAttribute("aria-hidden", "false");
}

function typeWriter(text, speed = 32) {
typewriterEl.textContent = "";
let i = 0;
const timer = setInterval(() => {
typewriterEl.textContent += text[i];
i += 1;
if (i >= text.length) {
clearInterval(timer);
}
}, speed);
}

function launchConfetti(count = 120, originOverride = null) {
const particlesLayer = document.getElementById("confettiParticles");
const origin = originOverride || getEmitterOriginInParticlesLayer();
if (!particlesLayer) {
return;
}
if (!origin) {
return;
}

const originX = origin.x;
const originY = origin.y;

const colors = ["#ffd9ea", "#ff9ec2", "#ff6b87", "#ffffff", "#ffe8f3"];
const shapes = ["confetti-circle", "confetti-heart", "confetti-star"];
const sizes = [6, 7, 8, 9];

for (let i = 0; i < count; i += 1) {
const bit = document.createElement("span");
bit.className = "confetti-bit";

// Cone burst centered straight up from emitter  
const coneSpread = (Math.PI / 180) * (42 + Math.random() * 14);  
const angle = -Math.PI / 2 + (Math.random() - 0.5) * coneSpread;  
const speed = 3.2 + Math.random() * 2.8;  
const velocityX = Math.cos(angle) * speed;  
const velocityY = Math.sin(angle) * speed - 1.6;  

const rotation = Math.random() * 360;  
const rotationSpeed = -8 + Math.random() * 16;  
const size = sizes[Math.floor(Math.random() * sizes.length)];  
const color = colors[Math.floor(Math.random() * colors.length)];  
const shapeClass = shapes[Math.floor(Math.random() * shapes.length)];  

let posX = originX;  
let posY = originY;  

  bit.style.left = `${posX}px`;  
  bit.style.top = `${posY}px`;  
  bit.style.width = `${size}px`;  
  bit.style.height = `${size}px`;  
bit.style.background = color;  
bit.style.pointerEvents = "none";  
  bit.style.transform = `rotate(${rotation}deg)`;  

bit.classList.add(shapeClass);  
particlesLayer.appendChild(bit);  

const duration = 1550 + Math.random() * 900;  
const gravity = 0.11;  
const drag = 0.992;  

let vx = velocityX;  
let vy = velocityY;  
let currentRotation = rotation;  
let elapsedTime = 0;  

const animate = () => {  
  if (elapsedTime >= duration) {  
    bit.remove();  
    return;  
  }  

  vy += gravity;  
  vx *= drag;  
  vy *= drag;  

  posX += vx;  
  posY += vy;  

  bit.style.left = `${posX}px`;  
  bit.style.top = `${posY}px`;  

  currentRotation += rotationSpeed;  
  bit.style.transform = `rotate(${currentRotation}deg)`;  

  const life = elapsedTime / duration;  
  bit.style.opacity = `${Math.max(0, 1 - life * 1.25)}`;  

  elapsedTime += 16;  
  requestAnimationFrame(animate);  
};  

requestAnimationFrame(animate);

}
}

function moveLaterButton() {
laterAttempts += 1;
const areaRect = actionArea.getBoundingClientRect();
const btnRect = laterBtn.getBoundingClientRect();
const tellRect = tellBtn.getBoundingClientRect();

if (!actionArea.style.minHeight) {
actionArea.style.minHeight = "150px";
}

const padding = 8;
const avoidGap = 12;
const maxX = Math.max(0, areaRect.width - btnRect.width - padding * 2);
const maxY = Math.max(0, areaRect.height - btnRect.height - padding * 2);
const tellX = tellRect.left - areaRect.left;
const tellY = tellRect.top - areaRect.top;
const tellW = tellRect.width;
const tellH = tellRect.height;

const overlapsTell = (x, y) => {
const overlapsX = x < tellX + tellW + avoidGap && x + btnRect.width > tellX - avoidGap;
const overlapsY = y < tellY + tellH + avoidGap && y + btnRect.height > tellY - avoidGap;
return overlapsX && overlapsY;
};

const candidates = [
{ x: padding, y: padding },
{ x: padding + maxX, y: padding },
{ x: padding, y: padding + maxY },
{ x: padding + maxX, y: padding + maxY },
{
  x: padding,
  y: Math.min(padding + maxY, Math.max(padding, tellY + tellH + avoidGap))
}
];

for (let i = 0; i < 24; i += 1) {
  candidates.push({
    x: padding + Math.floor(Math.random() * (maxX + 1)),
    y: padding + Math.floor(Math.random() * (maxY + 1))
  });
}

let x = padding;
let y = padding;
for (const candidate of candidates) {
  if (!overlapsTell(candidate.x, candidate.y)) {
    x = candidate.x;
    y = candidate.y;
    break;
  }
}

laterBtn.style.position = "absolute";
laterBtn.style.transform = "none";
laterBtn.style.left = `${x}px`;
laterBtn.style.top = `${y}px`;

if (laterAttempts >= 3) {
laterHint.textContent = "Don't run away 😄 just click the other one!";
}
}

function initMusic() {
musicToggle.classList.add("off");

const beatMs = 320;
const melody = [
{ freq: 392.0, beats: 1 },
{ freq: 392.0, beats: 1 },
{ freq: 440.0, beats: 2 },
{ freq: 392.0, beats: 2 },
{ freq: 523.25, beats: 2 },
{ freq: 493.88, beats: 4 },
{ freq: 392.0, beats: 1 },
{ freq: 392.0, beats: 1 },
{ freq: 440.0, beats: 2 },
{ freq: 392.0, beats: 2 },
{ freq: 587.33, beats: 2 },
{ freq: 523.25, beats: 4 },
{ freq: 392.0, beats: 1 },
{ freq: 392.0, beats: 1 },
{ freq: 783.99, beats: 2 },
{ freq: 659.25, beats: 2 },
{ freq: 523.25, beats: 2 },
{ freq: 493.88, beats: 2 },
{ freq: 440.0, beats: 3 },
{ freq: 698.46, beats: 1 },
{ freq: 698.46, beats: 1 },
{ freq: 659.25, beats: 2 },
{ freq: 523.25, beats: 2 },
{ freq: 587.33, beats: 2 },
{ freq: 523.25, beats: 4 }
];
let noteIndex = 0;

function playNextNote() {
if (!musicOn || !oscillator || !audioCtx) {
return;
}

const note = melody[noteIndex];  
oscillator.frequency.setValueAtTime(note.freq, audioCtx.currentTime);  
if (harmonyOscillator) {  
  harmonyOscillator.frequency.setValueAtTime(note.freq * 0.75, audioCtx.currentTime);  
}  
noteIndex = (noteIndex + 1) % melody.length;  
melodyTimer = setTimeout(playNextNote, note.beats * beatMs);

}

function startMusic() {
if (!audioCtx) {
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
audioCtx = new AudioContextClass();
oscillator = audioCtx.createOscillator();
gainNode = audioCtx.createGain();
harmonyOscillator = audioCtx.createOscillator();
harmonyGainNode = audioCtx.createGain();

oscillator.type = "sine";  
  harmonyOscillator.type = "triangle";  
  oscillator.frequency.value = melody[0].freq;  
  harmonyOscillator.frequency.value = melody[0].freq * 0.75;  
  gainNode.gain.value = 0.09;  
  harmonyGainNode.gain.value = 0.032;  

  oscillator.connect(gainNode);  
  harmonyOscillator.connect(harmonyGainNode);  
  gainNode.connect(audioCtx.destination);  
  harmonyGainNode.connect(audioCtx.destination);  

  oscillator.start();  
  harmonyOscillator.start();  
}  

if (melodyTimer) {  
  clearTimeout(melodyTimer);  
}  

if (gainNode && audioCtx) {  
  gainNode.gain.setValueAtTime(0.09, audioCtx.currentTime);  
}  
if (harmonyGainNode && audioCtx) {  
  harmonyGainNode.gain.setValueAtTime(0.032, audioCtx.currentTime);  
}  

musicOn = true;  
noteIndex = 0;  
playNextNote();  

musicToggle.textContent = "Mute Music";  
musicToggle.classList.remove("off");

}

function stopMusic() {
musicOn = false;
if (melodyTimer) {
clearTimeout(melodyTimer);
melodyTimer = null;
}
if (gainNode && audioCtx) {
gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
}
if (harmonyGainNode && audioCtx) {
harmonyGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
}
musicToggle.textContent = "Play Music";
musicToggle.classList.add("off");
}

musicToggle.addEventListener("click", async () => {
if (!musicOn) {
if (!audioCtx) {
startMusic();
} else {
await audioCtx.resume();
gainNode.gain.setValueAtTime(0.09, audioCtx.currentTime);
if (harmonyGainNode) {
harmonyGainNode.gain.setValueAtTime(0.032, audioCtx.currentTime);
}
startMusic();
}
} else {
stopMusic();
}
});
}

tellBtn.addEventListener("click", () => {
launchConfetti(70);
setTimeout(() => {
showScreen(surpriseScreen);
typeWriter(birthdayMessage);
}, 420);
});

laterBtn.addEventListener("mouseenter", moveLaterButton);
laterBtn.addEventListener("pointerdown", (event) => {
event.preventDefault();
moveLaterButton();
});
laterBtn.addEventListener("click", (event) => {
event.preventDefault();
moveLaterButton();
});

nextBtn.addEventListener("click", () => {
showScreen(finalScreen);
});

window.addEventListener("resize", getEmitterOriginInParticlesLayer);
getEmitterOriginInParticlesLayer();

initMusic();