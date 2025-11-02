/* script.js - Undangan Jawa Elegan (Vercel Ready) */

// ELEMENTS
const openBtn = document.getElementById('openBtn');
const landing = document.getElementById('landing');
const app = document.getElementById('app');
const bgMusic = document.getElementById('bgMusic');
const toggleMusic = document.getElementById('toggleMusic');
const confettiLanding = document.getElementById('confettiLanding');
const confettiMain = document.getElementById('confettiMain');

// NAMA TAMU (dari URL)
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("to");
  const guestEl = document.getElementById("guestName");
  if (guest && guestEl) {
    guestEl.textContent = `Kepada Yth. ${decodeURIComponent(guest)}`;
  } else if (guestEl) {
    guestEl.style.display = "none";
  }
});

// CONFETTI (efek kelopak)
function makeConfetti(canvas, petalCount = 60) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const petals = [];
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 2 + 1,
      color: `rgba(184,134,59,${0.3 * Math.random() + 0.2})`,
      tilt: Math.random() * 10
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of petals) {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, p.tilt * Math.PI / 180, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.d;
      p.x += Math.sin(p.y * 0.01) * 1.2;
      p.tilt += 0.01;
      if (p.y > canvas.height + 10) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}
makeConfetti(confettiLanding, 90);
makeConfetti(confettiMain, 40);

// OPEN INVITATION
openBtn.addEventListener('click', () => {
  landing.style.transition = 'opacity .8s ease';
  landing.style.opacity = '0';
  setTimeout(() => {
    landing.style.display = 'none';
    app.classList.remove('hidden');
    window.scrollTo(0, 0);
  }, 850);
  bgMusic.play().then(() => {
    toggleMusic.textContent = '⏸';
  }).catch(() => {
    toggleMusic.textContent = '▶';
  });
});

// MUSIC TOGGLE
if (toggleMusic) {
  toggleMusic.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => toggleMusic.textContent = '⏸');
    } else {
      bgMusic.pause();
      toggleMusic.textContent = '▶';
    }
  });
}

// NAVIGATION
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.getAttribute('data-target');
    document.querySelectorAll('.page').forEach(p => p.style.display = (p.id === target ? 'block' : 'none'));
    document.querySelector('#contentLeft').scrollTop = 0;
    if (target === 'mempelai') animateMempelai();
  });
});
document.querySelectorAll('.page').forEach(p => p.style.display = (p.id === 'home' ? 'block' : 'none'));

// SLIDE MEMPELAI
function animateMempelai() {
  const left = document.getElementById('mempelai-wanita');
  const right = document.getElementById('mempelai-pria');
  if (!left || !right) return;
  left.classList.remove('slide-in-left');
  right.classList.remove('slide-in-right');
  setTimeout(() => {
    left.classList.add('slide-in-left');
    right.classList.add('slide-in-right');
  }, 50);
}

// GOOGLE CALENDAR
document.getElementById('saveCal').addEventListener('click', () => {
  const title = encodeURIComponent('Akad Pernikahan Yuni & Tofa');
  const details = encodeURIComponent('Akad pernikahan Yuni & Tofa');
  const location = encodeURIComponent('Gedung Dalail Khoirot, Jl. Raya Kebayoran Lama No.10B, Jakarta Selatan');
  const start = '20251207T090000';
  const end = '20251207T150000';
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`;
  window.open(url, '_blank');
});

// COUNTDOWN
function updateCountdown() {
  const target = new Date(2025, 11, 7, 9, 0, 0);
  const now = new Date();
  let diff = target - now;
  if (diff < 0) diff = 0;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  document.getElementById('cd-days').textContent = days;
  document.getElementById('cd-hours').textContent = hours;
  document.getElementById('cd-minutes').textContent = minutes;
  document.getElementById('cd-seconds').textContent = seconds;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ===================== UCAPAN & DOA (via Serverless API) =====================
async function loadComments() {
  const res = await fetch('/api/comments');
  const data = await res.json();
  const list = document.getElementById('commentsList');
  list.innerHTML = data.length
    ? data.map(c => `
      <div class="comment-item">
        <strong>${c.name}</strong>
        <p>${c.comment}</p>
      </div>`).join('')
    : '<p class="small-muted">Belum ada ucapan. Jadilah yang pertama!</p>';
}

document.getElementById('commentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value.trim();
  const comment = document.getElementById('commentInput').value.trim();
  if (!name || !comment) return;

  await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, comment })
  });

  e.target.reset();
  loadComments();
});

loadComments();
