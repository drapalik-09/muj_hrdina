// =========================================================================
// 1. MODÁLNÍ OKNO PRO KNIHY (Spouští se na knihy.html)
// =========================================================================
const modal = document.getElementById("bookModal");
const modalImg = document.getElementById("modalImg");
const modalBookTitle = document.getElementById("modalBookTitle");

const infoAutor = document.getElementById("infoAutor");
const infoSerie = document.getElementById("infoSerie");
const infoPoradi = document.getElementById("infoPoradi");
const infoRok = document.getElementById("infoRok");
const infoDej = document.getElementById("infoDej");

const spoilerBtn = document.getElementById("spoilerBtn");
const hideSpoilerBtn = document.getElementById("hideSpoilerBtn");
const spoilerOverlay = document.getElementById("spoilerOverlay");
const spoilerScrollBox = document.querySelector(".spoiler-scroll-box");

const closeBtn = document.getElementById("modalClose");
const cards = document.querySelectorAll('.card, .s1, .s2, .s3');

function escapeHTML(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatDej(text) {
    const normalized = String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return normalized
        .split(/\n\s*\n/)
        .map(paragraph => paragraph.trim())
        .filter(Boolean)
        .map(paragraph => `<p>${escapeHTML(paragraph).replace(/\n/g, '<br>')}</p>`)
        .join('');
}

cards.forEach(card => {
    card.addEventListener('click', function() {
        const img = this.querySelector('img');
        const text = this.querySelector('.popis');
        
        if (img) {
            if (modal) modal.style.display = "flex"; 
            if (modalImg) modalImg.src = img.src;
            
            if (spoilerOverlay) spoilerOverlay.classList.remove("active");
            if (spoilerScrollBox) spoilerScrollBox.scrollTop = 0;
            
            if (text && modalBookTitle) {
                modalBookTitle.innerText = text.innerText;
            } else if (modalBookTitle) {
                modalBookTitle.innerText = img.alt;
            }

            if (infoAutor) infoAutor.innerText = this.getAttribute('data-autor') || "-";
            if (infoSerie) infoSerie.innerText = this.getAttribute('data-serie') || "-";
            if (infoPoradi) infoPoradi.innerText = this.getAttribute('data-poradi') || "-";
            if (infoRok) infoRok.innerText = this.getAttribute('data-rok') || "-";
            if (infoDej) infoDej.innerHTML = formatDej(this.getAttribute('data-dej') || "Příběh pro tuto knihu nebyl doplněn.");
        }
    });
});

if (spoilerBtn && spoilerOverlay) {
    spoilerBtn.addEventListener('click', function() {
        spoilerOverlay.classList.add("active");
    });
}

if (hideSpoilerBtn && spoilerOverlay) {
    hideSpoilerBtn.addEventListener('click', function() {
        spoilerOverlay.classList.remove("active");
    });
}

if (closeBtn && modal) {
    closeBtn.addEventListener('click', function() {
        modal.style.display = "none";
    });
}

window.addEventListener('click', function(event) {
    if (modal && event.target === modal) {
        modal.style.display = "none";
    }
});

window.addEventListener('keydown', function(event) {
    if (modal && event.key === "Escape" && modal.style.display === "flex") {
        modal.style.display = "none";
    }
});


// =========================================================================
// 2. FOTOGALERIE / LIGHTBOX (Spouští se na fotogalerie.html)
// =========================================================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const zaviratko = document.querySelector('.zaviratko');
const fotky = document.querySelectorAll('.foto img');

if (lightbox && lightboxImg && fotky.length > 0) {
    fotky.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = img.src;
        });
    });

    if (zaviratko) {
        zaviratko.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg && e.target !== zaviratko) {
            lightbox.style.display = 'none';
        }
    });
}


// =========================================================================
// 3. TLAČÍTKA ZPĚT (Spouští se na login.html)
// =========================================================================
const backLink = document.getElementById('back-link');
const backLinkk = document.getElementById('back-linkk');

function handleBackAction(e) {
    e.preventDefault();
    if (history.length > 1) {
        history.back();
    } else {
        window.location.href = 'uvodni_strana.html';
    }
}

if (backLink) backLink.addEventListener('click', handleBackAction);
if (backLinkk) backLinkk.addEventListener('click', handleBackAction);


// =========================================================================
// 4. KONTROLA REGISTRACE / PŘIHLÁŠENÍ (Spouští se na login.html)
// =========================================================================
const loginForm = document.getElementById('login-form');
const heslo = document.getElementById('heslo');
const hesloPotvrzeni = document.getElementById('heslo-potvrzeni');
const chybaText = document.getElementById('chyba-heslo');

if (loginForm && heslo && hesloPotvrzeni && chybaText) {
    loginForm.addEventListener('submit', function(e) {
        if (heslo.value !== hesloPotvrzeni.value) {
            e.preventDefault();
            chybaText.style.display = 'block';
            hesloPotvrzeni.style.borderColor = '#ff4500';
        } else {
            e.preventDefault(); 
            chybaText.style.display = 'none';
            hesloPotvrzeni.style.borderColor = ''; 
            
            // Uložení přihlášení do prohlížeče
            localStorage.setItem('uzivatelPrihlasen', 'true');
            
            // Přesměrování na stránku "proč"
            window.location.href = 'proc.html';
        }
    });
}


// =========================================================================
// 5. KONTROLA PŘIHLÁŠENÍ A ŽIVÉ HODNOCENÍ (Spouští se na proc.html)
// =========================================================================
// HLEDÁME PODLE CLASS, PROTOŽE ID V HTML NEMÁŠ:
const tlacitkoOdeslat = document.querySelector('.hodnoceni-container .button');
const upozorneni = document.getElementById('prihlaseni-upozorneni');
const posuvnik = document.getElementById('hodnoceni');
const vystup = document.getElementById('aktualni-hodnota');

if (posuvnik && vystup) {
    const jePrihlasen = localStorage.getItem('uzivatelPrihlasen');

    if (jePrihlasen === 'true') {
        if (tlacitkoOdeslat) tlacitkoOdeslat.style.display = 'block';
        if (upozorneni) upozorneni.style.display = 'none';
        posuvnik.disabled = false;
        
        vystup.innerText = posuvnik.value;

        posuvnik.addEventListener('input', function() {
            vystup.innerText = this.value;
        });

    } else {
        if (tlacitkoOdeslat) tlacitkoOdeslat.style.display = 'none';
        if (upozorneni) upozorneni.style.display = 'block';
        posuvnik.disabled = true;
    }
}
// Smazána přebytečná složená závorka, která tam byla navíc