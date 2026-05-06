// =====================================================
// STUDY RINGKAS — script.js
// Kelompok 19 IPB 2026
// =====================================================

const API = 'http://localhost:3000/api';

// ===================== AUTH GUARD =====================
const srUser = JSON.parse(localStorage.getItem('sr_user') || 'null');

if (!srUser) {
  // Belum login → redirect ke login page
  window.location.href = 'login.html';
}

function logout() {
  if (confirm('Keluar dari StudyRingkas?')) {
    localStorage.removeItem('sr_user');
    window.location.href = 'login.html';
  }
}

function initUserUI() {
  if (!srUser) return;
  const nama  = srUser.nama || 'User';
  const nim   = srUser.nim  || '';
  const first = nama.split(' ')[0];
  // Initials (maks 2 huruf)
  const parts    = nama.split(' ');
  const initials = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();

  const navAvatar = document.getElementById('nav-avatar');
  const navName   = document.getElementById('nav-name');
  const navNim    = document.getElementById('nav-nim');
  const greeting  = document.getElementById('hero-greeting');

  if (navAvatar) navAvatar.textContent = initials;
  if (navName)   navName.textContent   = first + ' ' + (parts[1] ? parts[1][0]+'.' : '');
  if (navNim)    navNim.textContent    = nim;
  if (greeting)  greeting.textContent  = `Selamat datang, ${first}! 👋`;
}

// ---- DATA ----
const MATERI_DATA = [
  { id:1, icon:'🧮', title:'Turunan Fungsi Komposit', kat:'Kalkulus', desc:"Turunan fungsi komposit menggunakan chain rule. Jika f(g(x)), maka f'(g(x))·g'(x).", pct:75, color:'#3b82f6', fav:false },
  { id:2, icon:'💻', title:'OOP: Class & Object',       kat:'Pemrograman', desc:'Class adalah blueprint untuk membuat objek. Mendefinisikan atribut dan metode dalam satu kesatuan.', pct:55, color:'#22c55e', fav:false },
  { id:3, icon:'🗄️', title:'Normalisasi DB (1NF-3NF)', kat:'Database',    desc:'1NF: nilai atomik. 2NF: no partial dep. 3NF: no transitive dep. Mengurangi redundansi data.', pct:40, color:'#a855f7', fav:false },
  { id:4, icon:'📊', title:'Distribusi Normal',          kat:'Statistika',  desc:'Distribusi normal berbentuk lonceng simetris di sekitar nilai rata-rata μ dengan simpangan baku σ.', pct:30, color:'#f59e0b', fav:false },
  { id:5, icon:'🌐', title:'Model OSI 7 Layer',          kat:'Jaringan',    desc:'Model OSI membagi komunikasi jaringan menjadi 7 lapisan dari Physical hingga Application layer.', pct:60, color:'#06b6d4', fav:false },
  { id:6, icon:'⚙️', title:'Manajemen Proses',           kat:'Sis. Operasi',desc:'Manajemen proses: penjadwalan CPU, context switching, sinkronisasi, dan deadlock avoidance.', pct:45, color:'#ef4444', fav:false },
];

const SOAL_DATA = [
  {
    id:1, num:'001', kat:'Kalkulus', topic:'Turunan',
    question:'Tentukan turunan dari  f(x) = 3x³ − 2x² + 5x − 7',
    opts:['9x² − 4x + 5','9x² − 4x − 7','6x² − 4x + 5','3x² − 2x + 5'],
    answer:0,
    pembahasan:"Gunakan aturan d/dx(xⁿ) = nxⁿ⁻¹\nf'(x) = 3·3x² − 2·2x + 5·1 − 0\n      = 9x² − 4x + 5  ✓"
  },
  {
    id:2, num:'002', kat:'Kalkulus', topic:'Integral',
    question:'Hitung ∫(2x + 3) dx',
    opts:['x² + 3x + C','2x² + 3x + C','x² + 3 + C','2x + C'],
    answer:0,
    pembahasan:"∫(2x + 3) dx = ∫2x dx + ∫3 dx\n             = x² + 3x + C  ✓"
  },
  {
    id:3, num:'003', kat:'Kalkulus', topic:'Limit',
    question:'Nilai dari lim(x→2) (x² − 4) / (x − 2) adalah...',
    opts:['2','4','0','Tidak ada'],
    answer:1,
    pembahasan:"Faktorkan: (x²−4)/(x−2) = (x+2)(x−2)/(x−2) = x+2\nMaka lim(x→2) = 2+2 = 4  ✓"
  },
  {
    id:4, num:'004', kat:'Database', topic:'SQL',
    question:'Query SQL yang digunakan untuk mengambil data unik adalah...',
    opts:['SELECT DISTINCT','SELECT UNIQUE','SELECT ONLY','SELECT SINGLE'],
    answer:0,
    pembahasan:"SELECT DISTINCT digunakan untuk menghapus duplikasi pada hasil query.\nContoh: SELECT DISTINCT nama FROM mahasiswa;  ✓"
  },
  {
    id:5, num:'005', kat:'Pemrograman', topic:'OOP',
    question:'Konsep OOP yang memungkinkan class turunan mewarisi sifat class induk disebut...',
    opts:['Encapsulation','Polymorphism','Inheritance','Abstraction'],
    answer:2,
    pembahasan:"Inheritance (pewarisan) memungkinkan class anak mewarisi atribut dan metode dari class induk.\nContoh: class Kucing extends Hewan {}  ✓"
  },
];

// ---- STATE ----
let currentPage = 'beranda';
let currentSoalIdx = 0;
let selectedOpt = null;
let score = 0;
let answeredCount = 0;
let timerInterval = null;
let timerSec = 272;
let materiFilter = 'Semua';

// ===================== NAVIGATION =====================
function navigate(page) {
  // Update active page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.sb-item').forEach(s => s.classList.remove('active'));

  const el = document.getElementById('page-' + page);
  if (!el) return;
  el.classList.add('active');

  document.querySelectorAll(`[data-page="${page}"]`).forEach(el => el.classList.add('active'));
  currentPage = page;

  if (page === 'soal') initSoal();
  if (page === 'materi') renderMateri('Semua');
  if (page === 'setelan') checkStatus();
}

// Nav links
document.querySelectorAll('.nav-link, .sb-item').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.dataset.page;
    if (page) navigate(page);
  });
});

// ===================== MATERI =====================
function renderMateri(filter) {
  const grid = document.getElementById('materi-grid');
  const items = filter === 'Semua' ? MATERI_DATA : MATERI_DATA.filter(m => m.kat === filter);
  grid.innerHTML = items.map(m => `
    <div class="mat-card" data-kat="${m.kat}">
      <div class="mat-top-bar" style="background:${m.color}"></div>
      <div class="mat-body">
        <div class="mat-tag" style="background:${m.color}22;color:${m.color}">${m.kat}</div>
        <span class="mat-fav" onclick="toggleFav(${m.id},this)">${m.fav?'❤️':'🤍'}</span>
        <div class="mat-title">${m.icon} ${m.title}</div>
        <div class="mat-desc">${m.desc}</div>
        <div class="mat-footer">
          <div class="mat-prog-track">
            <div class="mat-prog-fill" style="width:${m.pct}%;background:${m.color}"></div>
          </div>
          <span class="mat-pct" style="color:${m.color}">${m.pct}%</span>
          <button class="mat-read" onclick="alert('Materi ${m.title} — Segera tersedia!')">Baca →</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterPill(btn, type, val) {
  if (type === 'materi') {
    document.querySelectorAll('#pills-materi .pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    materiFilter = val;
    renderMateri(val);
  }
}

function filterMateri() {
  const q = document.getElementById('search-materi').value.toLowerCase();
  const cards = document.querySelectorAll('.mat-card');
  cards.forEach(c => {
    const title = c.querySelector('.mat-title').textContent.toLowerCase();
    const kat   = c.dataset.kat.toLowerCase();
    c.style.display = (title.includes(q) || kat.includes(q)) ? '' : 'none';
  });
}

function toggleFav(id, el) {
  const m = MATERI_DATA.find(x => x.id === id);
  if (!m) return;
  m.fav = !m.fav;
  el.textContent = m.fav ? '❤️' : '🤍';
}

// ===================== BANK SOAL =====================
function initSoal() {
  currentSoalIdx = 0;
  selectedOpt = null;
  score = 0;
  answeredCount = 0;
  timerSec = 272;
  clearInterval(timerInterval);
  timerInterval = setInterval(tickTimer, 1000);
  renderSoal();
  updateScore();
}

function renderSoal() {
  const soal = SOAL_DATA[currentSoalIdx];
  const total = SOAL_DATA.length;
  const pct = Math.round(((currentSoalIdx) / total) * 100);

  document.getElementById('soal-current').textContent = currentSoalIdx + 1;
  document.getElementById('soal-fill').style.width = pct + '%';
  document.getElementById('soal-pct').textContent = pct + '%';
  document.getElementById('done-count').textContent = `${answeredCount} / ${total}`;

  document.getElementById('question-card').innerHTML = `
    <div class="q-num">Soal #${soal.num} · ${soal.kat} — ${soal.topic}</div>
    <div class="q-text">${soal.question}</div>
  `;

  document.getElementById('options-list').innerHTML = soal.opts.map((opt, i) => `
    <div class="opt" onclick="selectOpt(${i},this)">
      <div class="opt-radio"></div>
      <span class="opt-lbl">${String.fromCharCode(65+i)}.</span>
      <span class="opt-val">${opt}</span>
    </div>
  `).join('');

  document.getElementById('pembahasan-box').style.display = 'none';
  selectedOpt = null;
}

function selectOpt(idx, el) {
  document.querySelectorAll('.opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  selectedOpt = idx;
}

function cekJawaban() {
  if (selectedOpt === null) { alert('Pilih jawaban dulu!'); return; }
  const soal = SOAL_DATA[currentSoalIdx];
  const opts = document.querySelectorAll('.opt');
  opts.forEach((o, i) => {
    if (i === soal.answer) o.classList.add('correct');
    else if (i === selectedOpt && i !== soal.answer) o.classList.add('wrong');
    o.onclick = null;
  });
  if (selectedOpt === soal.answer) score++;
  answeredCount++;
  updateScore();
  showPembahasan();
}

function showPembahasan() {
  const soal = SOAL_DATA[currentSoalIdx];
  const box = document.getElementById('pembahasan-box');
  const isCorrect = selectedOpt === soal.answer;
  box.style.display = 'block';
  box.innerHTML = `
    <div class="pem-title">${isCorrect ? '✅ Jawaban Benar!' : '❌ Jawaban Salah'} — Pilihan ${String.fromCharCode(65+soal.answer)}</div>
    <div class="pem-text">${soal.pembahasan.replace(/\n/g,'<br>')}</div>
  `;
}

function togglePembahasan() {
  const box = document.getElementById('pembahasan-box');
  if (box.style.display === 'none') {
    const soal = SOAL_DATA[currentSoalIdx];
    box.style.display = 'block';
    box.innerHTML = `
      <div class="pem-title">📖 Pembahasan — Soal #${soal.num}</div>
      <div class="pem-text">${soal.pembahasan.replace(/\n/g,'<br>')}</div>
    `;
  } else {
    box.style.display = 'none';
  }
}

function nextSoal() {
  if (currentSoalIdx < SOAL_DATA.length - 1) {
    currentSoalIdx++;
    selectedOpt = null;
    renderSoal();
  } else {
    clearInterval(timerInterval);
    alert(`Sesi selesai! Skor: ${score}/${SOAL_DATA.length} (${Math.round(score/SOAL_DATA.length*100)}%)`);
  }
}

function updateScore() {
  document.getElementById('score-display').textContent = `${score} / ${answeredCount}`;
  document.getElementById('done-count').textContent = `${answeredCount} / ${SOAL_DATA.length}`;
}

function tickTimer() {
  if (timerSec <= 0) { clearInterval(timerInterval); return; }
  timerSec--;
  const m = String(Math.floor(timerSec / 60)).padStart(2,'0');
  const s = String(timerSec % 60).padStart(2,'0');
  const el = document.getElementById('timer');
  if (el) el.textContent = `${m}:${s}`;
}

// ===================== SETELAN =====================
function toggleDark() {
  const tog = document.getElementById('dark-toggle');
  tog.classList.toggle('on');
  // Could toggle actual theme
}

async function checkStatus() {
  // Check backend
  const apiEl = document.getElementById('api-status');
  const dbEl  = document.getElementById('db-status');
  const dbDot = document.getElementById('db-dot');
  try {
    const res = await fetch(`${API}/status`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    if (data.status === 'OK') {
      apiEl.textContent = 'Running ✓';
      apiEl.style.color = '#22c55e';
    }
    if (data.db === 'connected') {
      dbEl.textContent = 'Connected ✓';
      dbEl.style.color = '#22c55e';
      dbDot.classList.add('green-dot');
    } else {
      dbEl.textContent = 'Disconnected';
      dbEl.style.color = '#d94040';
    }
  } catch {
    apiEl.textContent = 'Offline';
    apiEl.style.color = '#d94040';
    dbEl.textContent = 'Offline';
    dbEl.style.color = '#d94040';
  }
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  initUserUI();
  renderMateri('Semua');
  initSoal();
  // Animate progress bar on load
  setTimeout(() => {
    document.querySelectorAll('.prog-fill').forEach(el => {
      el.style.transition = 'width 0.8s ease';
    });
  }, 100);
  console.log('[StudyRingkas] v2 loaded ✅ — Kelompok 19 IPB 2026');
});
