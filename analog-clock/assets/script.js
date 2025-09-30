// Theme Handling
const themeToggle = document.getElementById('toggle-theme');
const themeIcon = document.getElementById('theme-icon');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const htmlEl = document.documentElement;

function setTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}
function toggleTheme() {
  const current = htmlEl.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
}
function loadTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) setTheme(saved);
  else setTheme(prefersDark ? 'dark' : 'light');
}
themeToggle.addEventListener('click', toggleTheme);
loadTheme();

// Animation Handling
const animations = ['fade-in', 'slide-in', 'zoom-in', 'flip-in', 'pop-in'];
const clockContainer = document.getElementById('clock-container');
function randomAnimation() {
  const used = sessionStorage.getItem('last-animation');
  let idx;
  do {
    idx = Math.floor(Math.random() * animations.length);
  } while (animations[idx] === used && animations.length > 1);
  sessionStorage.setItem('last-animation', animations[idx]);
  return animations[idx];
}
function setEntryAnimation() {
  clockContainer.classList.remove(...animations);
  clockContainer.classList.add(randomAnimation());
}
setEntryAnimation();

// 3D Clock Rendering
const canvas = document.getElementById('clock-canvas');
const ctx = canvas.getContext('2d');
const size = canvas.width;
const center = size / 2;
const radius = center - 18;

function draw3DClockFace(theme) {
  // 3D face with gradients and shadows
  ctx.save();

  // Shadow
  ctx.beginPath();
  ctx.arc(center, center + 10, radius, 0, 2 * Math.PI);
  ctx.shadowColor = theme === 'dark' ? '#000a' : '#5a8dee22';
  ctx.shadowBlur = 20;
  ctx.fillStyle = 'transparent';
  ctx.fill();

  ctx.restore();
  // Main face
  let grad = ctx.createRadialGradient(center, center, 15, center, center, radius);
  if (theme === 'dark') {
    grad.addColorStop(0, '#222e47');
    grad.addColorStop(0.7, '#2e3d54');
    grad.addColorStop(1, '#181f2e');
  } else {
    grad.addColorStop(0, '#e9effa');
    grad.addColorStop(0.65, '#e4e8ee');
    grad.addColorStop(1, '#b2c5e1');
  }
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.fillStyle = grad;
  ctx.fill();

  // Bezel highlight
  ctx.beginPath();
  ctx.arc(center, center, radius - 3, 0, 2 * Math.PI);
  ctx.strokeStyle = theme === 'dark' ? '#5a8dee88' : '#b6cfff99';
  ctx.lineWidth = 6;
  ctx.shadowBlur = 8;
  ctx.shadowColor = theme === 'dark' ? '#5a8dee44' : '#a4c2f933';
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';

  // Center shine
  let shine = ctx.createRadialGradient(center, center, 2, center, center, radius);
  shine.addColorStop(0, theme === 'dark' ? '#ffffff22' : '#ffffffcc');
  shine.addColorStop(0.9, 'transparent');
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.fillStyle = shine;
  ctx.fill();

  // Hour marks (extruded effect)
  for (let h = 0; h < 12; h++) {
    const angle = (h * Math.PI) / 6;
    const len = 22;
    const x1 = center + Math.cos(angle - Math.PI / 2) * (radius - len);
    const y1 = center + Math.sin(angle - Math.PI / 2) * (radius - len);
    const x2 = center + Math.cos(angle - Math.PI / 2) * (radius - 7);
    const y2 = center + Math.sin(angle - Math.PI / 2) * (radius - 7);

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = 6;
    ctx.strokeStyle = theme === 'dark' ? '#cfdfff' : '#34588e';
    ctx.shadowBlur = 4;
    ctx.shadowColor = theme === 'dark' ? '#7a92e8' : '#aac6fa';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
  // Minute marks
  for (let m = 0; m < 60; m++) {
    if (m % 5 === 0) continue;
    const angle = (m * Math.PI) / 30;
    const len = 10;
    const x1 = center + Math.cos(angle - Math.PI / 2) * (radius - len);
    const y1 = center + Math.sin(angle - Math.PI / 2) * (radius - len);
    const x2 = center + Math.cos(angle - Math.PI / 2) * (radius - 7);
    const y2 = center + Math.sin(angle - Math.PI / 2) * (radius - 7);

    ctx.save();
    ctx.lineWidth = 2.1;
    ctx.strokeStyle = theme === 'dark' ? '#89a2c6' : '#5676a1';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// 3D Hand rendering with shadow and rounded ends
function drawHand(angle, length, width, color, shadow, z = 0) {
  ctx.save();
  ctx.translate(center, center + z);
  ctx.rotate(angle);
  ctx.lineCap = 'round';
  ctx.shadowColor = shadow;
  ctx.shadowBlur = 6 + z * 2;
  ctx.beginPath();
  ctx.moveTo(0, 7);
  ctx.lineTo(0, -length);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.restore();
}

function drawCenterDot(theme) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, 10, 0, 2 * Math.PI);
  ctx.fillStyle = theme === 'dark' ? '#5a8dee' : '#4a5fc1';
  ctx.shadowBlur = 10;
  ctx.shadowColor = theme === 'dark' ? '#ffffff' : '#a4c2f9';
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, 4, 0, 2 * Math.PI);
  ctx.fillStyle = theme === 'dark' ? '#222e47' : '#fff';
  ctx.shadowBlur = 0;
  ctx.fill();
  ctx.restore();
}

function drawClock({ hours, minutes, seconds, ms }, theme) {
  ctx.clearRect(0, 0, size, size);
  draw3DClockFace(theme);

  // 3D hand "depth" for shadow
  // Hours hand
  let hourAngle =
    ((Math.PI * 2) / 12) * ((hours % 12) + minutes / 60 + seconds / 3600) -
    Math.PI / 2;
  drawHand(
    hourAngle,
    radius * 0.40,
    14,
    getComputedStyle(document.documentElement).getPropertyValue('--hand-hour').trim(),
    theme === 'dark' ? '#5a8dee77' : '#4a5fc133',
    6
  );

  // Minute hand
  let minAngle =
    ((Math.PI * 2) / 60) * (minutes + seconds / 60 + ms / 60000) - Math.PI / 2;
  drawHand(
    minAngle,
    radius * 0.64,
    8,
    getComputedStyle(document.documentElement).getPropertyValue('--hand-minute').trim(),
    theme === 'dark' ? '#8aa4ff99' : '#5a8dee55',
    3
  );

  // Second hand
  let secAngle =
    ((Math.PI * 2) / 60) * (seconds + ms / 1000) - Math.PI / 2;
  drawHand(
    secAngle,
    radius * 0.78,
    4,
    getComputedStyle(document.documentElement).getPropertyValue('--hand-second').trim(),
    theme === 'dark' ? '#ff867c99' : '#ee5a5a66',
    0
  );

  // Center 3D dot
  drawCenterDot(theme);
}

// Accessibility: update screenreader text
function updateScreenreaderTime({ hours, minutes, seconds }) {
  const sr = document.getElementById('screenreader-time');
  let h = hours % 12 || 12;
  let m = minutes.toString().padStart(2, '0');
  let s = seconds.toString().padStart(2, '0');
  let ampm = hours < 12 ? 'AM' : 'PM';
  sr.textContent = `Current time: ${h}:${m}:${s} ${ampm}`;
}

// Animate and render
function getTime() {
  const now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    ms: now.getMilliseconds()
  };
}
let lastTheme = htmlEl.getAttribute('data-theme');
function animateClock() {
  const t = getTime();
  const theme = htmlEl.getAttribute('data-theme');
  if (theme !== lastTheme) {
    // Redraw to update theme if changed
    lastTheme = theme;
  }
  drawClock(t, theme);
  updateScreenreaderTime(t);
  requestAnimationFrame(animateClock);
}
animateClock();

// Keyboard theme toggle
themeToggle.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleTheme();
  }
});

// Accessibility: focus ring for canvas container
clockContainer.addEventListener('focus', () => {
  clockContainer.style.boxShadow = '0 0 0 3px var(--accent)';
});
clockContainer.addEventListener('blur', () => {
  clockContainer.style.boxShadow = '';
});
