<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>DEJEDE | Buku Tamu</title>
    <!-- FAVICON -->
    <link rel="icon" href="./favicon/favicon.ico" sizes="any">
    <!-- (opsional tapi direkomendasikan) -->
    <link rel="icon" type="favicon/png" sizes="32x32" href="./favicon/favicon-32x32.png">
    <link rel="icon" type="favicon/png" sizes="16x16" href="./favicon/favicon-16x16.png">
    <link rel="dejede-icon" href="./favicon/favicon-32x32.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="tema.css">
    <meta name="theme-color" content="#3e5241">
    

</head>

<body data-theme="sage">

<div id="login-screen">
    <span class="blob b1"></span><span class="blob b2"></span>
    <div class="card login-card">
        <div class="login-logo"><img src="images/logo.png" alt="DEJEDE" onerror="this.src='https://via.placeholder.com/60'"></div>
        <h2>DEJEDE <span>BUKUTAMU</span></h2>
        <p class="login-sub">Buku tamu digital &amp; manajemen amplop untuk acara pernikahan, khitanan, dan tasyakuran.</p>

        <div class="login-feat">
            <span>📝 Input tamu cepat</span>
            <span>📊 Rekap &amp; grafik</span>
            <span>🖨 Cetak laporan A4</span>
            <span>💾 Backup JSON</span>
        </div>

        <div class="pass-wrap">
            <span class="pass-ico">🔒</span>
            <input type="password" id="pass-input" placeholder="Masukkan password" autocomplete="current-password" onkeyup="if(event.key === 'Enter') checkLogin()">
            <button type="button" class="pass-eye" onclick="togglePass()" aria-label="Tampilkan password">👁</button>
        </div>
        <button class="btn-main login-btn" onclick="checkLogin()">Masuk Sistem →</button>
        <p id="login-error" style="display:none;">⚠️ Password salah, coba lagi.</p>

        <div class="login-foot">Dejede Photography &amp; Videography<br>Data tersimpan aman di perangkat Anda</div>
    </div>
</div>

<div class="sticky-header">
    <header class="topbar">
        <div class="logo-wrapper">
            <img src="images/logo.png" class="main-logo" onerror="this.src='https://via.placeholder.com/40'">
            <div class="logo">DEJEDE GUESSBOOK <span>Buku Tamu & Manajemen Amplop</span></div>
        </div>
        <div id="digital-clock">
            <div id="clock-time">00:00:00</div>
            <div id="clock-date">SENIN - 01:01:2026</div>
        </div>
        <div class="top-actions">
	<button class="btn-main devhub-btn"
			onclick="window.open('https://wa.me/6285236578999','_blank')">
			<img src="images/wa-icon.svg" class="devhub-icon">
		Chat Center
	</button>
</div>
    </header>

    <div class="marquee-container">
        <div class="marquee-content" id="running-text-1">
            <span id="kalimat-ucapan">Memuat info acara...</span>
        </div>
    </div>

    <div class="marquee-container brand-marquee">
        <div class="marquee-content" style="animation-duration:45s;">
            <span>
                🏝️ <b>Abadikan Setiap Detik Berharga Bersama DEJEDE</b> - <i>"Karena Momen Takkan Terulang, Biarkan Kami Menjaganya Dalam Karya Visual Terbaik."</i> 📸 Spesialis Dokumentasi Profesional & Editing High-Res. 
	<a href="https://wa.me/6285236578999" target="_blank" class="wa-link">
    <img src="images/wa-icon.svg" class="wa-icon">
    Reservasi WhatsApp ke Admin: <b>6285236578999</b> klik saja nomornya
</a>
            </span>
        </div>
    </div>

    <section class="dashboard">
        <div class="stat-box"><span>Tamu</span><strong id="stat-tamu">0</strong></div>
        <div class="stat-box"><span>Total</span><strong id="stat-uang">Rp 0</strong></div>
        <div class="stat-box"><span>Rata-rata</span><strong id="stat-avg">Rp 0</strong></div>
        <div class="stat-box"><span>Terakhir</span><strong id="stat-last">-</strong></div>
    </section>
</div>

<main class="layout">
    <aside class="sidepanel">
        <div class="card">
            <h3>Trend Pemasukan</h3>
            <canvas id="moneyChart"></canvas>
        </div>
        <div class="card">
            <h3>Top 5 Penyumbang</h3>
            <ul id="top-donors" style="list-style:none; font-size: 0.8rem; padding:0;"></ul>
        </div>
        <div class="card">
            <h3>Konfigurasi Acara</h3>
            <form id="event-form">
                <div class="field">
                    <label for="mempelai" id="lbl-mempelai" title="Nama mempelai / anak yang punya hajat"><span id="lbl-mempelai-txt">Nama Mempelai</span> <span class="req">*</span></label>
                    <input id="mempelai" placeholder="Contoh: Andi &amp; Sinta" required>
                    <div class="hint" id="hint-mempelai">⚠ Belum diisi — ketik nama mempelai</div>
                </div>
                <div class="field">
                    <label for="hajat" title="Nama bapak/ibu tuan rumah">Nama Tuan Rumah <span class="req">*</span></label>
                    <input id="hajat" placeholder="Contoh: Bpk. Slamet" required>
                    <div class="hint">⚠ Belum diisi — ketik nama tuan rumah</div>
                </div>
                <div class="field">
                    <label for="alamat-acara" title="Tempat acara berlangsung">Lokasi Acara <span class="req">*</span></label>
                    <input id="alamat-acara" placeholder="Contoh: Desa Purorejo" required>
                    <div class="hint">⚠ Belum diisi — ketik lokasi acara</div>
                </div>
                <div class="field-row">
                    <div class="field">
                        <label for="acara-select" title="Pilih jenis acara">Jenis Acara</label>
                        <select id="acara-select">
                            <option value="Pernikahan">Pernikahan</option>
                            <option value="Khitanan">Khitanan</option>
                            <option value="Tasyakuran">Tasyakuran</option>
                        </select>
                    </div>
                    <div class="field">
                        <label for="target-undangan" title="Jumlah tamu yang diundang (angka)">Jumlah Undangan <span class="req">*</span></label>
                        <input id="target-undangan" type="number" inputmode="numeric" min="1" placeholder="Isi angka, mis. 500" required>
                        <div class="hint">⚠ Wajib diisi angka jumlah undangan</div>
                    </div>
                </div>
                <button class="btn-main" type="button" onclick="toast('✅ Data tersimpan otomatis')">Data Auto-Save</button>
            </form>
        </div>
    </aside>

    <section class="content">
        <div class="card">
            <div style="display:flex; justify-content:space-between; font-size: 0.75rem;">
                <span>Progress Kehadiran</span>
                <span id="progress-text">0/500 Tamu</span>
            </div>
            <div class="progress-bar"><div id="progress-fill" style="width: 0%;"></div></div>
        </div>

        <div id="list-tamu-container">
            <div class="tabs">
                <button class="tab-btn btn-semua active" onclick="switchTab('semua')">Semua</button>
                <button class="tab-btn btn-pria" onclick="switchTab('Pria')">Pria</button>
                <button class="tab-btn btn-wanita" onclick="switchTab('Wanita')">Wanita</button>
            </div>

            <div class="card" style="border-top: none; border-top-left-radius: 0; margin-top: -1px;">
                <input id="searchBox" placeholder="🔍 Cari nama atau alamat..." style="margin-bottom: 15px;">
                <div class="table-container">
                    <table id="guest-table">
                        <thead>
                            <tr>
                                <th style="width:30px;text-align:center;">No</th>
                                <th class="sortable" data-key="nama" onclick="setSort('nama')" title="Urutkan nama A-Z / Z-A">Nama <span class="sort-ico"></span></th>
                                <th class="sortable" data-key="alamat" onclick="setSort('alamat')" title="Urutkan alamat A-Z / Z-A">Alamat <span class="sort-ico"></span></th>
                                <th style="width:50px;">Gdr</th> 
                                <th class="sortable" data-key="jumlah" style="width:100px;" onclick="setSort('jumlah')" title="Urutkan jumlah kecil-besar / besar-kecil">Jumlah <span class="sort-ico"></span></th>
                                <th>Ket</th>
                                <th class="col-aksi" style="text-align:center;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="guest-tbody"></tbody>
                    </table>
                </div>
                <div id="pagination" style="text-align:center;margin-top:12px; display: flex; justify-content: center; gap: 10px; align-items: center;">
                    <button onclick="prevPage()" class="btn-page">‹ Prev</button>
                    <span id="page-info" style="font-size: 0.8rem;">Page 1</span>
                    <button onclick="nextPage()" class="btn-page">Next ›</button>
                </div>
            </div>
        </div>
    </section>
</main>

<nav class="floating-nav">
    <button class="nav-item active" onclick="goHome()"><i>🏠</i><span>Home</span></button>
    <button class="nav-item" onclick="openAddModal()"><i>➕</i><span>Tambah</span></button>
    <button class="nav-item" onclick="openBackupMenu()"><i>💾</i><span>Sistem</span></button>
    <button class="nav-item" onclick="openThemePicker()"><i>🎨</i><span>Tema</span></button>
    <button class="nav-item" onclick="previewTable()"><i>📊</i><span>Cetak</span></button>
	
</nav>

<div id="addModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index:3000; padding:20px; align-items:center; justify-content:center;">
    <div class="card" style="width:100%; max-width:400px; margin-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h3 style="margin-bottom:0; color: var(--primary);">📝 Input Tamu</h3>
            <button type="button" onclick="closeAddModal()" style="background:none; border:none; color:var(--danger); font-size:1.5rem;">&times;</button>
        </div>
        <form id="guest-form">
            <input id="tamu-nama" placeholder="Nama Lengkap" required style="margin-bottom:10px;">
<div class="field ac-wrap" style="margin-bottom:10px;">
                <input id="tamu-alamat" placeholder="Alamat / Desa (ketik huruf awal, mis. P)" required autocomplete="off" autocapitalize="words">
                <ul id="ac-list" class="ac-list"></ul>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <select id="tamu-gender"><option value="Pria">Pria</option><option value="Wanita">Wanita</option></select>
                <div class="ac-wrap">
                    <input id="tamu-jumlah" type="number" inputmode="numeric" placeholder="Nominal Rp" required autocomplete="off">
                    <ul id="nom-list" class="ac-list"></ul>
                </div>
            </div>
            <input id="tamu-keterangan" placeholder="Keterangan (opsional)" style="margin-bottom:20px;">
            <button class="btn-main" type="submit" style="height: 50px;">💾 Simpan Data</button>
        </form>
    </div>
</div>

<div id="themeModal" onclick="if(event.target===this)closeThemePicker()" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index:3500; padding:20px; align-items:center; justify-content:center;">
    <div class="card" style="width:100%; max-width:520px; margin-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 style="margin-bottom:0; color: var(--primary);">🎨 Pilih Tema</h3>
            <button type="button" onclick="closeThemePicker()" style="background:none; border:none; color:var(--danger); font-size:1.5rem; cursor:pointer;">&times;</button>
        </div>
        <div id="theme-grid" class="theme-grid"></div>
    </div>
</div>
<div id="sysModal" onclick="if(event.target===this)closeSysMenu()" class="overlay" style="z-index:3600;">
    <div class="card" style="width:100%; max-width:380px; margin-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 style="margin-bottom:0; color: var(--primary);">⚙️ Sistem DEJEDE</h3>
            <button type="button" onclick="closeSysMenu()" style="background:none; border:none; color:var(--danger); font-size:1.5rem; cursor:pointer;">&times;</button>
        </div>
        <div class="sys-list">
            <button type="button" class="sys-item" onclick="sysAction(1)"><i>⬇️</i><span><b>Download JSON</b><small>Simpan cadangan data tamu</small></span></button>
            <button type="button" class="sys-item" onclick="sysAction(2)"><i>⬆️</i><span><b>Restore JSON</b><small>Pulihkan data dari file cadangan</small></span></button>
            <button type="button" class="sys-item" onclick="sysAction(5)"><i>🖥️</i><span><b>Tampilan Monitor</b><small>Layar display untuk TV / proyektor</small></span></button>
            <button type="button" class="sys-item danger" onclick="sysAction(3)"><i>🗑️</i><span><b>Hapus Semua</b><small>Hapus seluruh data permanen</small></span></button>
            <button type="button" class="sys-item" onclick="sysAction(4)"><i>🚪</i><span><b>Logout</b><small>Keluar dari sistem</small></span></button>
        </div>
    </div>
</div>
<div id="confirmModal" class="overlay" style="z-index:3700;">
    <div class="card" style="width:100%; max-width:320px; margin-bottom:0; text-align:center;">
        <div style="font-size:2rem; margin-bottom:6px;">⚠️</div>
        <p id="confirm-msg" style="font-size:.9rem; margin-bottom:16px;"></p>
        <div style="display:flex; gap:10px;">
            <button type="button" class="btn-ghost" onclick="closeConfirm()">Batal</button>
            <button type="button" class="btn-main btn-yes" id="confirm-yes">Ya</button>
        </div>
    </div>
</div>
<div id="toast"></div>

<script src="desa.js"></script>
<script src="sholat.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
const SECRET_PASS = "dejede"; 

// 1. AUTHENTICATION
function checkLogin() {
    const input = document.getElementById('pass-input');
    const errorMsg = document.getElementById('login-error');
    const loginCard = document.querySelector('#login-screen .card');

    if (input.value === SECRET_PASS) {

        sessionStorage.setItem('dejede_auth', 'true');
        document.getElementById('login-screen').style.display = 'none';

        // tampilkan tutorial setelah login
        showTutorialOnce();

    } else {

        errorMsg.style.display = 'block';

        loginCard.style.animation = 'none';
        setTimeout(() => {
            loginCard.style.animation = 'shake 0.4s';
        }, 10);

        input.value = '';
        input.focus();
    }
}

// Tambahkan listener untuk menghilangkan pesan error saat mengetik
document.getElementById('pass-input').addEventListener('input', function() {
    document.getElementById('login-error').style.display = 'none';
});

function togglePass() {
    const i = document.getElementById('pass-input');
    i.type = i.type === 'password' ? 'text' : 'password';
}
function logoutSystem() { confirmBox('Logout dari sistem?', doLogout); }
function doLogout() {
    {

        sessionStorage.removeItem('dejede_auth');

        // reset tutorial supaya muncul lagi saat login
        localStorage.removeItem('dejedeTutorialShown');

        location.reload();
    }
}

// 2. CLOCK
function startClock() {
    const days = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];

    setInterval(() => {
        const now = new Date();

        // Jam digital
        document.getElementById('clock-time').innerText =
            now.toLocaleTimeString('id-ID', { hour12: false });

        // Tanggal dengan nama bulan
        document.getElementById('clock-date').innerText =
            `${days[now.getDay()]} - ` +
            now.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

    }, 1000);
}

// 3. CORE DATA
let eventData = JSON.parse(localStorage.getItem('dejedeEvent')) || { acara: 'Pernikahan', mempelai: '', hajat: '', alamat: '' };
let guestsData = JSON.parse(localStorage.getItem('dejedeGuests')) || [];
let targetUndangan = parseInt(localStorage.getItem('dejedeTarget')) || 500;
let currentTab = 'semua';
let currentPage = 1;
let rowsPerPage = 50;
let myChart;
let editingGuestId = null;

// 4. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('dejede_auth') === 'true') {
        document.getElementById('login-screen').style.display = 'none';
    }
    
    // Theme
    initTheme();
    initAutocomplete();
    initNominal();
    
    startClock();
    loadEventInfo();
    renderAll();
    initAutoUpdate();
    
    document.getElementById('searchBox').oninput = () => { currentPage = 1; renderTable(); };
});

function loadEventInfo() {
    document.getElementById('mempelai').value = eventData.mempelai;
    updateLabelAcara();
    document.getElementById('hajat').value = eventData.hajat;
    document.getElementById('alamat-acara').value = eventData.alamat;
    document.getElementById('target-undangan').value = targetUndangan || '';
    document.getElementById('acara-select').value = eventData.acara;
    
    // Kalimat yang lebih panjang, sopan, dan profesional
    const teksUtama = `✨ Selamat Datang di Kediaman Bapak/Ibu <b>${eventData.hajat || '...'}</b> dalam Rangka Syukuran ${eventData.acara} Ananda <b>${eventData.mempelai || '...'}</b> yang Berlokasi di ${eventData.alamat || '...'} ✨`;
    
    const teksDoa = ` 🙏 Doa Restu Anda Adalah Karunia Terindah Bagi Kami. Semoga Langkah Kaki Bapak/Ibu Menjadi Berkah Bagi Keluarga Besar Kami. Terima Kasih Atas Kehadirannya. 🙏`;

    const teksBrand = ` 📸 Dokumentasi Eksklusif oleh <b>Dejede Photography & Videography</b> - <i>"Capturing Every Precious Moments"</i> 📸 `;

    // Gabungkan semua kalimat agar running text-nya panjang dan tidak kosong
    const gabunganTeks = `${teksUtama} &nbsp;&nbsp; | &nbsp;&nbsp; ${teksDoa} &nbsp;&nbsp; | &nbsp;&nbsp; ${teksBrand} &nbsp;&nbsp; • &nbsp;&nbsp; `;

    document.getElementById('running-text-1').innerHTML = `<span>${gabunganTeks}</span><span>${gabunganTeks}</span>`;
}

function initAutoUpdate() {
    ['mempelai', 'hajat', 'alamat-acara', 'acara-select', 'target-undangan'].forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => {
            if(id === 'target-undangan') {
                targetUndangan = parseInt(e.target.value) || 0;
                localStorage.setItem('dejedeTarget', targetUndangan);
            } else {
                const key = id === 'acara-select' ? 'acara' : id.replace('-acara', '');
                eventData[key] = e.target.value;
                localStorage.setItem('dejedeEvent', JSON.stringify(eventData));
            }
            loadEventInfo();
            updateProgress();
        });
    });
}

// 5. RENDER LOGIC
function renderAll() {
    renderTable();
    updateStats();
    updateChart();
    updateRanking();
    updateProgress();
}

// Tandai bagian yang cocok dengan blok warna (utamakan awal kata)
function hl(text, q) {
    const t = String(text ?? ''), e = x => x.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    if (!q) return e(t);
    const low = t.toLowerCase();
    let p = low.indexOf(q);
    if (p < 0) return e(t);
    for (let i = p; i >= 0; i = low.indexOf(q, i + 1)) { if (i === 0 || /\s/.test(low[i - 1])) { p = i; break; } }
    return e(t.slice(0, p)) + '<mark class="hl">' + e(t.slice(p, p + q.length)) + '</mark>' + e(t.slice(p + q.length));
}

let sortKey = null, sortDir = 'asc';
function applySort(arr) {
    if (!sortKey) return arr;
    const d = sortDir === 'asc' ? 1 : -1;
    return [...arr].sort((a, b) => sortKey === 'jumlah'
        ? (a.jumlah - b.jumlah) * d
        : String(a[sortKey] || '').localeCompare(String(b[sortKey] || ''), 'id', { sensitivity: 'base' }) * d);
}
function sortLabel() {
    if (!sortKey) return '';
    const k = { nama: 'Nama', alamat: 'Alamat', jumlah: 'Jumlah' }[sortKey];
    const o = sortKey === 'jumlah' ? (sortDir === 'asc' ? 'Kecil-Besar' : 'Besar-Kecil') : (sortDir === 'asc' ? 'A-Z' : 'Z-A');
    return `${k} (${o})`;
}
function setSort(key) {
    if (sortKey !== key) { sortKey = key; sortDir = 'asc'; }
    else if (sortDir === 'asc') sortDir = 'desc';
    else sortKey = null;
    currentPage = 1;
    renderTable();
}
function updateSortHeader() {
    document.querySelectorAll('#guest-table th.sortable').forEach(th => {
        const on = th.dataset.key === sortKey, ico = th.querySelector('.sort-ico');
        th.classList.toggle('sorted', on);
        if (!on) { ico.textContent = '⇅'; return; }
        ico.textContent = th.dataset.key === 'jumlah' ? (sortDir === 'asc' ? '▲ 1-9' : '▼ 9-1') : (sortDir === 'asc' ? '▲ A-Z' : '▼ Z-A');
    });
}

function renderTable() {
    const tbody = document.getElementById('guest-tbody');
    let filtered = currentTab === 'semua' ? guestsData : guestsData.filter(g => g.gender === currentTab);
    const search = document.getElementById('searchBox').value.trim().toLowerCase();
    
    if(search) {
        // Urutan hasil: 0 = nama diawali kata ketik, 1 = awal kata lain di nama, 2 = di tengah/belakang nama, 3 = alamat
        const rank = g => {
            const n = g.nama.toLowerCase();
            if (n.startsWith(search)) return 0;
            if (n.split(/\s+/).some(w => w.startsWith(search))) return 1;
            if (n.includes(search)) return 2;
            return g.alamat.toLowerCase().includes(search) ? 3 : 9;
        };
        filtered = filtered.map(g => ({ g, r: rank(g) })).filter(x => x.r < 9)
            .sort((a, b) => a.r - b.r || a.g.nama.localeCompare(b.g.nama, 'id')).map(x => x.g);
    }

    // Urut manual (klik judul kolom): klik 1 = naik, klik 2 = turun, klik 3 = kembali normal
    filtered = applySort(filtered);
    updateSortHeader();

    const start = (currentPage - 1) * rowsPerPage;
    const pageData = filtered.slice(start, start + rowsPerPage);
    
    tbody.innerHTML = pageData.map((g, i) => `
        <tr>
            <td align="center">${start + i + 1}</td>
            <td><strong>${hl(g.nama, search)}</strong></td>
            <td>${hl(g.alamat, search)}</td>
            <td align="center">${g.gender[0]}</td>
            <td style="color:#6BCB77;font-weight:bold;">${formatIDR(g.jumlah)}</td>
            <td><small>${g.keterangan || '-'}</small></td>
            <td class="col-aksi">
                <div class="aksi">
                    <button class="btn-edit" title="Edit" onclick="editGuest(${g.id})">✎</button>
                    <button class="btn-delete" title="Hapus" onclick="deleteGuest(${g.id})">✕</button>
                </div>
            </td>
        </tr>
    `).join('');
    
    document.getElementById("page-info").innerText = `Hal ${currentPage} / ${Math.ceil(filtered.length/rowsPerPage) || 1}`;
}

// 6. GUEST ACTIONS
document.getElementById('guest-form').onsubmit = (e) => {
    e.preventDefault();

    // 1. Ambil nilai dari Select (pilihan) dan Input Manual (kustom)
    const alamatFinal = titleCase(document.getElementById('tamu-alamat').value.trim());
    simpanDesaBaru(alamatFinal);

    const gData = {
        id: editingGuestId || Date.now(),
        nama: titleCase(document.getElementById('tamu-nama').value.trim()),
        alamat: alamatFinal, // <--- Ini poin pentingnya, pakai alamatFinal
        gender: document.getElementById('tamu-gender').value,
        jumlah: parseInt(document.getElementById('tamu-jumlah').value) || 0,
        keterangan: document.getElementById('tamu-keterangan').value
    };

    if(editingGuestId) {
        const idx = guestsData.findIndex(g => g.id === editingGuestId);
        guestsData[idx] = gData;
    } else {
        guestsData.push(gData);
    }

    localStorage.setItem('dejedeGuests', JSON.stringify(guestsData));
    
    // 3. Bersihkan form dan sembunyikan kotak kustom lagi
    editingGuestId = null;
    e.target.reset();
    document.getElementById('ac-list').classList.remove('open');
    
    closeAddModal();
    renderAll();
};

function deleteGuest(id) { confirmBox('Hapus data tamu ini?', () => doDeleteGuest(id)); }
function doDeleteGuest(id) {
    {
        guestsData = guestsData.filter(g => g.id !== id);
        localStorage.setItem('dejedeGuests', JSON.stringify(guestsData));
        renderAll();
    }
}

function editGuest(id) {
    const g = guestsData.find(g => g.id === id);
    if (!g) return;

    editingGuestId = id;
    
    // Masukkan data lama ke input
    document.getElementById('tamu-nama').value = g.nama;
    document.getElementById('tamu-alamat').value = g.alamat; // Tetap muncul meski alamat kustom
    document.getElementById('tamu-gender').value = g.gender;
    document.getElementById('tamu-jumlah').value = g.jumlah;
    document.getElementById('tamu-keterangan').value = g.keterangan || '';

    // Custom Tampilan Modal biar jelas kalau ini lagi EDIT
    document.querySelector('#addModal h3').innerText = "📝 Edit Data Tamu";
    document.querySelector('#guest-form .btn-main').innerText = "💾 UPDATE DATA";

    openAddModal();
}
// 7. UTILS
function formatIDR(n) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function updateStats() {
    const total = guestsData.reduce((s, g) => s + g.jumlah, 0);
    document.getElementById('stat-tamu').innerText = guestsData.length;
    document.getElementById('stat-uang').innerText = formatIDR(total);
    document.getElementById('stat-avg').innerText = formatIDR(total / (guestsData.length || 1));
    document.getElementById('stat-last').innerText = guestsData.length ? guestsData[guestsData.length-1].nama.split(' ')[0] : '-';
}

function updateProgress() {
    cekHintEvent();
    const p = targetUndangan > 0 ? Math.min((guestsData.length / targetUndangan) * 100, 100).toFixed(1) : '0.0';
    document.getElementById('progress-fill').style.width = p + '%';
    document.getElementById('progress-text').innerText = `${guestsData.length}/${targetUndangan} Tamu (${p}%)`;
}

function switchTab(t) {
    currentTab = t;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.innerText.includes(t) || (t==='semua' && b.innerText==='Semua')));
    currentPage = 1;
    renderTable();
}

// THEME, AUTOCOMPLETE, HINT, TOAST
const THEMES = [
    {id:'sage',n:'Sage Light',c:['#eef3ef','#f7faf7','#8ca98b']},
    {id:'sage-dark',n:'Sage Dark',c:['#121212','#1e1e1e','#8ca98b']},
    {id:'macos',n:'macOS Light',c:['#f2f2f7','#ffffff','#007aff']},
    {id:'macos-dark',n:'macOS Dark',c:['#000000','#1c1c1e','#0a84ff']},
    {id:'kde',n:'KDE Breeze',c:['#eff0f1','#fcfcfc','#3daee9']},
    {id:'kde-dark',n:'KDE Breeze Dark',c:['#1b1e20','#31363b','#3daee9']},
    {id:'win11',n:'Windows 11',c:['#f3f3f3','#fbfbfb','#0067c0']},
    {id:'ubuntu',n:'Ubuntu Aubergine',c:['#2b0a22','#3c1232','#e95420']},
    {id:'nord',n:'Nord',c:['#2e3440','#3b4252','#88c0d0']},
    {id:'dracula',n:'Dracula',c:['#282a36','#343746','#bd93f9']}
];
function themeColor() { return getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#8ca98b'; }
function applyTheme(id) {
    if (!THEMES.some(t => t.id === id)) id = 'sage';
    document.body.dataset.theme = id;
    localStorage.setItem('dejede-theme', id);
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = THEMES.find(t => t.id === id).c[2];
    document.querySelectorAll('.theme-opt').forEach(b => b.classList.toggle('active', b.dataset.id === id));
    if (myChart) updateChart();
}
function initTheme() {
    document.getElementById('theme-grid').innerHTML = THEMES.map(t => `
        <button type="button" class="theme-opt" data-id="${t.id}" onclick="applyTheme('${t.id}')">
            <span class="sw">${t.c.map(c => `<i style="background:${c}"></i>`).join('')}</span><b>${t.n}</b>
        </button>`).join('');
    applyTheme(localStorage.getItem('dejede-theme') || (localStorage.getItem('theme-pref') === 'dark' ? 'sage-dark' : 'sage'));
}
function openThemePicker() { document.getElementById('themeModal').style.display = 'flex'; }
function closeThemePicker() { document.getElementById('themeModal').style.display = 'none'; }

function toast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2200);
}

// Label "Mempelai" / "Anak" mengikuti jenis acara
function labelM() { return ({ Pernikahan: 'Mempelai', Khitanan: 'Anak', Tasyakuran: 'Yang Disyukuri' })[eventData.acara] || 'Mempelai'; }
function updateLabelAcara() {
    const l = labelM(), ph = { Mempelai: 'Contoh: Andi & Sinta', Anak: 'Contoh: Muhammad Arka', 'Yang Disyukuri': 'Contoh: Keluarga Besar Slamet' }[l];
    document.getElementById('lbl-mempelai-txt').innerText = 'Nama ' + l;
    document.getElementById('mempelai').placeholder = ph;
    document.getElementById('hint-mempelai').innerText = '⚠ Belum diisi — ketik nama ' + l.toLowerCase();
}

// Tandai field wajib yang belum diisi (teks / angka > 0)
function cekHintEvent() {
    document.querySelectorAll('#event-form .field').forEach(f => {
        const i = f.querySelector('input'); if (!i) return;
        const v = i.value.trim();
        const kosong = !v || (i.type === 'number' && !(parseFloat(v) > 0));
        f.classList.toggle('invalid', kosong);
    });
}

// AUTOCOMPLETE DESA (data dari desa.js + alamat baru yang pernah diketik)
let desaList = [];
function loadDesa() {
    let custom = [];
    try { custom = JSON.parse(localStorage.getItem('dejedeDesaCustom') || '[]'); } catch (e) {}
    desaList = [...new Set([...(window.DATA_DESA || []), ...custom])].sort((a, b) => a.localeCompare(b, 'id'));
}
function titleCase(s) { return s.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase()); }
function simpanDesaBaru(v) {
    if (!v || desaList.some(d => d.toLowerCase() === v.toLowerCase())) return;
    let custom = [];
    try { custom = JSON.parse(localStorage.getItem('dejedeDesaCustom') || '[]'); } catch (e) {}
    custom.push(v); localStorage.setItem('dejedeDesaCustom', JSON.stringify(custom)); loadDesa();
}
// SARAN NOMINAL OTOMATIS: ketik 50 -> Rp 50.000 & Rp 500.000
function initNominal() {
    const inp = document.getElementById('tamu-jumlah'), box = document.getElementById('nom-list');
    let idx = -1, items = [];
    const hide = () => { box.classList.remove('open'); idx = -1; };
    const pick = v => { inp.value = v; hide(); };
    const mark = () => [...box.children].forEach((li, i) => li.classList.toggle('active', i === idx));
    inp.addEventListener('input', () => {
        const v = parseInt(inp.value);
        items = (v > 0) ? [1000, 10000, 100000, 1000000].map(k => v * k).filter(n => n <= 100000000) : [];
        idx = -1;
        if (!items.length) { hide(); return; }
        box.innerHTML = items.map(n => `<li data-v="${n}">Rp ${n.toLocaleString('id-ID')}</li>`).join('');
        box.classList.add('open');
    });
    inp.addEventListener('blur', () => setTimeout(hide, 120));
    inp.addEventListener('keydown', e => {
        if (!box.classList.contains('open')) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); idx = (idx + 1) % items.length; mark(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); idx = (idx - 1 + items.length) % items.length; mark(); }
        else if (e.key === 'Enter' && idx >= 0) { e.preventDefault(); pick(items[idx]); }
        else if (e.key === 'Escape') hide();
    });
    box.addEventListener('mousedown', e => { const li = e.target.closest('li'); if (li) { e.preventDefault(); pick(li.dataset.v); } });
}

function initAutocomplete() {
    loadDesa();
    const inp = document.getElementById('tamu-alamat'), box = document.getElementById('ac-list');
    let idx = -1, items = [];
    const hide = () => { box.classList.remove('open'); idx = -1; };
    const pick = v => { inp.value = v; hide(); };
    const mark = () => [...box.children].forEach((li, i) => li.classList.toggle('active', i === idx));
    const show = () => {
        const q = inp.value.trim().toLowerCase();
        items = desaList.filter(d => d.toLowerCase().startsWith(q));
        idx = -1;
        if (!items.length) { hide(); return; }
        box.innerHTML = items.map(d => {
            return `<li data-v="${d}">${q ? '<mark>' + d.slice(0, q.length) + '</mark>' + d.slice(q.length) : d}</li>`;
        }).join('');
        box.classList.add('open');
    };
    const nm = document.getElementById('tamu-nama');
    nm.addEventListener('input', () => { const a = nm.selectionStart, b = nm.selectionEnd; nm.value = titleCase(nm.value); nm.setSelectionRange(a, b); });
    inp.addEventListener('input', () => { const a = inp.selectionStart, b = inp.selectionEnd; inp.value = titleCase(inp.value); inp.setSelectionRange(a, b); show(); });
    inp.addEventListener('focus', show);
    inp.addEventListener('blur', () => setTimeout(hide, 120));
    inp.addEventListener('keydown', e => {
        if (!box.classList.contains('open')) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); idx = (idx + 1) % items.length; mark(); box.children[idx].scrollIntoView({block:'nearest'}); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); idx = (idx - 1 + items.length) % items.length; mark(); box.children[idx].scrollIntoView({block:'nearest'}); }
        else if (e.key === 'Enter' && idx >= 0) { e.preventDefault(); pick(items[idx]); }
        else if (e.key === 'Escape') hide();
    });
    box.addEventListener('mousedown', e => { const li = e.target.closest('li'); if (li) { e.preventDefault(); pick(li.dataset.v); } });
}

function openAddModal() { document.getElementById('addModal').style.display = 'flex'; document.getElementById('tamu-nama').focus(); }
function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
    editingGuestId = null;
    
    // Kembalikan ke judul semula
    document.querySelector('#addModal h3').innerText = "📝 Input Tamu";
    document.querySelector('#guest-form .btn-main').innerText = "💾 Simpan Data";
}

function goHome(){

const target = document.getElementById("list-tamu-container");

if(!target) return;

/* tinggi header sticky */
const header = document.querySelector(".sticky-header");
const headerHeight = header ? header.offsetHeight : 0;

/* posisi elemen */
const y = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;

window.scrollTo({
top: y,
behavior: "smooth"
});

}

function filteredCount() {
    let f = currentTab === 'semua' ? guestsData : guestsData.filter(g => g.gender === currentTab);
    const q = document.getElementById('searchBox').value.toLowerCase();
    if (q) f = f.filter(g => g.nama.toLowerCase().includes(q) || g.alamat.toLowerCase().includes(q));
    return f.length;
}
function nextPage() { if(currentPage * rowsPerPage < filteredCount()) { currentPage++; renderTable(); } }
function prevPage() { if(currentPage > 1) { currentPage--; renderTable(); } }

// 8. BACKUP & SYSTEM
function openBackupMenu() { document.getElementById('sysModal').style.display = 'flex'; }
function closeSysMenu() { document.getElementById('sysModal').style.display = 'none'; }
function confirmBox(msg, onYes) {
    document.getElementById('confirm-msg').innerText = msg;
    document.getElementById('confirm-yes').onclick = () => { closeConfirm(); onYes(); };
    document.getElementById('confirmModal').style.display = 'flex';
}
function closeConfirm() { document.getElementById('confirmModal').style.display = 'none'; }
function sysAction(n) {
    if (n === 1) {
        const blob = new Blob([JSON.stringify({event:eventData, guests:guestsData, target:targetUndangan})], {type:'application/json'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `dejede_backup_${Date.now()}.json`; a.click();
        closeSysMenu(); toast('✅ Backup diunduh');
    } else if (n === 2) {
        const i = document.createElement('input'); i.type = 'file'; i.accept = '.json'; i.onchange = e => {
            const reader = new FileReader(); reader.onload = () => {
                try {
                    const d = JSON.parse(reader.result);
                    guestsData = d.guests; eventData = d.event; targetUndangan = d.target;
                    localStorage.setItem('dejedeGuests', JSON.stringify(guestsData));
                    localStorage.setItem('dejedeEvent', JSON.stringify(eventData));
                    localStorage.setItem('dejedeTarget', targetUndangan);
                    location.reload();
                } catch (err) { toast('⚠ File JSON tidak valid'); }
            }; reader.readAsText(e.target.files[0]);
        }; i.click();
    } else if (n === 3) {
        closeSysMenu();
        confirmBox('Hapus seluruh data permanen? Tindakan ini tidak bisa dibatalkan.', () => { localStorage.clear(); location.reload(); });
    } else if (n === 4) { closeSysMenu(); logoutSystem(); }
    else if (n === 5) { closeSysMenu(); window.open('display.html', 'dejede-display'); }
}

// 9. PREVIEW & PRINT
	function previewTable() {
	const loader = document.getElementById("loading-preview");
	if(loader) loader.style.display = "flex";
    let dataPreview = applySort(currentTab === 'semua' ? guestsData : guestsData.filter(g => g.gender === currentTab));
    
    // Hitung Rekap Global
    const totalUang = dataPreview.reduce((sum, g) => sum + g.jumlah, 0);
    const jmlPria = dataPreview.filter(g => g.gender === 'Pria').length;
    const jmlWanita = dataPreview.filter(g => g.gender === 'Wanita').length;
    
    const perPage = 40;
    const totalPages = Math.ceil(dataPreview.length / perPage);
    let pagesHTML = "";

    // 1. GENERATE HALAMAN DATA TAMU (Sesuai kode stabil sebelumnya)
    for (let p = 0; p < totalPages; p++) {
        let start = p * perPage;
        let end = start + perPage;
        let pageData = dataPreview.slice(start, end);
        let rows = "";
        let subtotal = 0;

        pageData.forEach((g, i) => {
            subtotal += g.jumlah;
            rows += `
            <tr>
                <td align="center">${start + i + 1}</td>
                <td>${g.nama}</td>
                <td>${g.alamat}</td>
                <td align="center">${g.gender}</td>
                <td align="right">${formatIDR(g.jumlah)}</td>
                <td>${g.keterangan || "-"}</td>
            </tr>`;
        });

       pagesHTML += `
<div class="page">
        <div class="header">

        <div class="header-row">

            <img src="images/logo.png" class="logo" width="36" style="width:36px;height:auto;max-width:36px"
            onerror="this.src='https://via.placeholder.com/50'">

            <div class="header-text">
                <div class="title">DEJEDE - BUKU TAMU</div>
                <div class="subtitle">
                    Dejede | Photography & Videography | 085236578999
                </div>
            </div>

        </div>

    </div>

    <div class="event">
        <div><b>Acara</b> : ${eventData.acara}</div>
        <div><b>Tuan Rumah</b> : ${eventData.hajat}</div>
        <div><b>${labelM()}</b> : ${eventData.mempelai}</div>
        <div><b>Lokasi</b> : ${eventData.alamat}</div>
        ${sortLabel() ? `<div><b>Urutan</b> : ${sortLabel()}</div>` : ''}
    </div>

    <table class="tbl-data">
        <thead>
            <tr>
                        <th width="40">No</th>
                        <th>Nama</th>
                        <th>Alamat</th>
                        <th width="80">Gender</th>
                        <th width="120">Jumlah</th>
                        <th>Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                    <tr class="total">
                        <td colspan="4" align="right">SUBTOTAL HALAMAN ${p + 1}</td>
                        <td colspan="2" align="right">${formatIDR(subtotal)}</td>
                    </tr>
                </tbody>
            </table>
			<div class="signature">
				<div>Mengetahui,<br>Tuan Rumah<br><br><br><b>${eventData.hajat}</b></div>
				<div class="page-number">Halaman ${p + 1} / ${totalPages}</div>
			</div>
        </div>`;
    }

    // 2. HALAMAN KHUSUS REKAPITULASI DENGAN KETERANGAN TAMBAHAN
    pagesHTML += `
    <div class="page">
<div class="header">

    <div class="header-row">

        <img src="images/logo.png" class="logo" width="36" style="width:36px;height:auto;max-width:36px"
        onerror="this.src='https://via.placeholder.com/50'">

        <div class="header-text">
            <div class="title">DEJEDE - REKAPITULASI AKHIR</div>
            <div class="subtitle">Laporan Ringkasan Keseluruhan</div>
        </div>

    </div>

</div>
        
        <h3 style="text-align:center; margin: 30px 0 10px 0;">RINGKASAN DATA</h3>
        
        <table style="width: 90%; margin: 10px auto; font-size: 14px;">
            <tr>
                <th style="text-align: left; padding: 12px;">Kategori</th>
                <th style="padding: 12px;">Keterangan</th>
            </tr>
            <tr>
                <td style="padding: 12px;">Total Tamu Pria</td>
                <td align="center" style="padding: 12px;">${jmlPria} Orang</td>
            </tr>
            <tr>
                <td style="padding: 12px;">Total Tamu Wanita</td>
                <td align="center" style="padding: 12px;">${jmlWanita} Orang</td>
            </tr>
            <tr class="total">
                <td style="padding: 15px; font-size: 15px;">TOTAL TAMU KESELURUHAN</td>
                <td align="center" style="padding: 15px; font-size: 15px;">${dataPreview.length} Orang</td>
            </tr>
            <tr class="total">
                <td style="padding: 15px; font-size: 16px;">TOTAL NOMINAL DITERIMA</td>
                <td align="right" style="padding: 15px; font-size: 16px;">${formatIDR(totalUang)}</td>
            </tr>
        </table>

        <div style="margin: 30px auto; width: 90%; font-size: 13px; line-height: 1.6; color: #333; font-style: italic; border-left: 4px solid #444; padding-left: 15px;">
            <b>Catatan Rekapitulasi:</b><br>
            Laporan ini merupakan ringkasan resmi dari acara <b>${eventData.acara}</b> (${labelM()}: ${eventData.mempelai}) dengan tuan rumah Bapak/Ibu <b>${eventData.hajat}</b>. 
            Terima kasih telah mempercayakan pengelolaan data tamu Anda kepada <b>Aplikasi DEJEDE</b>. Besar harapan kami, laporan ini dapat membantu memberikan transparansi data serta mempermudah Anda dalam proses rekapitulasi akhir acara secara akurat dan profesional.
        </div>

        <div class="signature" style="margin-top: 50px;">
            <div>
                Dicetak otomatis pada:<br>
                ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style="text-align: center;">
                Mengetahui,<br>Tuan Rumah<br><br><br><br>
                <b>${eventData.hajat}</b>
            </div>
        </div>
        
        <div style="position: absolute; bottom: 20mm; width: 88%; text-align: center; font-size: 10px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
            Dejede | Photography & Videography - Dokumentasi Terbaik Untuk Momen Berharga Anda
        </div>

        <div class="page-number" style="position: absolute; bottom: 12mm; right: 12mm;">
            Halaman ${totalPages + 1} / ${totalPages + 1}
        </div>
    </div>`;

setTimeout(()=>{

const win = window.open("", "_blank");

win.document.write(`
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Laporan Akhir DEJEDE</title>
<style>
/* gaya kritis: aktif sebelum table.css selesai dimuat (mencegah logo besar saat load) */
body{margin:0;font-family:Arial,Helvetica,sans-serif;background:#ddd}
img{max-width:100%}
.logo{width:36px;height:auto;max-width:36px}
.action-bar{position:fixed;top:0;left:0;right:0;display:flex;justify-content:center;gap:10px;padding:8px 10px;background:rgba(40,44,52,.9)}
/* proporsi kolom tabel data di tampilan mobile (cetak PDF tidak terpengaruh) */
@media screen and (max-width:768px){
.page table.tbl-data{table-layout:fixed;width:100%}
.page table.tbl-data th:nth-child(1){width:5%}
.page table.tbl-data th:nth-child(2){width:25%}
.page table.tbl-data th:nth-child(3){width:20%}
.page table.tbl-data th:nth-child(4){width:10%}
.page table.tbl-data th:nth-child(5){width:25%}
.page table.tbl-data th:nth-child(6){width:15%}
.page table.tbl-data th,.page table.tbl-data td{overflow-wrap:anywhere;word-break:break-word;padding:2px 2px!important}
.page table.tbl-data th{font-size:8px!important}
.page table.tbl-data td{font-size:10px!important}
}
</style>
<link rel="stylesheet" href="table.css">
<link rel="preload" href="images/logo.png" as="image">
</head>
<body>

<div class="action-bar">
    <button type="button" class="btn-close" onclick="window.close()"><span>✕</span> Tutup</button>
    <button type="button" class="btn-print" onclick="window.print()"><span>🖨</span> Cetak PDF</button>
</div>

${pagesHTML}

</body>
</html>
`);

win.document.close();

if(loader) loader.style.display="none";

},300);

}

// 10. CHART
function updateChart() {
    const ctx = document.getElementById('moneyChart').getContext('2d');
    if(myChart) myChart.destroy();
    const last10 = guestsData.slice(-10);
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last10.map(g => g.nama.split(' ')[0]),
            datasets: [{ data: last10.map(g => g.jumlah), borderColor: themeColor(), tension: 0.4, fill: true, backgroundColor: themeColor() + '22' }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }
    });
}

function updateRanking() {
    const top = [...guestsData].sort((a, b) => b.jumlah - a.jumlah).slice(0, 5);
    document.getElementById('top-donors').innerHTML = top.map(g => `
        <li style="display:flex; justify-content:space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
            <span>${g.nama}</span><strong>${formatIDR(g.jumlah)}</strong>
        </li>
    `).join('');
}


// 11. SUMBANGAN & INFO KEGIATAN
const tipsSumbangsih = [
    "Suka dengan fitur baru? Dukung pengembangan DEJEDE agar terus update dengan fitur premium lainnya.",
    "Aplikasi ini dikembangkan secara mandiri. Sumbangsih kecil Anda sangat berarti untuk biaya server & kopi developer.",
    "Bantu DEJEDE tetap keren! Dukungan Anda membantu kami fokus menghadirkan update fitur manajemen yang lebih cerdas.",
    "Mutu aplikasi adalah prioritas kami. Mari berpartisipasi dalam pengembangan sistem yang lebih stabil & cepat."
];

function showBalloon(title, message) {
    let balloon = document.getElementById('app-balloon');
    if (!balloon) {
        balloon = document.createElement('div');
        balloon.id = 'app-balloon';
        balloon.className = 'tutorial-balloon';
        document.body.appendChild(balloon);
    }

    let infoRekening = "";
    let actionButtons = "";

    // Logika Khusus untuk Balon Sumbangsih
    if (title === "Update & Support") {

        infoRekening = `
            <div style="margin-top:10px;padding-top:8px;border-top:1px dashed var(--border-color);font-family:monospace;font-size:0.7rem;">
                <b style="color:var(--primary);">🏦 BUY ME COFFE:</b><br>
                • BRI: 6320-0100-3835-533<br>
                • A/N: Adi Sofianto<br>
                • DANA/SPay: 085236578999
                <div style="margin-top:8px;text-align:center;font-family:Inter,sans-serif;">
                    <b style="color:var(--primary);font-size:0.7rem;">📱 SCAN QRIS</b><br>
                    <img src="images/qris.png" alt="QRIS DEJEDE" loading="lazy"
                         onclick="zoomQris(this.src)"
                         onerror="this.closest('div').style.display='none'"
                         style="display:block;width:150px;max-width:100%;height:auto;margin:6px auto 2px;padding:6px;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,.2);cursor:zoom-in;">
                    <span style="font-size:0.62rem;color:var(--text-muted);">Ketuk gambar untuk memperbesar</span>
                </div>
            </div>
        `;

        actionButtons = `
            <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end;align-items:center;">

                <a href="https://wa.me/6285236578999?text=Halo%20Developer%20DEJEDE,%20saya%20ingin%20berkontribusi..."
                   target="_blank"
                   style="
                   display:flex;
                   align-items:center;
                   justify-content:center;
                   gap:6px;
                   height:32px;
                   padding:0 12px;
                   background:#25d366;
                   color:white;
                   border-radius:8px;
                   font-size:0.75rem;
                   font-weight:700;
                   text-decoration:none;
                   ">

                   <img src="images/wa-icon.svg" style="width:14px;height:14px;">
                   WhatsApp Dev
                </a>

                <button class="btn-paham"
                        onclick="closeBalloon()"
                        style="height:32px;margin-top:0;">
                        Paham
                </button>

            </div>
        `;

    } else {

        actionButtons = `
            <div style="display:flex;justify-content:flex-end;margin-top:12px;">
                <button class="btn-paham" onclick="closeBalloon()" style="margin-top:0;height:32px;">
                    Paham
                </button>
            </div>
        `;

    }

    balloon.innerHTML = `
        <div class="balloon-title">✨ ${title}</div>
        <div class="balloon-text">
            ${message}
            ${infoRekening}
        </div>
        ${actionButtons}
    `;

    setTimeout(() => balloon.classList.add('show'), 100);
}

function closeBalloon() {
    const balloon = document.getElementById('app-balloon');
    if (balloon) balloon.classList.remove('show');
}

// Perbesar gambar QRIS di dalam aplikasi (tanpa pindah halaman)
function zoomQris(src) {
    let ov = document.getElementById('qris-zoom');
    if (!ov) {
        ov = document.createElement('div');
        ov.id = 'qris-zoom';
        ov.style.cssText = 'position:fixed;inset:0;z-index:10000;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;background:rgba(0,0,0,.88);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);cursor:zoom-out;';
        ov.innerHTML = `
            <button type="button" aria-label="Tutup" style="position:absolute;top:14px;right:16px;background:none;border:none;color:#fff;font-size:2rem;line-height:1;cursor:pointer;">&times;</button>
            <img alt="QRIS DEJEDE" style="width:min(92vw,440px);max-height:78vh;object-fit:contain;background:#fff;padding:14px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.5);">
            <div style="color:#fff;font-size:.8rem;text-align:center;opacity:.9;">Scan dengan e-wallet / m-banking &bull; ketuk di mana saja untuk menutup</div>`;
        ov.addEventListener('click', closeQris);
        document.body.appendChild(ov);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQris(); });
    }
    ov.querySelector('img').src = src;
    ov.style.display = 'flex';
}
function closeQris() {
    const ov = document.getElementById('qris-zoom');
    if (ov) ov.style.display = 'none';
}

// 1. Muncul saat pertama kali login (Tutorial) - HANYA SEKALI
function showTutorialOnce() {

    const tutorialShown = localStorage.getItem('dejedeTutorialShown');

    if (!tutorialShown) {

        setTimeout(() => {
            showBalloon(
                "Tips Penggunaan",
                `
                Gunakan fitur <b>Filter</b> untuk melihat statistik tamu 
                <b>Pria</b> & <b>Wanita</b> secara cepat di dashboard.<br><br>

                Anda juga dapat:
                • Menggunakan <b>Search</b> untuk menemukan tamu dengan cepat.<br>
                • Memantau statistik kehadiran langsung dari dashboard.<br>
                • Mengekspor data tamu untuk dokumentasi acara.<br><br>

                📺 Tutorial lengkap:<br>
                <a href="https://www.youtube.com/c/dejede" target="_blank"
                style="color:var(--primary);font-weight:700;text-decoration:none;">
                www.youtube.com/c/dejede
                </a>
                `
            );

            localStorage.setItem('dejedeTutorialShown', 'true');

        }, 800);

    }
}


// 2. Interval Test (5 Detik)
setInterval(() => {
    const randomMsg = tipsSumbangsih[Math.floor(Math.random() * tipsSumbangsih.length)];
    showBalloon("Update & Support", randomMsg);
}, 600000);

</script>
<div id="loading-preview">
    <div class="loading-box">
        <div class="spinner"></div>
        <div class="loading-text">Menyiapkan laporan...</div>
    </div>
</div>
</body>
</html>
