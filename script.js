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
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatDej(text) {
    const normalized = String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return normalized.split('\n\n').map(p => `<p>${escapeHTML(p)}</p>`).join('');
}

if (cards.length > 0 && modal) {
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) modalImg.src = img.src;

            modalBookTitle.innerText = this.getAttribute('data-title') || '-';
            infoAutor.innerText = this.getAttribute('data-autor') || '-';
            infoSerie.innerText = this.getAttribute('data-serie') || '-';
            infoPoradi.innerText = this.getAttribute('data-poradi') || '-';
            infoRok.innerText = this.getAttribute('data-rok') || '-';

            const rawDej = this.getAttribute('data-dej') || 'Děj k této knize zatím nebyl přidán.';
            infoDej.innerHTML = formatDej(rawDej);

            modal.style.display = "block";
            document.body.style.overflow = "hidden";
            
            if (spoilerOverlay) spoilerOverlay.classList.remove("active");
            if (spoilerScrollBox) spoilerScrollBox.scrollTop = 0;
        });
    });
}

if (closeBtn && modal) {
    closeBtn.addEventListener('click', function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    });
}

if (modal) {
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
}

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

// =========================================================================
// 2. LIGHTBOX PRO FOTOGALERII (Spouští se na fotogalerie.html)
// =========================================================================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const zaviratko = document.querySelector(".zaviratko");
const fotky = document.querySelectorAll(".klikaci-foto");

if (fotky.length > 0 && lightbox && lightboxImg) {
    fotky.forEach(foto => {
        foto.addEventListener("click", function() {
            lightbox.style.display = "flex";
            lightboxImg.src = this.src;
            document.body.style.overflow = "hidden";
        });
    });
}

if (zaviratko && lightbox) {
    zaviratko.addEventListener("click", function() {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    });
}

if (lightbox) {
    lightbox.addEventListener("click", function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
}

// =========================================================================
// 3. TLAČÍTKO ZPĚT (Spouští se na login.html)
// =========================================================================
const backLink = document.getElementById('back-link');
if (backLink) {
    backLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (document.referrer) {
            window.location.href = document.referrer;
        } else {
            window.location.href = 'index.html';
        }
    });
}

// =========================================================================
// 4. KONTROLA REGISTRACE / PŘIHLÁŠENÍ (Spouští se na login.html)
// =========================================================================
const loginForm = document.getElementById('login-form');
const jmenoInput = document.getElementById('username'); 
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
            
            // Uložení stavu přihlášení a zadaného jména do paměti prohlížeče
            localStorage.setItem('uzivatelPrihlasen', 'true');
            localStorage.setItem('jmenoUzivatele', jmenoInput.value || 'Uživatel');
            
            // Přesměrování na stránku "proč"
            window.location.href = 'proc.html';
        }
    });
}

// =========================================================================
// 5. DYNAMICKÉ MENU (LOGIN -> JMÉNO) A ODHLAŠOVÁNÍ (Běží na všech stránkách)
// =========================================================================
document.addEventListener("DOMContentLoaded", function() {
    const jePrihlasen = localStorage.getItem('uzivatelPrihlasen');
    const jmeno = localStorage.getItem('jmenoUzivatele');
    
    // Vyhledání odkazu na Login v navigačním menu
    const menuLinks = document.querySelectorAll('.menu a');
    let loginLink = null;
    
    menuLinks.forEach(link => {
        if (link.getAttribute('href') === 'login.html' || link.textContent.trim() === 'Login') {
            loginLink = link;
        }
    });

    // Pokud je uživatel přihlášen, změníme Login na jméno s rozbalovacím menu
    if (loginLink && jePrihlasen === 'true' && jmeno) {
        const liElement = loginLink.parentElement;
        
        // Nastavíme relativní pozici kvůli správnému vykreslení dropdownu
        liElement.style.position = 'relative';
        
        // Přepíšeme HTML vnitřku <li>, vložíme šipku dolů ke jménu
        liElement.innerHTML = `
            <a href="#" id="user-menu-toggle" style="cursor: pointer;">${escapeHTML(jmeno)} ▾</a>
            <div id="logout-dropdown" style="display: none; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); width: 120px; background: #283618; border: 2px solid black; border-radius: 8px; z-index: 1000; text-align: center; box-shadow: 0px 4px 8px rgba(0,0,0,0.3);">
                <a href="#" id="btn-odhlasit" style="padding: 10px; color: white; display: block; text-decoration: none; font-size: 1rem;">Odhlásit se</a>
            </div>
        `;

        const toggleBtn = document.getElementById('user-menu-toggle');
        const dropdown = document.getElementById('logout-dropdown');
        const logoutBtn = document.getElementById('btn-odhlasit');

        // Kliknutí na uživatelské jméno otevře/zavře možnost odhlášení
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        // Kliknutí na tlačítko "Odhlásit se" vymaže data a obnoví web
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('uzivatelPrihlasen');
            localStorage.removeItem('jmenoUzivatele');
            window.location.reload(); 
        });

        // Zavření dropdown menu, pokud uživatel klikne kamkoliv mimo něj
        window.addEventListener('click', function(e) {
            if (!liElement.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }
});

// =========================================================================
// 6. ŽIVÉ HODNOCENÍ A BLOKACE PRO NEPŘIHLÁŠENÉ / DUPLICITNÍ (Spouští se na proc.html)
// =========================================================================
const formHodnoceni = document.querySelector('.hodnoceni-container');
const posuvnik = document.getElementById('hodnoceni');
const vystup = document.getElementById('aktualni-hodnota');
const inputJmeno = document.getElementById('skryte-jmeno'); 

if (formHodnoceni && posuvnik && vystup) {
    const jmeno = localStorage.getItem('jmenoUzivatele') || '';
    const uzHlasoval = localStorage.getItem('hlasoval_' + jmeno);
    const upozorneni = document.getElementById('prihlaseni-upozorneni');

    // Nastavení vzhledu upozornění
    if (upozorneni) {
        upozorneni.style.color = '#ff4500';
        upozorneni.style.fontWeight = 'bold';
        upozorneni.style.marginTop = '15px';
    }

    // Živé zobrazování hodnoty na slideru funguje vždy
    vystup.innerText = posuvnik.value;
    posuvnik.addEventListener('input', function() {
        vystup.innerText = this.value;
    });

    // Zápis jména do skrytého inputu, pokud existuje
    if (jmeno && inputJmeno) {
        inputJmeno.value = jmeno;
    }

    // Hlavní kontrola při pokusu o odeslání
    formHodnoceni.addEventListener('submit', function(e) {
        const aktualniJmeno = localStorage.getItem('jmenoUzivatele') || '';
        const jePrihlasen = localStorage.getItem('uzivatelPrihlasen');
        const uzHlasovalKontrola = localStorage.getItem('hlasoval_' + aktualniJmeno);

        // 1. KROK: Kontrola, zda uživatelské jméno vůbec existuje / je přihlášen
        if (jePrihlasen !== 'true' || aktualniJmeno.trim() === '') {
            e.preventDefault(); // Zastaví odeslání do FormSubmit
            if (upozorneni) {
                upozorneni.innerText = 'Chyba: Pro odeslání hodnocení musíte mít zadané uživatelské jméno (přihlaste se)!';
                upozorneni.style.display = 'block';
            }
            return;
        }

        // 2. KROK: Kontrola duplicity
        if (uzHlasovalKontrola === 'true') {
            e.preventDefault(); // Zastaví odeslání do FormSubmit
            if (upozorneni) {
                upozorneni.innerText = 'Z tohoto účtu (' + aktualniJmeno + ') již bylo hodnocení odesláno!';
                upozorneni.style.display = 'block';
            }
            return;
        }

        // Pokud prošel oběma kroky, uložíme informaci o hlasování a formulář se odešle
        localStorage.setItem('hlasoval_' + aktualniJmeno, 'true');
    });
}