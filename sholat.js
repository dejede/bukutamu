/* =====================================================================
   sholat.js  -  Fitur Waktu Sholat & Pengingat untuk DEJEDE Buku Tamu
   ---------------------------------------------------------------------
   - Sumber data  : API AlAdhan (metode 20 = Kemenag RI)  -> api.aladhan.com
   - Cadangan     : hitung offline (sudut Kemenag: Subuh 20 deg, Isya 18 deg)
   - Zona waktu   : deteksi otomatis WIB / WITA / WIT dari perangkat
   - Lokasi       : GPS (otomatis) atau pilih kota manual
   - Pengingat    : banner + suara + notifikasi (selama aplikasi terbuka)
   Cara pakai     : cukup tambahkan  <script src="sholat.js"></script>
                    di index.html (setelah desa.js). Semua UI dibuat otomatis.
   ===================================================================== */
(function () {
    'use strict';

    /* ---------- KONSTANTA ---------- */
    var LS_SET = 'dejedeSholat', LS_CACHE = 'dejedeSholatCache',
        LS_GPS = 'dejedeSholatGPS', LS_FIRED = 'dejedeSholatFired';

    // Indonesia tidak memakai DST, jadi offset tetap
    var ZONES = {
        WIB:  { lbl: 'WIB',  off: 7, tz: 'Asia/Jakarta',  city: 'Jakarta'  },
        WITA: { lbl: 'WITA', off: 8, tz: 'Asia/Makassar', city: 'Makassar' },
        WIT:  { lbl: 'WIT',  off: 9, tz: 'Asia/Jayapura', city: 'Jayapura' }
    };
    var TZ_MAP = {
        'Asia/Jakarta': 'WIB', 'Asia/Pontianak': 'WIB',
        'Asia/Makassar': 'WITA', 'Asia/Ujung_Pandang': 'WITA',
        'Asia/Jayapura': 'WIT'
    };

    // [nama, lintang, bujur, zona]
    var CITIES = [
        ['Banda Aceh', 5.5483, 95.3238, 'WIB'], ['Medan', 3.5952, 98.6722, 'WIB'],
        ['Padang', -0.9471, 100.4172, 'WIB'], ['Pekanbaru', 0.5071, 101.4478, 'WIB'],
        ['Batam', 1.0456, 104.0305, 'WIB'], ['Tanjung Pinang', 0.9186, 104.4558, 'WIB'],
        ['Jambi', -1.6101, 103.6131, 'WIB'], ['Palembang', -2.9761, 104.7754, 'WIB'],
        ['Pangkal Pinang', -2.1316, 106.1169, 'WIB'], ['Bengkulu', -3.8004, 102.2655, 'WIB'],
        ['Bandar Lampung', -5.45, 105.2667, 'WIB'], ['Serang', -6.12, 106.1503, 'WIB'],
        ['Jakarta', -6.2088, 106.8456, 'WIB'], ['Bandung', -6.9175, 107.6191, 'WIB'],
        ['Semarang', -6.9667, 110.4167, 'WIB'], ['Yogyakarta', -7.7956, 110.3695, 'WIB'],
        ['Surabaya', -7.2575, 112.7521, 'WIB'], ['Malang', -7.9839, 112.6214, 'WIB'],
        ['Banyuwangi', -8.2192, 114.3691, 'WIB'], ['Pontianak', -0.0263, 109.3425, 'WIB'],
        ['Palangka Raya', -2.2161, 113.9135, 'WIB'],
        ['Denpasar', -8.6705, 115.2126, 'WITA'], ['Mataram', -8.5833, 116.1167, 'WITA'],
        ['Kupang', -10.1772, 123.607, 'WITA'], ['Banjarmasin', -3.3194, 114.5908, 'WITA'],
        ['Balikpapan', -1.2654, 116.8312, 'WITA'], ['Samarinda', -0.5022, 117.1536, 'WITA'],
        ['Tarakan', 3.3, 117.6333, 'WITA'], ['Makassar', -5.1477, 119.4327, 'WITA'],
        ['Palu', -0.8917, 119.8707, 'WITA'], ['Mamuju', -2.6748, 118.8883, 'WITA'],
        ['Kendari', -3.9985, 122.5129, 'WITA'], ['Gorontalo', 0.5435, 123.0568, 'WITA'],
        ['Manado', 1.4748, 124.8421, 'WITA'],
        ['Ambon', -3.6954, 128.1814, 'WIT'], ['Ternate', 0.7833, 127.3667, 'WIT'],
        ['Manokwari', -0.8615, 134.062, 'WIT'], ['Sorong', -0.8762, 131.2558, 'WIT'],
        ['Jayapura', -2.5337, 140.7181, 'WIT'], ['Merauke', -8.4932, 140.4018, 'WIT']
    ];

    // key = nama field Aladhan, wajib = termasuk sholat fardhu (bisa diingatkan)
    var PRAYERS = [
        { key: 'Fajr',    nama: 'Subuh',   wajib: true  },
        { key: 'Sunrise', nama: 'Terbit',  wajib: false },
        { key: 'Dhuhr',   nama: 'Dzuhur',  wajib: true  },
        { key: 'Asr',     nama: 'Ashar',   wajib: true  },
        { key: 'Maghrib', nama: 'Maghrib', wajib: true  },
        { key: 'Isha',    nama: 'Isya',    wajib: true  }
    ];

    /* ---------- STATE ---------- */
    var S = loadSettings();
    var DATA = null;            // {key, loc, ymd:[y,m,d], times, src, pending}
    var tomorrowCache = null;
    var reqToken = 0;
    var modalOpen = false;
    var lastChip = '';
    var audioCtx = null;
    var alertTimer = null;
    var activeOsc = [];     // nada yang sedang/akan berbunyi
    var lastNotif = null;   // notifikasi sistem terakhir

    /* ---------- UTIL ---------- */
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function $(id) { return document.getElementById(id); }
    function jget(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
    function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

    function loadSettings() {
        var d = { chip: true, mode: 'auto', city: 'Jakarta', remind: false, lead: 10, sound: true };
        var s = jget(LS_SET, {});
        for (var k in s) if (s.hasOwnProperty(k)) d[k] = s[k];
        return d;
    }
    function saveSettings() { jset(LS_SET, S); }

    function cityByName(n) {
        for (var i = 0; i < CITIES.length; i++) if (CITIES[i][0] === n) return CITIES[i];
        return null;
    }
    function haversine(la1, lo1, la2, lo2) {
        var R = 6371, r = Math.PI / 180;
        var a = Math.pow(Math.sin((la2 - la1) * r / 2), 2) +
                Math.cos(la1 * r) * Math.cos(la2 * r) * Math.pow(Math.sin((lo2 - lo1) * r / 2), 2);
        return 2 * R * Math.asin(Math.sqrt(a));
    }
    function nearestCity(lat, lon) {
        var best = null, bd = 1e9;
        CITIES.forEach(function (c) {
            var d = haversine(lat, lon, c[1], c[2]);
            if (d < bd) { bd = d; best = c; }
        });
        return { city: best, dist: bd };
    }

    /* ---------- DETEKSI ZONA WAKTU (WIB / WITA / WIT) ---------- */
    function detectZone() {
        var tz = '';
        try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
        if (TZ_MAP[tz]) return TZ_MAP[tz];
        // cadangan: dari selisih UTC perangkat
        var off = -new Date().getTimezoneOffset() / 60;
        if (off === 7) return 'WIB';
        if (off === 8) return 'WITA';
        if (off === 9) return 'WIT';
        return null;            // perangkat tidak di zona Indonesia
    }

    /* ---------- LOKASI ---------- */
    function resolveLocation() {
        if (S.mode === 'manual') {
            var c = cityByName(S.city) || cityByName('Jakarta');
            return { name: c[0], lat: c[1], lon: c[2], zone: c[3], gps: false };
        }
        var dz = detectZone();
        var g = jget(LS_GPS, null);
        if (g && isFinite(g.lat) && isFinite(g.lon)) {
            var n = nearestCity(g.lat, g.lon);
            if (n.dist < 900) {
                return {
                    name: 'Dekat ' + n.city[0], lat: g.lat, lon: g.lon,
                    zone: dz || n.city[3], gps: true
                };
            }
        }
        var z = dz || 'WIB';
        var rc = cityByName(ZONES[z].city);
        return { name: rc[0] + ' (perkiraan)', lat: rc[1], lon: rc[2], zone: z, gps: false };
    }

    function requestGPS(manual) {
        var st = $('sh-gps-status');
        function say(t) { if (st) st.textContent = t; }
        if (!navigator.geolocation) { say('Perangkat tidak mendukung GPS. Pilih kota manual.'); return; }
        if (manual) say('Mencari lokasi…');
        navigator.geolocation.getCurrentPosition(function (p) {
            jset(LS_GPS, { lat: +p.coords.latitude.toFixed(4), lon: +p.coords.longitude.toFixed(4), t: Date.now() });
            if (S.mode !== 'auto') { S.mode = 'auto'; saveSettings(); syncSettingsUI(); }
            say('Lokasi terdeteksi ✓');
            refresh(true);
        }, function (e) {
            if (e && e.code === 1) say('Izin lokasi ditolak. Aktifkan izin lokasi atau pilih kota manual.');
            else if (!window.isSecureContext) say('GPS butuh HTTPS. Pilih kota manual.');
            else say('Lokasi tidak ditemukan. Coba lagi atau pilih kota manual.');
        }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 3600000 });
    }

    // GPS diam-diam hanya jika izin sudah pernah diberikan
    function silentGPS() {
        if (S.mode !== 'auto' || !navigator.geolocation) return;
        var g = jget(LS_GPS, null);
        if (g && Date.now() - g.t < 6 * 3600e3) return;
        try {
            if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions.query({ name: 'geolocation' }).then(function (r) {
                    if (r.state === 'granted') requestGPS(false);
                }).catch(function () {});
            }
        } catch (e) {}
    }

    /* ---------- WAKTU ---------- */
    function todayInZone(zone) {
        var d = new Date(Date.now() + ZONES[zone].off * 3600e3);
        return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()];
    }
    function sameYmd(a, b) { return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]; }
    function instant(ymd, hhmm, off) {
        var p = hhmm.split(':');
        return Date.UTC(ymd[0], ymd[1] - 1, ymd[2], +p[0] - off, +p[1]);
    }

    /* ---------- HITUNG OFFLINE (algoritma astronomi standar) ---------- */
    var dtr = function (x) { return x * Math.PI / 180; },
        rtd = function (x) { return x * 180 / Math.PI; },
        sin = function (x) { return Math.sin(dtr(x)); },
        cos = function (x) { return Math.cos(dtr(x)); },
        tan = function (x) { return Math.tan(dtr(x)); },
        arcsin = function (x) { return rtd(Math.asin(x)); },
        arccos = function (x) { return rtd(Math.acos(x)); },
        arctan2 = function (y, x) { return rtd(Math.atan2(y, x)); },
        arccot = function (x) { return rtd(Math.atan(1 / x)); },
        fixAngle = function (a) { return a - 360 * Math.floor(a / 360); },
        fixHour = function (a) { return a - 24 * Math.floor(a / 24); };

    function julian(y, m, d) {
        if (m <= 2) { y -= 1; m += 12; }
        var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
        return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
    }
    function sunPos(jd) {
        var D = jd - 2451545.0;
        var g = fixAngle(357.529 + 0.98560028 * D);
        var q = fixAngle(280.459 + 0.98564736 * D);
        var L = fixAngle(q + 1.915 * sin(g) + 0.020 * sin(2 * g));
        var e = 23.439 - 0.00000036 * D;
        var RA = arctan2(cos(e) * sin(L), cos(L)) / 15;
        return { decl: arcsin(sin(e) * sin(L)), eq: q / 15 - fixHour(RA) };
    }

    // Parameter Kemenag RI: Subuh 20 deg, Isya 18 deg, Ashar standar (Syafi'i), ihtiyath 2 menit
    function calcTimes(y, m, d, lat, lon, off) {
        var jd = julian(y, m, d) - lon / 360;
        var RS = 0.833;
        function midDay(t) { return fixHour(12 - sunPos(jd + t).eq); }
        function angleTime(angle, t, ccw) {
            var decl = sunPos(jd + t).decl;
            var v = (-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat));
            v = Math.max(-1, Math.min(1, v));
            var x = arccos(v) / 15;
            return midDay(t) + (ccw ? -x : x);
        }
        function asrTime(t) {
            var decl = sunPos(jd + t).decl;
            var ang = -arccot(1 + tan(Math.abs(lat - decl)));
            return angleTime(ang, t, false);
        }
        var T = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, sunset: 18, isha: 18 }, t = {}, k;
        for (k in T) t[k] = T[k] / 24;
        var r = {
            fajr: angleTime(20, t.fajr, true),
            sunrise: angleTime(RS, t.sunrise, true),
            dhuhr: midDay(t.dhuhr),
            asr: asrTime(t.asr),
            sunset: angleTime(RS, t.sunset, false),
            isha: angleTime(18, t.isha, false)
        };
        var adj = off - lon / 15;
        for (k in r) r[k] += adj;
        var IH = 2; // menit ihtiyath
        function f(h, plus) {
            var mn = Math.round(h * 60 + plus);
            mn = ((mn % 1440) + 1440) % 1440;
            return pad(Math.floor(mn / 60)) + ':' + pad(mn % 60);
        }
        return {
            Fajr: f(r.fajr, IH), Sunrise: f(r.sunrise, -IH), Dhuhr: f(r.dhuhr, IH),
            Asr: f(r.asr, IH), Maghrib: f(r.sunset, IH), Isha: f(r.isha, IH)
        };
    }

    /* ---------- AMBIL DATA DARI API ---------- */
    function fetchAladhan(loc, ymd) {
        var dd = pad(ymd[2]) + '-' + pad(ymd[1]) + '-' + ymd[0];
        var url = 'https://api.aladhan.com/v1/timings/' + dd +
            '?latitude=' + loc.lat + '&longitude=' + loc.lon +
            '&method=20&timezonestring=' + encodeURIComponent(ZONES[loc.zone].tz);
        var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        var to = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
        return fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(function (r) {
            clearTimeout(to);
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        }).then(function (j) {
            var t = j && j.data && j.data.timings;
            if (!t) throw new Error('format');
            var out = {};
            PRAYERS.forEach(function (p) {
                var v = String(t[p.key] || '').trim().slice(0, 5);
                if (!/^\d{1,2}:\d{2}$/.test(v)) throw new Error('waktu ' + p.key);
                out[p.key] = v.length === 4 ? '0' + v : v;
            });
            return out;
        });
    }

    /* ---------- MUAT / REFRESH ---------- */
    function cacheKey(loc, ymd) {
        return ymd.join('-') + '|' + loc.lat.toFixed(2) + ',' + loc.lon.toFixed(2) + '|' + loc.zone;
    }
    function refresh(force) {
        var loc = resolveLocation();
        var ymd = todayInZone(loc.zone);
        var key = cacheKey(loc, ymd);
        if (!force && DATA && DATA.key === key && !DATA.pending) { return; }

        var c = jget(LS_CACHE, null);
        if (!force && c && c.key === key && c.times &&
            (c.src === 'api' || Date.now() - c.ts < 30 * 60e3)) {
            DATA = { key: key, loc: loc, ymd: ymd, times: c.times, src: c.src, pending: false };
            tomorrowCache = null; renderAll(); return;
        }

        // tampilkan hitungan offline lebih dulu agar tidak kosong
        DATA = {
            key: key, loc: loc, ymd: ymd, pending: true, src: 'offline',
            times: calcTimes(ymd[0], ymd[1], ymd[2], loc.lat, loc.lon, ZONES[loc.zone].off)
        };
        tomorrowCache = null; renderAll();

        var my = ++reqToken;
        fetchAladhan(loc, ymd).then(function (times) {
            if (my !== reqToken) return;
            DATA = { key: key, loc: loc, ymd: ymd, times: times, src: 'api', pending: false };
            jset(LS_CACHE, { key: key, times: times, src: 'api', ts: Date.now() });
            renderAll();
        }).catch(function () {
            if (my !== reqToken) return;
            DATA.pending = false;
            jset(LS_CACHE, { key: key, times: DATA.times, src: 'offline', ts: Date.now() });
            renderAll();
        });
    }

    /* ---------- HITUNG SHOLAT BERIKUTNYA ---------- */
    function instants() {
        var off = ZONES[DATA.loc.zone].off;
        return PRAYERS.map(function (p) {
            return { key: p.key, nama: p.nama, wajib: p.wajib, hhmm: DATA.times[p.key], t: instant(DATA.ymd, DATA.times[p.key], off) };
        });
    }
    function nextPrayer(now) {
        var list = instants().filter(function (p) { return p.wajib; });
        for (var i = 0; i < list.length; i++) if (list[i].t > now) { list[i].besok = false; return list[i]; }
        if (!tomorrowCache) {
            var off = ZONES[DATA.loc.zone].off;
            var dt = new Date(Date.UTC(DATA.ymd[0], DATA.ymd[1] - 1, DATA.ymd[2] + 1));
            var y = dt.getUTCFullYear(), m = dt.getUTCMonth() + 1, d = dt.getUTCDate();
            var tm = calcTimes(y, m, d, DATA.loc.lat, DATA.loc.lon, off);
            tomorrowCache = { key: 'Fajr', nama: 'Subuh', wajib: true, hhmm: tm.Fajr, t: instant([y, m, d], tm.Fajr, off), besok: true };
        }
        return tomorrowCache;
    }
    function fmtCount(ms) {
        var s = Math.max(0, Math.floor(ms / 1000));
        var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sc = s % 60;
        return pad(h) + ':' + pad(m) + ':' + pad(sc);
    }
    function fmtShort(ms) {
        var m = Math.max(0, Math.round(ms / 60000));
        var h = Math.floor(m / 60);
        return h > 0 ? h + 'j ' + (m % 60) + 'm' : m + ' mnt';
    }

    /* ---------- PENGINGAT ---------- */
    function getAudio() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        } catch (e) { audioCtx = null; }
        return audioCtx;
    }
    function beep() {
        var ctx = getAudio(); if (!ctx) return;
        var seq = [660, 880, 660, 880];
        seq.forEach(function (f, i) {
            var o = ctx.createOscillator(), g = ctx.createGain();
            var t0 = ctx.currentTime + i * 0.38;
            o.type = 'sine'; o.frequency.value = f;
            g.gain.setValueAtTime(0.0001, t0);
            g.gain.exponentialRampToValueAtTime(0.35, t0 + 0.04);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.34);
            o.connect(g); g.connect(ctx.destination);
            o.start(t0); o.stop(t0 + 0.36);
            activeOsc.push(o);
            o.onended = function () { var i = activeOsc.indexOf(o); if (i > -1) activeOsc.splice(i, 1); };
        });
    }
    function showAlert(title, body) {
        var a = $('sh-alert'); if (!a) return;
        a.querySelector('b').textContent = title;
        a.querySelector('span').textContent = body;
        a.classList.add('show');
        clearTimeout(alertTimer);
        alertTimer = setTimeout(function () { a.classList.remove('show'); }, 90000);
    }
    function notify(title, body) {
        try {
            if (!('Notification' in window) || Notification.permission !== 'granted') return;
            lastNotif = new Notification(title, { body: body, icon: 'images/logo.png', tag: 'dejede-sholat' });
        } catch (e) { /* beberapa browser HP tidak mengizinkan konstruktor langsung */ }
    }
    // Hentikan semua: suara, getar, notifikasi sistem, dan banner
    function stopAlert() {
        activeOsc.slice().forEach(function (o) { try { o.stop(); } catch (e) {} });
        activeOsc = [];
        try { if (navigator.vibrate) navigator.vibrate(0); } catch (e) {}
        try { if (lastNotif) lastNotif.close(); } catch (e) {}
        lastNotif = null;
        clearTimeout(alertTimer);
        var a = $('sh-alert'); if (a) a.classList.remove('show');
    }
    function fire(title, body) {
        stopAlert();   // jangan menumpuk dengan pengingat sebelumnya
        showAlert(title, body);
        if (typeof window.toast === 'function') window.toast('🕌 ' + title);
        notify(title, body);
        if (S.sound) beep();
        try { if (navigator.vibrate) navigator.vibrate([300, 150, 300]); } catch (e) {}
    }
    function checkReminders(now) {
        if (!S.remind || !DATA) return;
        var day = DATA.ymd.join('-');
        var f = jget(LS_FIRED, {});
        if (f.day !== day) f = { day: day, k: {} };
        var changed = false, zl = ZONES[DATA.loc.zone].lbl;
        instants().forEach(function (p) {
            if (!p.wajib) return;
            var kPre = p.key + '-pre', kAt = p.key + '-at';
            if (S.lead > 0 && !f.k[kPre] && now >= p.t - S.lead * 60000 && now < p.t) {
                f.k[kPre] = 1; changed = true;
                fire(p.nama + ' ' + S.lead + ' menit lagi', 'Waktu ' + p.nama + ' pukul ' + p.hhmm + ' ' + zl + ' — bersiaplah.');
            }
            if (!f.k[kAt] && now >= p.t && now < p.t + 3 * 60000) {
                f.k[kAt] = 1; changed = true;
                fire('Waktu ' + p.nama + ' telah tiba', 'Pukul ' + p.hhmm + ' ' + zl + ' (' + DATA.loc.name + '). Mari tunaikan sholat.');
            }
        });
        if (changed) jset(LS_FIRED, f);
    }

    /* ---------- UI ---------- */
    var CSS = '' +
        '.sh-chip{margin-top:3px;font-size:.62rem;line-height:1.2;color:var(--primary);cursor:pointer;padding:2px 8px;border-radius:999px;' +
        'border:1px solid color-mix(in srgb,var(--primary) 40%,transparent);background:color-mix(in srgb,var(--primary) 10%,transparent);white-space:nowrap;font-weight:600}' +
        '.sh-chip:hover{background:color-mix(in srgb,var(--primary) 22%,transparent)}' +
        '.sh-card{width:100%;max-width:420px;margin-bottom:0;max-height:92vh;overflow-y:auto}' +
        '.sh-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}' +
        '.sh-head h3{margin:0!important;color:var(--primary)!important}' +
        '.sh-x{background:none;border:none;color:var(--danger);font-size:1.5rem;cursor:pointer}' +
        '.sh-top{display:flex;justify-content:space-between;align-items:center;font-size:.78rem;color:var(--text-muted);margin-bottom:2px}' +
        '.sh-badge{background:var(--primary);color:var(--on-primary,#fff);font-weight:700;font-size:.72rem;padding:2px 10px;border-radius:999px}' +
        '.sh-loc{font-size:.8rem;margin-bottom:10px}' +
        '.sh-next{text-align:center;padding:12px;border-radius:calc(var(--radius,16px) - 4px);margin-bottom:10px;' +
        'background:color-mix(in srgb,var(--primary) 14%,transparent);border:1px solid color-mix(in srgb,var(--primary) 35%,transparent)}' +
        '.sh-next small{display:block;font-size:.7rem;color:var(--text-muted)}' +
        '.sh-next b{font-size:1.15rem;color:var(--text-main)}' +
        '.sh-next .sh-cd{display:block;font-size:1.6rem;font-weight:700;color:var(--primary);font-variant-numeric:tabular-nums;letter-spacing:1px}' +
        '.sh-row{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-radius:10px;font-size:.9rem;border:1px solid transparent}' +
        '.sh-row+.sh-row{margin-top:2px}' +
        '.sh-row.past{opacity:.5}' +
        '.sh-row.minor{font-size:.8rem;color:var(--text-muted)}' +
        '.sh-row.next{background:color-mix(in srgb,var(--primary) 16%,transparent);border-color:var(--primary);font-weight:700}' +
        '.sh-row time{font-variant-numeric:tabular-nums;font-weight:700}' +
        '.sh-src{font-size:.68rem;color:var(--text-muted);margin:8px 0 12px;text-align:center}' +
        '.sh-sep{border:none;border-top:1px solid var(--border-color);margin:12px 0}' +
        '.sh-set{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:8px 0;font-size:.82rem}' +
        '.sh-set select{max-width:55%;padding:6px 8px;font-size:.8rem}' +
        '.sh-btns{display:flex;gap:8px;margin-top:8px}' +
        '.sh-btns button{flex:1;padding:9px 6px;font-size:.78rem;cursor:pointer;font-weight:700;border-radius:calc(var(--radius,16px) - 6px);' +
        'border:1px solid var(--border-color);background:transparent;color:var(--text-main)}' +
        '.sh-btns button:hover{border-color:var(--primary)}' +
        '.sh-status{font-size:.7rem;color:var(--text-muted);min-height:1em;margin-top:6px}' +
        '.sh-sw{position:relative;width:42px;height:24px;flex:none}' +
        '.sh-sw input{opacity:0;width:100%;height:100%;position:absolute;inset:0;margin:0;cursor:pointer;z-index:2}' +
        '.sh-sw i{position:absolute;inset:0;background:var(--border-color);border-radius:999px;transition:.2s}' +
        '.sh-sw i:after{content:"";position:absolute;left:3px;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}' +
        '.sh-sw input:checked+i{background:var(--primary)}' +
        '.sh-sw input:checked+i:after{transform:translateX(18px)}' +
        '#sh-alert{position:fixed;left:50%;top:12px;transform:translate(-50%,-140%);width:calc(100% - 24px);max-width:420px;z-index:6000;display:flex;gap:10px;align-items:flex-start;' +
        'padding:12px 14px;border-radius:14px;background:var(--primary);color:var(--on-primary,#fff);box-shadow:0 8px 30px rgba(0,0,0,.35);transition:transform .35s}' +
        '#sh-alert.show{transform:translate(-50%,0)}' +
        '#sh-alert div{flex:1;display:flex;flex-direction:column;font-size:.8rem;line-height:1.35}' +
        '#sh-alert b{font-size:.92rem}' +
        '#sh-alert button{background:none;border:none;color:inherit;font-size:1.3rem;cursor:pointer;line-height:1}' +
        '#sh-alert .sh-stop{font-size:.72rem;font-weight:700;padding:6px 10px;border-radius:999px;border:1px solid currentColor;white-space:nowrap;align-self:center}';

    function sw(id) { return '<label class="sh-sw"><input type="checkbox" id="' + id + '"><i></i></label>'; }

    function cityOptions() {
        var html = '<option value="auto">📍 Otomatis (GPS)</option>';
        ['WIB', 'WITA', 'WIT'].forEach(function (z) {
            html += '<optgroup label="' + z + '">';
            CITIES.filter(function (c) { return c[3] === z; }).forEach(function (c) {
                html += '<option value="' + c[0] + '">' + c[0] + '</option>';
            });
            html += '</optgroup>';
        });
        return html;
    }

    function buildUI() {
        var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

        // tombol di navigasi bawah
        var nav = document.querySelector('.floating-nav');
        if (nav) {
            var b = document.createElement('button');
            b.className = 'nav-item'; b.id = 'sh-nav';
            b.innerHTML = '<i>🕌</i><span>Sholat</span>';
            b.addEventListener('click', openModal);
            nav.appendChild(b);
        }
        // chip di header (bawah jam digital)
        var clock = $('digital-clock');
        if (clock) {
            var chip = document.createElement('div');
            chip.className = 'sh-chip'; chip.id = 'sh-chip';
            chip.setAttribute('role', 'button'); chip.setAttribute('tabindex', '0');
            chip.style.display = 'none';
            chip.addEventListener('click', openModal);
            chip.addEventListener('keydown', function (e) { if (e.key === 'Enter') openModal(); });
            clock.appendChild(chip);
        }
        // banner pengingat
        var al = document.createElement('div');
        al.id = 'sh-alert';
        al.innerHTML = '<div><b></b><span></span></div><button type="button" class="sh-stop" id="sh-stop">🔕 Hentikan</button><button type="button" class="sh-x2" aria-label="Tutup">&times;</button>';
        al.querySelectorAll('button').forEach(function (bt) { bt.addEventListener('click', stopAlert); });
        document.body.appendChild(al);

        // modal
        var m = document.createElement('div');
        m.id = 'sholatModal'; m.className = 'overlay'; m.style.zIndex = '3650';
        m.innerHTML =
            '<div class="card sh-card">' +
            '<div class="sh-head"><h3>🕌 Waktu Sholat</h3><button type="button" class="sh-x" id="sh-close">&times;</button></div>' +
            '<div class="sh-top"><span id="sh-date"></span><span class="sh-badge" id="sh-zone">WIB</span></div>' +
            '<div class="sh-loc">📍 <span id="sh-loc"></span></div>' +
            '<div class="sh-next"><small id="sh-next-lbl">Sholat berikutnya</small><b id="sh-next-name">-</b><span class="sh-cd" id="sh-cd">--:--:--</span></div>' +
            '<div id="sh-list"></div>' +
            '<div class="sh-src" id="sh-src"></div>' +
            '<hr class="sh-sep">' +
            '<div class="sh-set"><span>Lokasi</span><select id="sh-city">' + cityOptions() + '</select></div>' +
            '<div class="sh-btns"><button type="button" id="sh-gps">📍 Deteksi lokasi saya</button></div>' +
            '<div class="sh-status" id="sh-gps-status"></div>' +
            '<div class="sh-set"><span>Tampilkan di header</span>' + sw('sh-chip-on') + '</div>' +
            '<div class="sh-set"><span>Pengingat waktu sholat</span>' + sw('sh-remind') + '</div>' +
            '<div class="sh-set"><span>Ingatkan sebelumnya</span><select id="sh-lead">' +
            '<option value="0">Tepat waktu saja</option><option value="5">5 menit sebelum</option>' +
            '<option value="10">10 menit sebelum</option><option value="15">15 menit sebelum</option></select></div>' +
            '<div class="sh-set"><span>Suara pengingat</span>' + sw('sh-sound') + '</div>' +
            '<div class="sh-btns"><button type="button" id="sh-test">🔔 Tes pengingat</button></div>' +
            '<div class="sh-status" id="sh-note">Pengingat berbunyi selama aplikasi ini terbuka di browser.</div>' +
            '</div>';
        m.addEventListener('click', function (e) { if (e.target === m) closeModal(); });
        document.body.appendChild(m);

        $('sh-close').addEventListener('click', closeModal);
        $('sh-gps').addEventListener('click', function () {
            S.mode = 'auto'; saveSettings(); syncSettingsUI(); requestGPS(true);
        });
        $('sh-city').addEventListener('change', function () {
            if (this.value === 'auto') { S.mode = 'auto'; saveSettings(); refresh(true); silentGPS(); }
            else { S.mode = 'manual'; S.city = this.value; saveSettings(); refresh(true); }
        });
        $('sh-chip-on').addEventListener('change', function () { S.chip = this.checked; saveSettings(); lastChip = ''; tick(); });
        $('sh-sound').addEventListener('change', function () { S.sound = this.checked; saveSettings(); if (this.checked) getAudio(); });
        $('sh-lead').addEventListener('change', function () { S.lead = +this.value; saveSettings(); });
        $('sh-remind').addEventListener('change', function () {
            S.remind = this.checked; saveSettings();
            if (this.checked) {
                getAudio();   // aktifkan audio lewat sentuhan pengguna
                if ('Notification' in window && Notification.permission === 'default') {
                    try { Notification.requestPermission().then(updateNote); } catch (e) { updateNote(); }
                }
            }
            updateNote();
        });
        $('sh-test').addEventListener('click', function () {
            var zl = DATA ? ZONES[DATA.loc.zone].lbl : '';
            getAudio();
            fire('Tes pengingat sholat', 'Pengingat berfungsi. Zona waktu ' + zl + '.');
        });
        // buka kunci audio pada sentuhan pertama
        document.addEventListener('pointerdown', function once() {
            document.removeEventListener('pointerdown', once);
            if (S.remind && S.sound) getAudio();
        });
    }

    function updateNote() {
        var n = $('sh-note'); if (!n) return;
        var t = 'Pengingat berbunyi selama aplikasi ini terbuka di browser.';
        if (S.remind) {
            if (!('Notification' in window)) t += ' Notifikasi sistem tidak didukung, banner & suara tetap aktif.';
            else if (Notification.permission === 'denied') t += ' Notifikasi sistem diblokir, banner & suara tetap aktif.';
            else if (Notification.permission === 'granted') t += ' Notifikasi sistem aktif.';
        }
        n.textContent = t;
    }

    function syncSettingsUI() {
        if (!$('sh-city')) return;
        $('sh-city').value = S.mode === 'auto' ? 'auto' : S.city;
        $('sh-chip-on').checked = !!S.chip;
        $('sh-remind').checked = !!S.remind;
        $('sh-sound').checked = !!S.sound;
        $('sh-lead').value = String(S.lead);
        updateNote();
    }

    function openModal() {
        modalOpen = true;
        $('sholatModal').style.display = 'flex';
        syncSettingsUI(); renderModal(); tick();
        // pertama kali dibuka pada mode otomatis: minta lokasi GPS
        if (S.mode === 'auto' && !jget(LS_GPS, null) && !openModal._asked) {
            openModal._asked = true; requestGPS(true);
        }
    }
    function closeModal() { modalOpen = false; $('sholatModal').style.display = 'none'; }

    var HARI = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    function renderModal() {
        if (!DATA || !modalOpen) return;
        var y = DATA.ymd[0], m = DATA.ymd[1], d = DATA.ymd[2];
        var dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
        $('sh-date').textContent = HARI[dow] + ', ' + d + ' ' + BULAN[m - 1] + ' ' + y;
        var z = ZONES[DATA.loc.zone];
        $('sh-zone').textContent = z.lbl + ' (UTC+' + z.off + ')';
        $('sh-loc').textContent = DATA.loc.name + (DATA.loc.gps ? ' • GPS' : '');
        var src = DATA.pending ? 'Memuat dari server…' :
            (DATA.src === 'api' ? 'Sumber: AlAdhan API • metode Kemenag RI' :
                'Offline: hitungan perkiraan (sudut Kemenag), bisa selisih ±2 menit');
        $('sh-src').textContent = src;
        updateModal(Date.now());
    }
    function updateModal(now) {
        if (!DATA) return;
        var list = instants(), nx = nextPrayer(now), html = '';
        list.forEach(function (p) {
            var cls = 'sh-row' + (p.wajib ? '' : ' minor') + (p.t <= now ? ' past' : '') +
                (!nx.besok && p.key === nx.key ? ' next' : '');
            html += '<div class="' + cls + '"><span>' + p.nama + '</span><time>' + p.hhmm + '</time></div>';
        });
        var l = $('sh-list'); if (l && l._h !== html) { l.innerHTML = html; l._h = html; }
        $('sh-next-lbl').textContent = nx.besok ? 'Sholat berikutnya (besok)' : 'Sholat berikutnya';
        $('sh-next-name').textContent = nx.nama + ' • ' + nx.hhmm + ' ' + ZONES[DATA.loc.zone].lbl;
        $('sh-cd').textContent = fmtCount(nx.t - now);
    }

    function updateChip(now) {
        var c = $('sh-chip'); if (!c) return;
        if (!S.chip || !DATA) { if (c.style.display !== 'none') c.style.display = 'none'; lastChip = ''; return; }
        var nx = nextPrayer(now);
        var txt = '🕌 ' + nx.nama + ' ' + nx.hhmm + ' ' + ZONES[DATA.loc.zone].lbl + ' • ' + fmtShort(nx.t - now);
        if (txt !== lastChip) { c.textContent = txt; lastChip = txt; }
        if (c.style.display === 'none') c.style.display = '';
    }

    function renderAll() { renderModal(); updateChip(Date.now()); }

    /* ---------- LOOP ---------- */
    var zoneCheckAt = 0;
    function tick() {
        if (!DATA) return;
        var now = Date.now();
        if (!sameYmd(todayInZone(DATA.loc.zone), DATA.ymd)) { refresh(true); return; }   // ganti hari
        if (now - zoneCheckAt > 30000) {                                                // zona/lokasi berubah?
            zoneCheckAt = now;
            var loc = resolveLocation();
            if (loc.zone !== DATA.loc.zone || cacheKey(loc, todayInZone(loc.zone)) !== DATA.key) { refresh(true); return; }
        }
        updateChip(now);
        if (modalOpen) updateModal(now);
        checkReminders(now);
    }

    function init() {
        buildUI();
        refresh(false);
        silentGPS();
        setInterval(tick, 1000);
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) { zoneCheckAt = 0; silentGPS(); tick(); }
        });
    }

    // API publik (opsional dipakai dari tempat lain)
    window.SHOLAT = {
        open: openModal, close: closeModal, stop: stopAlert, refresh: function () { refresh(true); },
        _calc: calcTimes, _detectZone: detectZone
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
