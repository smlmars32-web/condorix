// Parallax Scroll Effect (Firewatch-style)
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxHeight = window.innerHeight;
    
    // Only apply parallax effect in the hero section
    if (scrolled <= parallaxHeight) {
        const sky = document.getElementById('sky');
        const mountainsBack = document.getElementById('mountains-back');
        const mountainsMid = document.getElementById('mountains-mid');
        const mountainsFront = document.getElementById('mountains-front');
        const trees = document.getElementById('trees');
        const heroLogo = document.getElementById('heroLogo');
        const heroTitle = document.getElementById('heroTitle');
        const heroSubtitle = document.getElementById('heroSubtitle');
        const scrollIndicator = document.getElementById('scrollIndicator');
        
        // Different speeds for each layer (Firewatch effect)
        if (sky) sky.style.transform = `translateY(${scrolled * 0.1}px)`;
        if (mountainsBack) mountainsBack.style.transform = `translateY(${scrolled * 0.3}px)`;
        if (mountainsMid) mountainsMid.style.transform = `translateY(${scrolled * 0.5}px)`;
        if (mountainsFront) mountainsFront.style.transform = `translateY(${scrolled * 0.7}px)`;
        if (trees) trees.style.transform = `translateY(${scrolled * 0.9}px)`;
        
        // Fade out content as we scroll
        const opacity = 1 - (scrolled / parallaxHeight) * 1.5;
        if (heroLogo) heroLogo.style.opacity = opacity;
        if (heroTitle) heroTitle.style.opacity = opacity;
        if (heroSubtitle) heroSubtitle.style.opacity = opacity;
        if (scrollIndicator) scrollIndicator.style.opacity = opacity;
        
        // Move content up faster
        if (heroLogo) heroLogo.style.transform = `translateY(${scrolled * 0.5}px)`;
        if (heroTitle) heroTitle.style.transform = `translateY(${scrolled * 0.5}px)`;
        if (heroSubtitle) heroSubtitle.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick, { passive: true });

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (window.pageYOffset > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, { passive: true });

// Smooth scroll on click
document.addEventListener('DOMContentLoaded', () => {
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
});

// Cookie Banner functionaliteit
function acceptAllCookies() {
    localStorage.setItem('cookieConsent', 'all');
    hideCookieBanner();
}

function acceptNecessaryCookies() {
    localStorage.setItem('cookieConsent', 'necessary');
    hideCookieBanner();
}

function hideCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    banner.style.animation = 'slideDown 0.5s ease-out';
    setTimeout(() => {
        banner.classList.add('hidden');
    }, 500);
}

// Check of gebruiker al cookie consent heeft gegeven
window.addEventListener('load', () => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
        document.getElementById('cookieBanner').classList.add('hidden');
    }
    
    // Check if user is logged in
    updateAccountButton();
});

// =============================================
// LEGO GALERIJ SYSTEEM � Supabase
// =============================================

const SUPABASE_URL  = 'https://bpmbqjhctxqgtsouzcqs.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwbWJxamhjdHhxZ3Rzb3V6Y3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjY2NDUsImV4cCI6MjA5MDY0MjY0NX0.bBuMvsPrGc5pkf2NJD00OnOuIpRxt0AXqHpGFkv5Wc8';
const STORAGE_BUCKET = 'lego-photos';

async function sbSelect(filter) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/lego_photos?${filter}&select=*`, {
        headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}` }
    });
    return r.ok ? await r.json() : [];
}
async function sbInsert(data) {
    console.log('Inserting to database:', data);
    const r = await fetch(`${SUPABASE_URL}/rest/v1/lego_photos`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify(data)
    });
    if (!r.ok) {
        const error = await r.text();
        console.error('Database insert failed:', error);
    }
    return r.ok;
}
async function sbUpdate(id, data) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/lego_photos?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify(data)
    });
    return r.ok;
}
async function sbDelete(id) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/lego_photos?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}` }
    });
    return r.ok;
}

// Supabase Storage functies
async function uploadToStorage(file, fileName) {
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${fileName}`, {
        method: 'POST',
        headers: { 
            'apikey': SUPABASE_ANON, 
            'Authorization': `Bearer ${SUPABASE_ANON}`,
            'cache-control': '3600',
            'content-type': 'image/jpeg'
        },
        body: file
    });
    if (r.ok) {
        return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${fileName}`;
    }
    const error = await r.text();
    console.error('Upload failed:', error);
    return null;
}

async function deleteFromStorage(fileName) {
    if (!fileName) return false;
    const files = [fileName]; // Supabase verwacht een array
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}`, {
        method: 'DELETE',
        headers: { 
            'apikey': SUPABASE_ANON, 
            'Authorization': `Bearer ${SUPABASE_ANON}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prefixes: files })
    });
    if (!r.ok) {
        const error = await r.text();
        console.error('Storage delete failed:', error);
    }
    return r.ok;
}

// Verklein afbeelding v��r opslag (max 800�600, JPEG kwaliteit 75%)
function resizeImage(file) {
    return new Promise(resolve => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            const ratio = Math.min(800 / img.width, 600 / img.height, 1);
            const canvas = document.createElement('canvas');
            canvas.width  = Math.round(img.width  * ratio);
            canvas.height = Math.round(img.height * ratio);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.75);
        };
        img.src = url;
    });
}

function isSven() {
    const user = getCurrentUser();
    return user &&
        user.email.toLowerCase() === 'svenbaedegroot@gmail.com' &&
        user.name.toLowerCase()  === 'sven de groot';
}

async function loadApprovedGallery() {
    return await sbSelect('status=eq.approved');
}

// --- Bezoeker: foto insturen ---
function openLegoUpload() {
    openModal(`
        <h2>&#129507; Stuur je LEGO-foto in</h2>
        <p style="margin-bottom:20px;">Heb jij een gaaf LEGO-dier gebouwd? Stuur je foto in en kom in de galerij!</p>
        <div class="modal-form">
            <div>
                <label style="font-weight:600;display:block;margin-bottom:6px;">Jouw naam</label>
                <input type="text" id="legoUploaderName" placeholder="Bijv. Emma" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:1rem;">
            </div>
            <div>
                <label style="font-weight:600;display:block;margin-bottom:6px;">Foto selecteren</label>
                <input type="file" id="legoFileInput" accept="image/*" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;">
            </div>
            <div id="legoPreviewBox" style="display:none;text-align:center;margin-top:8px;">
                <img id="legoPreviewImg" style="max-width:100%;max-height:200px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
            </div>
            <p id="legoUploadMsg" style="color:green;display:none;font-weight:600;"></p>
            <div style="display:flex;gap:12px;">
                <button class="btn-cta" id="legoSubmitBtn" onclick="submitLegoPhoto()">Insturen</button>
                <button class="btn-secondary" onclick="openLegoGallery()">Annuleren</button>
            </div>
        </div>
        <script>
            document.getElementById('legoFileInput').addEventListener('change', function() {
                const file = this.files[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = e => { document.getElementById('legoPreviewImg').src = e.target.result; document.getElementById('legoPreviewBox').style.display = 'block'; };
                reader.readAsDataURL(file);
            });
        <\/script>
    `);
}

async function submitLegoPhoto() {
    const name      = document.getElementById('legoUploaderName').value.trim();
    const fileInput = document.getElementById('legoFileInput');
    const msg       = document.getElementById('legoUploadMsg');
    const btn       = document.getElementById('legoSubmitBtn');
    if (!name)               { alert('Vul je naam in!');     return; }
    if (!fileInput.files[0]) { alert('Selecteer een foto!'); return; }
    if (btn) { btn.textContent = 'Bezig...'; btn.disabled = true; }
    
    const resizedBlob = await resizeImage(fileInput.files[0]);
    const timestamp = Date.now();
    const fileName = `lego_${timestamp}_${name.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
    
    console.log('Uploading to Storage:', fileName);
    const imageUrl = await uploadToStorage(resizedBlob, fileName);
    console.log('Upload result:', imageUrl);
    
    if (!imageUrl) {
        if (btn) { btn.textContent = 'Insturen'; btn.disabled = false; }
        alert('Uploaden naar Storage mislukt. Check console voor details. Controleer of de "lego-photos" bucket bestaat en publiek is.');
        return;
    }
    
    const date = new Date().toLocaleDateString('nl-NL');
    const ok = await sbInsert({ 
        name, 
        date, 
        src: imageUrl,  // Voor backward compatibility (verplicht veld)
        image_url: imageUrl, 
        file_name: fileName, 
        status: 'approved'  // Meteen goedgekeurd, geen moderatie nodig
    });
    
    if (ok) {
        msg.textContent = 'Gelukt! Je foto staat nu in de galerij! ??';
        msg.style.display = 'block';
        document.getElementById('legoUploaderName').value = '';
        fileInput.value = '';
        document.getElementById('legoPreviewBox').style.display = 'none';
        setTimeout(() => openLegoGallery(), 2000);
    } else {
        // Als database insert faalt, verwijder de ge�ploade foto
        await deleteFromStorage(fileName);
        if (btn) { btn.textContent = 'Insturen'; btn.disabled = false; }
        alert('Database opslag mislukt. Probeer het opnieuw.');
    }
}

// --- Galerij ---
async function openLegoGallery() {
    const adminBtn = isSven() ? `<button class="btn-secondary" onclick="openLegoBeheer()">&#128274; Beheer foto\'s</button>` : '';
    openModal(`
        <h2>LEGO Galerij</h2>
        <p style="text-align:center;padding:30px 0;color:#888;">Galerij laden...</p>
        <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap;">
            <button class="btn-cta" onclick="openLegoUpload()">&#128247; Stuur jouw foto in</button>
            ${adminBtn}
            <button class="btn-secondary" onclick="closeModal()">Sluiten</button>
        </div>
    `);
    const mc = document.querySelector('.modal-content');
    if (mc) { mc.style.maxWidth = '800px'; mc.style.width = '92vw'; }
    const photos = await loadApprovedGallery();
    const grid = photos.length === 0
        ? `<p style="text-align:center;color:#888;padding:30px 0;">Nog geen foto\'s in de galerij. Stuur als eerste jouw LEGO-dier in!</p>`
        : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;">` +
          photos.map(p => `
            <div style="border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.12);background:#fff;">
                <img src="${p.image_url || p.src}" style="width:100%;height:130px;object-fit:cover;display:block;" loading="lazy">
                <div style="padding:8px;font-size:0.85rem;color:#555;text-align:center;"><strong>${p.name}</strong><br>${p.date}</div>
            </div>`).join('') + `</div>`;
    const mb = document.getElementById('modalBody');
    if (mb) mb.innerHTML = `
        <h2>LEGO Galerij</h2>
        <p style="margin-bottom:16px;">Bekijk alle ingestuurde LEGO-creaties van onze bezoekers!</p>
        ${grid}
        <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;">
            <button class="btn-cta" onclick="openLegoUpload()">&#128247; Stuur jouw foto in</button>
            ${adminBtn}
            <button class="btn-secondary" onclick="closeModal()">Sluiten</button>
        </div>`;
}

// --- Sven: beheerpaneel ---
async function openLegoBeheer() {
    if (!isSven()) return;
    openModal(`<h2>&#128274; Beheer LEGO Galerij</h2><p style="text-align:center;padding:30px 0;color:#888;">Laden...</p>`);
    const mc = document.querySelector('.modal-content');
    if (mc) { mc.style.maxWidth = '700px'; mc.style.width = '92vw'; }
    const [pending, approved] = await Promise.all([
        sbSelect('status=eq.pending'),
        sbSelect('status=eq.approved')
    ]);
    const pendingHTML = pending.length === 0
        ? '<p style="color:#888;">Geen foto\'s wachtend op goedkeuring.</p>'
        : pending.map(p => `
            <div style="display:flex;gap:12px;align-items:center;padding:10px;background:#f9f9f9;border-radius:8px;margin-bottom:8px;">
                <img src="${p.image_url || p.src}" style="width:70px;height:70px;object-fit:cover;border-radius:6px;flex-shrink:0;">
                <div style="flex:1;"><strong>${p.name}</strong> &mdash; ${p.date}</div>
                <button class="btn-cta"       style="padding:6px 12px;font-size:0.85rem;" onclick="approveLegoPhoto('${p.id}')">&#10003; Goedkeuren</button>
                <button class="btn-secondary" style="padding:6px 12px;font-size:0.85rem;" onclick="deletePendingPhoto('${p.id}', '${p.file_name || ''}')">&#10005; Weggooien</button>
            </div>`).join('');
    const approvedHTML = approved.length === 0
        ? '<p style="color:#888;">Nog geen goedgekeurde foto\'s.</p>'
        : approved.map(p => `
            <div style="display:flex;gap:12px;align-items:center;padding:10px;background:#f0fff4;border-radius:8px;margin-bottom:8px;">
                <img src="${p.image_url || p.src}" style="width:70px;height:70px;object-fit:cover;border-radius:6px;flex-shrink:0;">
                <div style="flex:1;"><strong>${p.name}</strong> &mdash; ${p.date}</div>
                <button class="btn-secondary" style="padding:6px 12px;font-size:0.85rem;" onclick="deleteApprovedPhoto('${p.id}', '${p.file_name || ''}')">&#10005; Verwijderen</button>
            </div>`).join('');
    const mb = document.getElementById('modalBody');
    if (mb) mb.innerHTML = `
        <h2>&#128274; Beheer LEGO Galerij</h2>
        <h3 style="margin:16px 0 8px;color:var(--primary-color);">Wachtend op goedkeuring (${pending.length})</h3>
        ${pendingHTML}
        <h3 style="margin:20px 0 8px;color:var(--primary-color);">Goedgekeurd (${approved.length})</h3>
        ${approvedHTML}
        <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">
            <button class="btn-secondary" onclick="openLegoGallery()">Terug naar galerij</button>
        </div>`;
}

async function approveLegoPhoto(id) {
    await sbUpdate(id, { status: 'approved' });
    openLegoBeheer();
}

async function deletePendingPhoto(id, fileName) {
    if (!confirm('Weet je zeker dat je deze foto wilt weggooien?')) return;
    if (fileName) await deleteFromStorage(fileName);
    await sbDelete(id);
    openLegoBeheer();
}

async function deleteApprovedPhoto(id, fileName) {
    if (!confirm('Weet je zeker dat je deze foto wilt verwijderen?')) return;
    if (fileName) await deleteFromStorage(fileName);
    await sbDelete(id);
    openLegoBeheer();
}


// Account Management Functions
function getCurrentUser() {
    const userSession = localStorage.getItem('currentUser');
    return userSession ? JSON.parse(userSession) : null;
}

function getAllUsers() {
    const users = localStorage.getItem('condorixUsers');
    return users ? JSON.parse(users) : [];
}

function saveUser(userData) {
    const users = getAllUsers();
    users.push(userData);
    localStorage.setItem('condorixUsers', JSON.stringify(users));
}

function updateUser(email, updatedData) {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        localStorage.setItem('condorixUsers', JSON.stringify(users));
        
        // Update current session if it's the logged in user
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.email === email) {
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
    }
}

function loginUser(email, password) {
    const users = getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    updateAccountButton();
    location.reload();
}

function updateAccountButton() {
    const user = getCurrentUser();
    const button = document.getElementById('accountButton');
    if (button && user) {
        button.textContent = user.name;
    }
}

function addReservationToUser(email, reservation) {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        if (!users[userIndex].reservations) {
            users[userIndex].reservations = [];
        }
        users[userIndex].reservations.push(reservation);
        localStorage.setItem('condorixUsers', JSON.stringify(users));
        
        // Update current session
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.email === email) {
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
    }
}

// Scroll naar booking sectie
function scrollToBooking() {
    openTicketModal();
}

// Modal functionaliteit
function openModal(content) {
    const modalBody = document.getElementById('modalBody');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.maxWidth = '';
        modalContent.style.width = '';
    }
    modalBody.innerHTML = content;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Ticket Modal
function openTicketModal() {
    const currentUser = getCurrentUser();
    const userEmail = currentUser ? currentUser.email : '';
    
    const content = `
        <h2>??? Bestel Tickets</h2>
        <p>Kies je tickets en profiteer van onze Early Bird korting!</p>
        
        <div class="price-card">
            <h3>Early Bird Ticket (7+ dagen vooruit)</h3>
            <p class="price">�15,00</p>
            <p>Normale prijs: �18,00 | Bespaar �3,00!</p>
        </div>
        
        <div class="price-card">
            <h3>Standaard Ticket</h3>
            <p class="price">�18,00</p>
            <p>Voor bezoek binnen 7 dagen</p>
        </div>
        
        <div class="price-card">
            <h3>Kind Ticket (3-12 jaar)</h3>
            <p class="price">�12,00</p>
            <p>Kinderen tot 3 jaar gratis!</p>
        </div>
        
        <form class="modal-form" onsubmit="submitTicketForm(event)">
            <div class="form-group">
                <label>Kies je bezoekdatum:</label>
                <input type="date" name="date" required min="${getMinDate()}">
            </div>
            
            <div class="form-group">
                <label>Aantal volwassenen:</label>
                <input type="number" name="adults" min="0" value="2" required>
            </div>
            
            <div class="form-group">
                <label>Aantal kinderen (3-12 jaar):</label>
                <input type="number" name="children" min="0" value="0" required>
            </div>
            
            <div class="form-group">
                <label>Email:</label>
                <input type="email" name="email" required placeholder="jouw@email.nl" value="${userEmail}">
            </div>
            
            <button type="submit" class="btn-cta">Bereken Prijs & Reserveer</button>
        </form>
    `;
    openModal(content);
}

function getMinDate() {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
}

function submitTicketForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const date = new Date(formData.get('date'));
    const today = new Date();
    const daysAhead = Math.floor((date - today) / (1000 * 60 * 60 * 24));
    
    const adults = parseInt(formData.get('adults'));
    const children = parseInt(formData.get('children'));
    const email = formData.get('email');
    
    const isEarlyBird = daysAhead >= 7;
    const adultPrice = isEarlyBird ? 15 : 18;
    const childPrice = 12;
    
    const totalPrice = (adults * adultPrice) + (children * childPrice);
    const savings = isEarlyBird ? adults * 3 : 0;
    
    // Save reservation to user account if logged in
    const currentUser = getCurrentUser();
    const reservation = {
        date: date.toLocaleDateString('nl-NL'),
        adults: adults,
        children: children,
        totalPrice: totalPrice,
        isEarlyBird: isEarlyBird,
        savings: savings,
        bookedOn: new Date().toLocaleDateString('nl-NL')
    };
    
    if (currentUser) {
        addReservationToUser(currentUser.email, reservation);
    }
    
    const confirmContent = `
        <h2>? Reservering Bevestigd!</h2>
        <div class="info-box">
            <h3>Jouw Reservering</h3>
            <p><strong>Datum:</strong> ${date.toLocaleDateString('nl-NL')}</p>
            <p><strong>Volwassenen:</strong> ${adults} � �${adultPrice} = �${adults * adultPrice}</p>
            <p><strong>Kinderen:</strong> ${children} � �${childPrice} = �${children * childPrice}</p>
            ${isEarlyBird ? `<p style="color: var(--accent-color);"><strong>?? Early Bird Korting: -�${savings}</strong></p>` : ''}
            <p style="font-size: 1.5rem; color: var(--primary-color);"><strong>Totaal: �${totalPrice}</strong></p>
        </div>
        <p>Een bevestigingsmail is verstuurd naar <strong>${email}</strong></p>
        ${currentUser ? '<p style="color: var(--primary-color);">? Deze reservering is opgeslagen in je account!</p>' : ''}
        <p>We kijken ernaar uit je te verwelkomen bij Condorix! ??</p>
        <button class="btn-cta" onclick="closeModal()">Sluiten</button>
    `;
    openModal(confirmContent);
}

// Reservation Modal
function openReservationModal() {
    openTicketModal(); // Zelfde als ticket modal
}

// Account Modal
function openAccountModal() {
    const user = getCurrentUser();
    
    if (user) {
        // Show user dashboard if logged in
        const reservations = user.reservations || [];
        let reservationsList = '';
        
        if (reservations.length > 0) {
            reservationsList = reservations.map(r => `
                <div style="padding: 15px; background: rgba(255,255,255,0.5); border-radius: 8px; margin-bottom: 10px;">
                    <p><strong>?? ${r.date}</strong></p>
                    <p>Volwassenen: ${r.adults} | Kinderen: ${r.children}</p>
                    <p>Totaal: �${r.totalPrice} ${r.isEarlyBird ? '(Early Bird ?)' : ''}</p>
                    <p style="font-size: 0.9rem; color: #666;">Geboekt op: ${r.bookedOn}</p>
                </div>
            `).join('');
        } else {
            reservationsList = '<p style="color: #666; font-style: italic;">Je hebt nog geen reserveringen.</p>';
        }
        
        const content = `
            <h2>?? Welkom, ${user.name}!</h2>
            <div class="info-box">
                <h3>Account Gegevens</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                ${user.phone ? `<p><strong>Telefoon:</strong> ${user.phone}</p>` : ''}
            </div>
            
            <div class="info-box">
                <h3>Mijn Reserveringen</h3>
                ${reservationsList}
            </div>
            
            <button class="btn-cta" onclick="openTicketModal()">Nieuwe Reservering</button>
            <button class="btn-secondary" onclick="logoutUser()">Uitloggen</button>
        `;
        openModal(content);
    } else {
        // Show login form if not logged in
        const content = `
            <h2>?? Mijn Account</h2>
            <p>Log in of maak een account aan om je reserveringen te beheren.</p>
            
            <form class="modal-form" onsubmit="submitLogin(event)">
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" required placeholder="jouw@email.nl">
                </div>
                
                <div class="form-group">
                    <label>Wachtwoord:</label>
                    <input type="password" name="password" required placeholder="��������">
                </div>
                
                <button type="submit" class="btn-cta">Inloggen</button>
                <button type="button" class="btn-secondary" onclick="showRegistration()">Account Aanmaken</button>
            </form>
            
            <p style="text-align: center; margin-top: 15px;">
                <a href="#" onclick="showPasswordReset(); return false;" style="color: var(--primary-color);">Wachtwoord vergeten?</a>
            </p>
        `;
        openModal(content);
    }
}

function submitLogin(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    if (loginUser(email, password)) {
        updateAccountButton();
        const content = `
            <h2>? Welkom Terug!</h2>
            <p>Je bent succesvol ingelogd!</p>
            <button class="btn-cta" onclick="closeModal(); openAccountModal();">Bekijk Mijn Account</button>
        `;
        openModal(content);
    } else {
        alert('Onjuiste inloggegevens. Controleer je email en wachtwoord.');
    }
}

function showRegistration() {
    const content = `
        <h2>?? Account Aanmaken</h2>
        <form class="modal-form" onsubmit="submitRegistration(event)">
            <div class="form-group">
                <label>Naam:</label>
                <input type="text" name="name" required placeholder="Voor- en achternaam">
            </div>
            
            <div class="form-group">
                <label>Email:</label>
                <input type="email" name="email" required placeholder="jouw@email.nl">
            </div>
            
            <div class="form-group">
                <label>Wachtwoord:</label>
                <input type="password" name="password" required placeholder="��������">
            </div>
            
            <div class="form-group">
                <label>Telefoonnummer:</label>
                <input type="tel" name="phone" placeholder="+31 6 12345678">
            </div>
            
            <button type="submit" class="btn-cta">Account Aanmaken</button>
        </form>
    `;
    openModal(content);
}

function submitRegistration(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const phone = event.target.phone.value;
    
    // Check if user already exists
    const users = getAllUsers();
    if (users.find(u => u.email === email)) {
        alert('Een account met dit emailadres bestaat al. Probeer in te loggen.');
        return;
    }
    
    // Create new user
    const userData = {
        name: name,
        email: email,
        password: password,
        phone: phone,
        reservations: [],
        createdAt: new Date().toISOString()
    };
    
    saveUser(userData);
    
    // Auto login the new user
    localStorage.setItem('currentUser', JSON.stringify(userData));
    updateAccountButton();
    
    const content = `
        <h2>?? Account Aangemaakt!</h2>
        <p>Welkom ${name}! Je account is succesvol aangemaakt en je bent ingelogd.</p>
        <p>Je kunt nu reserveringen maken en al je bezoeken beheren in je account.</p>
        <button class="btn-cta" onclick="closeModal()">Begin met Reserveren</button>
    `;
    openModal(content);
}

function showPasswordReset() {
    const content = `
        <h2>?? Wachtwoord Herstellen</h2>
        <p>Voer je emailadres in en we sturen je een link om je wachtwoord opnieuw in te stellen.</p>
        
        <form class="modal-form" onsubmit="submitPasswordReset(event)">
            <div class="form-group">
                <label>Email:</label>
                <input type="email" name="email" required placeholder="jouw@email.nl">
            </div>
            
            <button type="submit" class="btn-cta">Herstel Link Verzenden</button>
        </form>
    `;
    openModal(content);
}

function submitPasswordReset(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const content = `
        <h2>?? Email Verzonden</h2>
        <p>We hebben een herstel link gestuurd naar <strong>${email}</strong></p>
        <p>Controleer je inbox en volg de instructies om je wachtwoord opnieuw in te stellen.</p>
        <button class="btn-cta" onclick="closeModal()">Sluiten</button>
    `;
    openModal(content);
}

// Contact Modal
function openContactModal() {
    const content = `
        <h2>?? Contact</h2>
        <div class="info-box">
            <h3>Bezoekadres</h3>
            <p>Condorix Park 1<br>3911 AB Doorn</p>
        </div>
        
        <div class="info-box">
            <h3>Contactgegevens</h3>
            <p>?? Telefoon: 0317 - 650 200</p>
            <p>?? Email: info@condorix.nl</p>
            <p>?? Ma-Vr: 09:00 - 17:00</p>
        </div>
        
        <form id="contactForm" class="modal-form" onsubmit="submitContactForm(event)">
            <h3>Stel je vraag</h3>
            
            <div class="form-group">
                <label>Naam:</label>
                <input type="text" name="name" id="contactName" required>
            </div>
            
            <div class="form-group">
                <label>Email:</label>
                <input type="email" name="email" id="contactEmail" required>
            </div>
            
            <div class="form-group">
                <label>Onderwerp:</label>
                <select name="subject" id="contactSubject" required>
                    <option value="">Kies een onderwerp...</option>
                    <option value="Algemene vraag">Algemene vraag</option>
                    <option value="Tickets & reserveringen">Tickets & reserveringen</option>
                    <option value="Groepen & evenementen">Groepen & evenementen</option>
                    <option value="Anders">Anders</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Bericht:</label>
                <textarea name="message" id="contactMessage" rows="5" required></textarea>
            </div>
            
            <button type="submit" class="btn-cta">Verzenden</button>
        </form>
    `;
    openModal(content);
}

function submitContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Maak email body met alle informatie
    const emailBody = 
        `CONDORIX CONTACTFORMULIER\n\n` +
        `Naam: ${name}\n` +
        `Email: ${email}\n` +
        `Onderwerp: ${subject}\n\n` +
        `Bericht:\n${message}\n\n` +
        `------------------------\n` +
        `Verzonden via Condorix Website`;
    
    const emailSubject = `Condorix - ${subject}`;
    
    // Open Gmail compose scherm
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=svendegroot@wereldkidz.nl&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open in nieuw tabblad
    window.open(gmailLink, '_blank');
    
    // Toon gebruikersvriendelijke instructie
    setTimeout(() => {
        const content = `
            <h2>?? Gmail Geopend</h2>
            <p>Er is een nieuw Gmail tabblad geopend met je bericht voorbereid voor Condorix.</p>
            <div class="info-box" style="background: #e8f4f8; border-left: 4px solid #4f7d4a; padding: 15px; margin: 15px 0;">
                <p style="margin: 0 0 10px 0; font-weight: 600;">? Wat er in je Gmail staat:</p>
                <ul style="margin: 0; padding-left: 20px; text-align: left;">
                    <li>Naar: svendegroot@wereldkidz.nl</li>
                    <li>Onderwerp: ${subject}</li>
                    <li>Je volledige bericht met naam en email</li>
                </ul>
            </div>
            <div class="info-box" style="background: #fff3cd; padding: 15px; margin: 15px 0;">
                <p style="margin: 0;"><strong>?? Laatste stap:</strong> Klik in het Gmail tabblad op de blauwe <strong>"Verzenden"</strong> knop.</p>
            </div>
            <button class="btn-cta" onclick="closeModal()">Begrepen</button>
        `;
        openModal(content);
    }, 500);
}

// FAQ Modal
function openFAQModal() {
    const content = `
        <h2>? Veelgestelde Vragen</h2>
        
        <div class="info-box">
            <h3>Wat zijn de openingstijden?</h3>
            <p>We zijn dagelijks open van 09:00 tot 18:00 uur (laatste toegang 17:00 uur). In de zomermaanden zijn we langer open tot 19:00 uur.</p>
        </div>
        
        <div class="info-box">
            <h3>Kan ik mijn ticket annuleren?</h3>
            <p>Early Bird tickets kunnen helaas niet geannuleerd of verzet worden. Standaard tickets kunnen tot 24 uur voor je bezoek kosteloos worden verzet.</p>
        </div>
        
        <div class="info-box">
            <h3>Is er parkeergelegenheid?</h3>
            <p>Ja, we hebben ruime gratis parkeergelegenheid direct naast de ingang. Er zijn ook speciale parkeerplaatsen voor mindervaliden.</p>
        </div>
        
        <div class="info-box">
            <h3>Mag ik mijn hond meenemen?</h3>
            <p>Helaas zijn honden niet toegestaan in het park, met uitzondering van gecertificeerde assistentiehonden.</p>
        </div>
        
        <div class="info-box">
            <h3>Is er eten en drinken verkrijgbaar?</h3>
            <p>Ja, we hebben meerdere restaurants en kiosken waar je terecht kunt voor een hapje en een drankje. Je mag ook je eigen eten en drinken meenemen.</p>
        </div>
        
        <button class="btn-cta" onclick="openContactModal()">Andere Vraag?</button>
    `;
    openModal(content);
}

// Newsletter Modal
function openNewsletterModal() {
    const content = `
        <h2>?? Nieuwsbrief</h2>
        <p>Blijf op de hoogte van al het nieuws, speciale aanbiedingen en evenementen!</p>
        
        <form class="modal-form" onsubmit="submitNewsletter(event)">
            <div class="form-group">
                <label>Naam:</label>
                <input type="text" name="name" required>
            </div>
            
            <div class="form-group">
                <label>Email:</label>
                <input type="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" required>
                    Ik ga akkoord met het <a href="#" onclick="openInfoModal('privacy'); return false;">privacybeleid</a>
                </label>
            </div>
            
            <button type="submit" class="btn-cta">Aanmelden</button>
        </form>
    `;
    openModal(content);
}

function submitNewsletter(event) {
    event.preventDefault();
    const content = `
        <h2>?? Welkom bij onze nieuwsbrief!</h2>
        <p>Je bent succesvol aangemeld. Je ontvangt binnenkort je eerste nieuwsbrief met exclusieve aanbiedingen!</p>
        <button class="btn-cta" onclick="closeModal()">Sluiten</button>
    `;
    openModal(content);
}

// Info Modals
function openInfoModal(type) {
    let content = '';
    
    if (type === 'openingstijden') {
        content = `
            <h2>?? Openingstijden</h2>
            <div class="info-box">
                <h3>Reguliere Openingstijden</h3>
                <p><strong>Maandag - Zondag:</strong> 09:00 - 18:00 uur</p>
                <p><strong>Laatste toegang:</strong> 17:00 uur</p>
            </div>
            
            <div class="info-box">
                <h3>Zomermaanden (mei - augustus)</h3>
                <p><strong>Maandag - Zondag:</strong> 09:00 - 19:00 uur</p>
                <p><strong>Laatste toegang:</strong> 18:00 uur</p>
            </div>
            
            <div class="info-box">
                <h3>Feestdagen</h3>
                <p>Ook op feestdagen zijn we geopend tijdens de reguliere openingstijden.</p>
                <p><strong>Let op:</strong> Met Kerst (25 & 26 december) zijn we gesloten.</p>
            </div>
            
            <button class="btn-cta" onclick="openTicketModal()">Tickets Bestellen</button>
        `;
    } else if (type === 'parkeren') {
        content = `
            <h2>?? Parkeren</h2>
            <div class="info-box">
                <h3>Gratis Parkeren</h3>
                <p>We hebben ruime gratis parkeergelegenheid direct bij de ingang.</p>
            </div>
            
            <div class="info-box">
                <h3>Faciliteiten</h3>
                <p>? 500+ gratis parkeerplaatsen</p>
                <p>? Mindervaliden parkeerplaatsen</p>
                <p>? Bushalte op 5 minuten loopafstand</p>
                <p>? Fietsenstalling</p>
            </div>
            
            <div class="info-box">
                <h3>Routebeschrijving</h3>
                <p><strong>Adres:</strong> Condorix Park 1, 3911 AB Doorn</p>
                <p>Volg de bordjes "Condorix" vanaf de A12</p>
            </div>
            
            <button class="btn-cta" onclick="openMapModal()">Bekijk Plattegrond</button>
        `;
    } else if (type === 'privacy') {
        content = `
            <h2>?? Privacybeleid</h2>
            <p>Condorix respecteert je privacy en gaat zorgvuldig om met je persoonlijke gegevens.</p>
            
            <div class="info-box">
                <h3>Wat doen we met je gegevens?</h3>
                <p>� We gebruiken je gegevens alleen voor je reservering en communicatie</p>
                <p>� We delen je gegevens nooit met derden zonder toestemming</p>
                <p>� Je kunt altijd je gegevens inzien, wijzigen of verwijderen</p>
            </div>
            
            <div class="info-box">
                <h3>Cookies</h3>
                <p>We gebruiken functionele en analytische cookies om onze website te verbeteren. Je kunt je cookie voorkeuren altijd aanpassen.</p>
            </div>
            
            <p>Heb je vragen over privacy? <a href="#" onclick="openContactModal(); return false;">Neem contact op</a></p>
        `;
    }
    
    openModal(content);
}

// Map Modal
function openMapModal() {
    const content = `
        <h2>??? Plattegrond</h2>
        <p>Download onze interactieve plattegrond om je bezoek optimaal te plannen!</p>
        
        <div class="info-box">
            <h3>Op de plattegrond vind je:</h3>
            <p>? Alle attracties en belevenissen</p>
            <p>? Restaurants en kiosken</p>
            <p>? Toiletten en baby verzorgingsruimtes</p>
            <p>? EHBO posten</p>
            <p>? Picknickplaatsen</p>
        </div>
        
        <button class="btn-cta" onclick="alert('Plattegrond wordt gedownload!')">Download PDF</button>
        <button class="btn-secondary" onclick="closeModal()">Sluiten</button>
    `;
    openModal(content);
}

// Section Navigation
function showSection(section) {
    if (section === 'ontdek') {
        // Scroll naar de dieren sectie
        const animalsSection = document.getElementById('ontdek');
        if (animalsSection) {
            animalsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Sluit modal als deze open is
            closeModal();
        }
    } else if (section === 'kaart') {
        const content = `
            <h2>??? Plattegrond</h2>
            <div style="display: flex; gap: 24px; align-items: flex-start; flex-wrap: nowrap; margin: 20px 0;">
                <div style="flex: 1 1 0; min-width: 0;">
                    <img src="images/plattegrond.png" alt="Plattegrond Condorix" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.2); display: block;">
                </div>
                <div style="flex: 0 0 180px; min-width: 160px;">
                    <div class="info-box" style="margin: 0; padding: 16px;">
                        <h3 style="margin-bottom: 14px; font-size: 1rem;">Legenda</h3>
                        <p style="margin-bottom: 8px;">&#127860; <strong>Restaurant</strong></p>
                        <p style="margin-bottom: 8px;">&#128699; <strong>Toiletten</strong></p>
                        <p style="margin-bottom: 8px;">&#9855; <strong>Rolstoeltoegankelijk</strong></p>
                        <p style="margin-bottom: 8px;">&#127873; <strong>Souvenirshop</strong></p>
                        <p style="margin-bottom: 0;"><span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;background:#1565c0;color:#fff;border-radius:50%;font-size:0.75rem;font-weight:bold;margin-right:4px;">1</span> <strong>Speeltuin</strong></p>
                    </div>
                </div>
            </div>
            <button class="btn-cta" onclick="closeModal()">Sluiten</button>
        `;
        openModal(content);
        // Vergroot de modal NA openModal (anders wordt het gereset)
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.maxWidth = '92vw';
            modalContent.style.width = '92vw';
        }
    } else if (section === 'over') {
        const content = `
            <h2>OVER CONDORIX</h2>
            
            <div class="info-box" style="background: linear-gradient(135deg, rgba(212, 160, 23, 0.1), rgba(79, 125, 74, 0.1)); padding: 30px; border-radius: 8px; margin-bottom: 25px;">
                <h3 style="color: var(--primary-color); margin-bottom: 15px;">Onze Missie</h3>
                <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 15px;">
                    Bij Condorix staat het welzijn van onze dieren centraal. We doen goede dingen voor de dieren 
                    door hun verblijven zo natuurlijk en authentiek mogelijk te maken. Onze hokken zijn ontworpen 
                    om hun natuurlijke leefomgeving zo echt mogelijk na te bootsen, waarbij de veiligheid van zowel 
                    de dieren als onze bezoekers gewaarborgd blijft.
                </p>
                <p style="font-size: 1.1rem; line-height: 1.8;">
                    We geloven in een moderne dierentuin waar natuurbescherming, educatie en respect voor alle levende 
                    wezens hand in hand gaan.
                </p>
            </div>
            
            <div class="info-box">
                <h3 style="color: var(--primary-color); margin-bottom: 15px;">Ons Team</h3>
                <div style="padding: 15px; background: rgba(255,255,255,0.5); border-radius: 8px; margin-top: 15px;">
                    <p style="font-size: 1.2rem; font-weight: 600; color: var(--primary-color); margin-bottom: 5px;">
                        Sven de Groot
                    </p>
                    <p style="color: #666; font-style: italic;">Eigenaar & Directeur</p>
                </div>
            </div>
            
            <button class="btn-cta" onclick="closeModal()">Sluiten</button>
        `;
        openModal(content);
    } else if (section === 'activiteiten') {
        function actImg(src, alt, emoji) {
            return `<div style="width:100%;height:180px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(212,160,23,0.15),rgba(79,125,74,0.15));">
                <span style="font-size:4rem;">${emoji}</span>
            </div>`;
        }
        const content = `
            <h2>&#127881; Activiteiten</h2>
            <p style="margin-bottom: 24px;">Ontdek onze speciale evenementen door het jaar heen!</p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
                <div style="border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); background: #fff;">
                    ${actImg('images/kerst.jpg','Kerst','&#127876;')}
                    <div style="padding: 16px;">
                        <h3 style="color: var(--primary-color); margin-bottom: 8px;">&#127876; Kerst bij Condorix</h3>
                        <p style="font-size: 0.95rem; color: #555;">Beleef de magie van kerst tussen de dieren. Sfeervolle verlichting en warme chocolademelk!</p>
                    </div>
                </div>
                <div style="border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); background: #fff;">
                    ${actImg('images/lego.jpg','Lego','&#129521;')}
                    <div style="padding: 16px;">
                        <h3 style="color: var(--primary-color); margin-bottom: 8px;">&#129521; Lego Dierentuin</h3>
                        <p style="font-size: 0.95rem; color: #555;">Bouw je eigen dier van LEGO en bekijk de mooiste creaties van andere bezoekers in de galerij. Leuk voor jong en oud! <a href="#" onclick="openLegoGallery(); return false;" style="color: var(--primary-color); font-weight: 600;">Bekijk galerij &#8594;</a></p>
                    </div>
                </div>
                <div style="border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); background: #fff;">
                    ${actImg('images/dierendag.jpg','Dierendag','&#128062;')}
                    <div style="padding: 16px;">
                        <h3 style="color: var(--primary-color); margin-bottom: 8px;">&#128062; Dierendag</h3>
                        <p style="font-size: 0.95rem; color: #555;">Op 4 oktober vieren we Dierendag! Extra activiteiten, rondleidingen met de verzorgers en leuke workshops voor kinderen.</p>
                    </div>
                </div>
                <div style="border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); background: #fff;">
                    ${actImg('images/pasen.jpg','Pasen','&#128007;')}
                    <div style="padding: 16px;">
                        <h3 style="color: var(--primary-color); margin-bottom: 8px;">&#128007; Pasen</h3>
                        <p style="font-size: 0.95rem; color: #555;">Zoek paaseieren door het hele park, ontmoet pasgeboren dieren en geniet van lentekleuren in de hele dierentuin!</p>
                    </div>
                </div>
            </div>
            <button class="btn-cta" onclick="closeModal()">Sluiten</button>
        `;
        openModal(content);
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.maxWidth = '860px';
            modalContent.style.width = '92vw';
        }
    } else {
        const content = `
            <h2>?? ${section.toUpperCase()}</h2>
            <p>Deze sectie is momenteel in ontwikkeling. Binnenkort vind je hier meer informatie over ${section}!</p>
            
            <div class="info-box">
                <h3>In de tussentijd:</h3>
                <p>� Bekijk onze <a href="#" onclick="openFAQModal(); return false;">veelgestelde vragen</a></p>
                <p>� <a href="#" onclick="openTicketModal(); return false;">Bestel tickets</a> voor je bezoek</p>
                <p>� <a href="#" onclick="openContactModal(); return false;">Neem contact</a> op voor meer informatie</p>
            </div>
            
            <button class="btn-cta" onclick="closeModal()">Sluiten</button>
        `;
        openModal(content);
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Carousel Functionality
let currentSlide = 0;

function getTotalSlides() {
    return document.querySelectorAll('.animal-card').length;
}

function initializeCarousel() {
    // Maak dots aan
    const dotsContainer = document.getElementById('carouselDots');
    const total = getTotalSlides();
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.animal-card');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    // Verwijder active class van huidige slide
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Bereken nieuwe slide index
    currentSlide += direction;
    
    // Loop around
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.animal-card');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = slideIndex;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Auto-advance carousel (optioneel)
let carouselInterval;

function startCarouselAutoplay() {
    carouselInterval = setInterval(() => {
        changeSlide(1);
    }, 8000); // Elke 8 seconden
}

function stopCarouselAutoplay() {
    clearInterval(carouselInterval);
}

// Pause autoplay on hover
document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
    startCarouselAutoplay();
    
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopCarouselAutoplay);
        carouselContainer.addEventListener('mouseleave', startCarouselAutoplay);
    }
});

// Keyboard navigation voor carousel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// Conservation Modal
function openConservationModal() {
    const content = `
        <h2>?? Natuurbescherming & Conservatie</h2>
        <p>Condorix zet zich actief in voor het behoud van bedreigde diersoorten en hun leefgebieden.</p>
        
        <div class="info-box">
            <h3>Onze Beschermingsprogramma's</h3>
            <p><strong>?? Rode Panda Bescherming</strong><br>
            We steunen het Red Panda Network dat werkt aan habitatbescherming in Nepal en India.</p>
            
            <p><strong>?? Tijger Conservatie</strong><br>
            Via het Global Tiger Initiative helpen we bij het beschermen van tijgerpopulaties in Azi�.</p>
            
            <p><strong>?? Olifanten Project</strong><br>
            We dragen bij aan anti-stroperij programma's en het cre�ren van veilige migratieroutes.</p>
            
            <p><strong>?? Zeeschildpad Redding</strong><br>
            Ondersteuning van nestelstranden en rehabilitatie van gewonde zeeschildpadden.</p>
        </div>
        
        <div class="info-box">
            <h3>Jouw Bijdrage</h3>
            <p>Van elk verkocht ticket gaat �2,- direct naar onze beschermingsprojecten.</p>
            <p><strong>Dit jaar al verzameld: �127.500</strong></p>
            <p>Dankzij onze bezoekers konden we:</p>
            <ul>
                <li>? 50 hectare regenwoud beschermen</li>
                <li>? 15 anti-stroperij patrouilles financieren</li>
                <li>? 200+ zeeschildpadden redden en vrijlaten</li>
                <li>? 3 nieuwe onderzoeksprojecten starten</li>
            </ul>
        </div>
        
        <div class="info-box">
            <h3>Word Conservation Vriend</h3>
            <p>Wil je extra bijdragen? Word Conservation Vriend vanaf �5,- per maand en ontvang:</p>
            <ul>
                <li>?? 10% korting op alle tickets</li>
                <li>?? Kwartaalmagazine met projectupdates</li>
                <li>?? Exclusieve Conservation Events</li>
                <li>?? Speciale geschenken</li>
            </ul>
            <button class="btn-cta" onclick="openConservationSignup()">Word Conservation Vriend</button>
        </div>
        
        <button class="btn-secondary" onclick="closeModal()">Sluiten</button>
    `;
    openModal(content);
}

function openConservationSignup() {
    const content = `
        <h2>?? Word Conservation Vriend</h2>
        <p>Samen maken we het verschil voor bedreigde dieren!</p>
        
        <form class="modal-form" onsubmit="submitConservationSignup(event)">
            <div class="form-group">
                <label>Naam:</label>
                <input type="text" name="name" required>
            </div>
            
            <div class="form-group">
                <label>Email:</label>
                <input type="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label>Kies je bijdrage:</label>
                <select name="amount" required>
                    <option value="5">�5,- per maand</option>
                    <option value="10">�10,- per maand</option>
                    <option value="25">�25,- per maand</option>
                    <option value="50">�50,- per maand</option>
                    <option value="custom">Anders...</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Telefoonnummer (optioneel):</label>
                <input type="tel" name="phone">
            </div>
            
            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" required>
                    Ik wil updates ontvangen over de projecten
                </label>
            </div>
            
            <button type="submit" class="btn-cta">Aanmelden als Conservation Vriend</button>
        </form>
    `;
    openModal(content);
}

function submitConservationSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const amount = formData.get('amount');
    
    const content = `
        <h2>?? Welkom Conservation Vriend!</h2>
        <p>Bedankt ${name}! Je bent nu officieel Conservation Vriend van Condorix!</p>
        
        <div class="info-box">
            <h3>Wat gebeurt er nu?</h3>
            <p>? Je ontvangt een welkomstpakket per post</p>
            <p>? Je eerste magazine komt binnen 2 weken</p>
            <p>? Je kortingscode wordt per email verstuurd</p>
            <p>? Je bijdrage van �${amount},- per maand start volgende maand</p>
        </div>
        
        <p>Dankzij jouw steun kunnen we doorgaan met het beschermen van bedreigde diersoorten! ????</p>
        
        <button class="btn-cta" onclick="closeModal()">Naar Mijn Account</button>
    `;
    openModal(content);
}

// Smooth scroll voor anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#tickets' && href !== '#facebook' && href !== '#instagram' && href !== '#youtube' && href !== '#newsletter') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Animatie voor elementen bij scrollen
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Voeg animatie toe aan sections
window.addEventListener('load', () => {
    const sections = document.querySelectorAll('.intro-section, .discount-section, .why-section, .conditions-section, .alternative-section, .quick-links');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
});

// Verberg floating CTA button bij scrollen naar beneden, toon bij scrollen naar boven
let lastScrollTop = 0;
const floatingCta = document.querySelector('.floating-cta');

if (floatingCta) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 300) {
            // Scrolling down
            floatingCta.style.transform = 'translateY(150%)';
        } else {
            // Scrolling up
            floatingCta.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
}

// Mobile menu toggle (voor toekomstige uitbreiding)
function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    nav.classList.toggle('active');
}

// =============================================
// GAMES DROPDOWN � 5 seconden vertraging bij weggaan
// =============================================
(function() {
    function initGamesDropdown() {
        const wrap = document.getElementById('gamesNavItem');
        if (!wrap) return;
        let hideTimer = null;

        wrap.addEventListener('mouseenter', function() {
            clearTimeout(hideTimer);
            wrap.classList.add('open');
        });
        wrap.addEventListener('mouseleave', function() {
            hideTimer = setTimeout(function() {
                wrap.classList.remove('open');
            }, 3000);
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGamesDropdown);
    } else {
        initGamesDropdown();
    }
})();

function openGame(game) {
    const titles = { zoekplaatje: '&#128270; Zoek het Dier', geheugenspel: '&#129504; Geheugenspel' };
    openModal(`
        <h2>${titles[game] || 'Game'}</h2>
        <p style="text-align:center;padding:40px 0;color:#888;font-size:1.1rem;">&#127918; Deze game komt binnenkort!</p>
        <div style="text-align:center;">
            <button class="btn-secondary" onclick="closeModal()">Sluiten</button>
        </div>
    `);
}

// =============================================
// DIEREN SWING GAME (Stickman Hook stijl)
// =============================================
function openDierenPlatformGame() {
    const animals = [
        { emoji: '??', name: 'Leeuw',     grav: 0.45, grab: 230, desc: '&#9878; Gebalanceerd' },
        { emoji: '??', name: 'Kangoeroe', grav: 0.35, grab: 260, desc: '&#127919; Lang touw' },
        { emoji: '??', name: 'Aap',       grav: 0.50, grab: 250, desc: '&#9889; Behendig' },
        { emoji: '??', name: 'Vos',       grav: 0.40, grab: 270, desc: '&#10024; Groot bereik' },
        { emoji: '??', name: 'Kikker',    grav: 0.55, grab: 210, desc: '&#128279; Zwaar' },
        { emoji: '??', name: 'Adelaar',   grav: 0.28, grab: 290, desc: '&#129413; Zweeft' },
    ];
    window._swingAnimals = animals;
    openModal(`
        <h2>&#127918; Kies je dier!</h2>
        <p style="margin-bottom:16px;color:#aaa;text-align:center;">Swing van haak tot haak � klik of tik om te grijpen &amp; loslaten!</p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;">
            ${animals.map((a, i) => `
                <button onclick="startDierenPlatform(${i})" style="background:#111;border:2px solid #333;border-radius:10px;padding:16px 8px;cursor:pointer;font-family:inherit;color:#fff;transition:all 0.2s;"
                    onmouseover="this.style.borderColor='#4ECDC4';this.style.background='#0a2020'"
                    onmouseout="this.style.borderColor='#333';this.style.background='#111'">
                    <div style="font-size:2.5rem;">${a.emoji}</div>
                    <div style="font-weight:600;margin-top:6px;">${a.name}</div>
                    <div style="font-size:0.73rem;color:#888;margin-top:2px;">${a.desc}</div>
                </button>
            `).join('')}
        </div>
        <div style="text-align:center;">
            <button class="btn-secondary" onclick="closeModal()">Sluiten</button>
        </div>
    `);
    const mc = document.querySelector('.modal-content');
    if (mc) { mc.style.maxWidth = '480px'; mc.style.width = '92vw'; mc.style.background = '#0a0a1a'; mc.style.color = '#fff'; }
}

function startDierenPlatform(animalIndex) {
    const animal = window._swingAnimals[animalIndex];
    window._swingLevel = 1;
    window._swingScore = 0;
    window._swingLives = 3;
    openModal(`
        <div style="background:#0a0a1a;color:#fff;border-radius:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;padding:0 2px;">
                <h2 style="margin:0;color:#fff;">${animal.emoji} ${animal.name}</h2>
                <div style="display:flex;gap:14px;font-weight:600;font-size:0.92rem;color:#fff;">
                    <span>&#127919; <span id="gameLevel">1</span>/50</span>
                    <span>&#9829; <span id="gameLives">3</span></span>
                    <span>&#11088; <span id="gameScore">0</span></span>
                </div>
            </div>
            <canvas id="gameCanvas" width="680" height="360" style="display:block;border-radius:8px;outline:none;cursor:pointer;" tabindex="0"></canvas>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;flex-wrap:wrap;gap:8px;">
                <span style="font-size:0.78rem;color:#666;">&#128432; Klik/tik als bolletje gloeit &#8212; klik nogmaals om los te laten</span>
                <div style="display:flex;gap:8px;">
                    <button class="btn-secondary" style="padding:6px 14px;font-size:0.85rem;" onclick="openDierenPlatformGame()">&#8617; Ander dier</button>
                    <button class="btn-secondary" style="padding:6px 14px;font-size:0.85rem;" onclick="closeModal()">Sluiten</button>
                </div>
            </div>
        </div>
    `);
    const mc = document.querySelector('.modal-content');
    if (mc) { mc.style.maxWidth = '740px'; mc.style.width = '96vw'; mc.style.background = '#0a0a1a'; mc.style.color = '#fff'; }
    setTimeout(() => runPlatformGame(animal), 60);
}

function runPlatformGame(animal) {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    if (window._gameLoopId) { cancelAnimationFrame(window._gameLoopId); window._gameLoopId = null; }

    const MAX_LEVELS = 50;
    const GRAVITY = animal.grav;
    const GRAB_R  = animal.grab;
    const HOOK_COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#FF9F43','#A29BFE'];
    const TRAMPOLINE_BOUNCE = -22;

    let currentLevel = window._swingLevel || 1;
    let score        = window._swingScore || 0;
    let lives        = (window._swingLives !== undefined) ? window._swingLives : 3;

    function generateLevel(lvl) {
        const t        = (lvl - 1) / (MAX_LEVELS - 1);
        const lw       = Math.round(2000 + t * 4000);
        const spacing  = Math.round(140 + t * 165);
        const yBase    = Math.round(72 - t * 38);
        const yVar     = Math.round(8  + t * 42);
        const tramCount = Math.max(0, Math.round(10 - t * 11));
        const hs = [], ts = [];
        let x = 160;
        while (x < lw - 280) {
            const y = Math.max(28, Math.min(118, yBase + (Math.random() * 2 - 1) * yVar));
            hs.push([Math.round(x), Math.round(y)]);
            x += spacing + Math.round(Math.random() * spacing * 0.45);
        }
        if (tramCount > 0) {
            const step = lw / (tramCount + 1);
            for (let i = 0; i < tramCount; i++) {
                ts.push([Math.round(step * (i + 1)), Math.round(285 + Math.random() * 40), 80]);
            }
        }
        return { hooks: hs, trampolines: ts, lw, finX: lw - 180, finY: 72 };
    }

    let lvData      = generateLevel(currentLevel);
    let hooks       = lvData.hooks;
    let trampolines = lvData.trampolines;
    let LEVEL_W     = lvData.lw;
    let FINISH_X    = lvData.finX;
    let FINISH_Y    = lvData.finY;

    let bounceFlash = -1, bounceFlashTimer = 0;

    let px, py, vx, vy;
    let attached = false, hookIdx = -1, ropeLen = 0;
    let camX = 0;
    let gameOver = false, won = false, wonTimer = 0;
    let active = true;
    let hooksPassed = new Set();

    function updateHUD() {
        const s  = document.getElementById('gameScore');
        const l  = document.getElementById('gameLives');
        const lv = document.getElementById('gameLevel');
        if (s)  s.textContent  = score;
        if (l)  l.textContent  = lives;
        if (lv) lv.textContent = currentLevel;
    }

    function respawn() {
        if (!hooks.length) return;
        attached = true; hookIdx = 0; ropeLen = 130;
        px = hooks[0][0]; py = hooks[0][1] + ropeLen;
        vx = 7; vy = 0; camX = 0;
    }
    respawn(); updateHUD();

    function loadNextLevel() {
        currentLevel++;
        lives = 3;
        window._swingLevel = currentLevel;
        window._swingScore = score;
        window._swingLives = lives;
        lvData = generateLevel(currentLevel);
        hooks = lvData.hooks; trampolines = lvData.trampolines;
        LEVEL_W = lvData.lw; FINISH_X = lvData.finX; FINISH_Y = lvData.finY;
        won = false; wonTimer = 0;
        bounceFlash = -1; bounceFlashTimer = 0;
        hooksPassed = new Set();
        respawn(); updateHUD();
    }

    function restartFromPrevLevel() {
        currentLevel = Math.max(1, currentLevel - 1);
        lives = 3;
        window._swingLevel = currentLevel;
        window._swingScore = score;
        window._swingLives = lives;
        lvData = generateLevel(currentLevel);
        hooks = lvData.hooks; trampolines = lvData.trampolines;
        LEVEL_W = lvData.lw; FINISH_X = lvData.finX; FINISH_Y = lvData.finY;
        gameOver = false; won = false; wonTimer = 0;
        bounceFlash = -1; bounceFlashTimer = 0;
        hooksPassed = new Set();
        respawn(); updateHUD();
    }

    function grabOrRelease() {
        if (gameOver || won) return;
        if (attached) {
            attached = false; hookIdx = -1;
        } else {
            let best = -1, bestD = GRAB_R;
            for (let i = 0; i < hooks.length; i++) {
                const dx = hooks[i][0] - px, dy = hooks[i][1] - py;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < bestD) { bestD = d; best = i; }
            }
            if (best >= 0) {
                const dx = hooks[best][0] - px, dy = hooks[best][1] - py;
                ropeLen = Math.sqrt(dx * dx + dy * dy);
                attached = true; hookIdx = best;
                if (!hooksPassed.has(best)) { hooksPassed.add(best); score += 10; updateHUD(); }
            }
        }
    }

    canvas.addEventListener('click', grabOrRelease);
    canvas.addEventListener('touchstart', function(e) { e.preventDefault(); grabOrRelease(); }, { passive: false });
    canvas.focus();

    function update() {
        if (!active || gameOver) return;
        if (won) { wonTimer++; return; }
        vy += GRAVITY;
        if (attached && hookIdx >= 0) {
            const hx = hooks[hookIdx][0], hy = hooks[hookIdx][1];
            px += vx; py += vy;
            const dx = px - hx, dy = py - hy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > ropeLen) {
                const nx = dx / dist, ny = dy / dist;
                const dot = vx * nx + vy * ny;
                vx -= dot * nx; vy -= dot * ny;
                px = hx + nx * ropeLen; py = hy + ny * ropeLen;
            }
        } else {
            px += vx; py += vy;
        }
        // Trampoline collision
        for (let t = 0; t < trampolines.length; t++) {
            const [tx, ty, tw] = trampolines[t];
            if (px > tx - 10 && px < tx + tw + 10 && py >= ty - 8 && py <= ty + 12 && vy > 0) {
                vy = TRAMPOLINE_BOUNCE;
                py = ty - 8;
                bounceFlash = t; bounceFlashTimer = 18;
            }
        }
        if (bounceFlashTimer > 0) bounceFlashTimer--;
        if (py > H + 100) {
            lives--; updateHUD();
            if (lives <= 0) {
                gameOver = true;
                setTimeout(() => { if (active && document.getElementById('gameCanvas')) restartFromPrevLevel(); }, 3000);
                return;
            }
            respawn();
        }
        if (!won && px > FINISH_X) {
            const bonus = Math.max(50, 200 - (currentLevel - 1) * 2);
            won = true; wonTimer = 0; score += bonus; updateHUD();
        }
        if (won && currentLevel < MAX_LEVELS && wonTimer >= 180) {
            loadNextLevel();
        }
        const tc = px - W / 3;
        camX += (tc - camX) * 0.1;
        if (camX < 0) camX = 0;
        if (camX > LEVEL_W - W) camX = LEVEL_W - W;
    }

    function draw() {
        // Background shifts hue with level difficulty
        const td = (currentLevel - 1) / (MAX_LEVELS - 1);
        ctx.fillStyle = `rgb(${Math.round(8+td*18)},8,${Math.round(26+td*8)})`;
        ctx.fillRect(0, 0, W, H);

        // Subtle grid
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        const gox = camX % 60;
        for (let x = -gox; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

        // Ceiling color shifts teal→purple with level
        const ceilGrad = ctx.createLinearGradient(0, 0, W, 0);
        ceilGrad.addColorStop(0, `rgba(${Math.round(78-td*30)},${Math.round(205-td*100)},${Math.round(196-td*30)},0.45)`);
        ceilGrad.addColorStop(0.5, `rgba(${Math.round(120+td*135)},${Math.round(50+td*20)},${Math.round(189-td*50)},0.55)`);
        ceilGrad.addColorStop(1, `rgba(${Math.round(78-td*30)},${Math.round(205-td*100)},${Math.round(196-td*30)},0.45)`);
        ctx.fillStyle = ceilGrad;
        ctx.fillRect(0, 0, W, 6);

        // Find nearest reachable hook when not attached (for preview)
        let nearIdx = -1, nearDist = Infinity;
        if (!attached && !gameOver && !won) {
            for (let i = 0; i < hooks.length; i++) {
                const dx = hooks[i][0] - px, dy = hooks[i][1] - py;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < GRAB_R && d < nearDist) { nearDist = d; nearIdx = i; }
            }
        }

        // Hooks
        for (let i = 0; i < hooks.length; i++) {
            const hx = hooks[i][0] - camX, hy = hooks[i][1];
            if (hx < -30 || hx > W + 30) continue;
            const col = HOOK_COLORS[i % HOOK_COLORS.length];
            const isActive = attached && hookIdx === i;
            const isNear   = !attached && i === nearIdx;

            // Wire from ceiling
            ctx.strokeStyle = isActive ? col : isNear ? col : 'rgba(255,255,255,0.15)';
            ctx.lineWidth = isActive ? 2 : isNear ? 1.5 : 1;
            ctx.setLineDash([]);
            ctx.beginPath(); ctx.moveTo(hx, 0); ctx.lineTo(hx, hy); ctx.stroke();

            // Glow
            if (isActive || isNear) { ctx.shadowColor = col; ctx.shadowBlur = isNear ? 14 : 20; }
            const pulse = isNear ? 9 + Math.sin(Date.now() / 150) * 2.5 : 0;
            ctx.fillStyle = isActive ? col : isNear ? col : 'rgba(200,200,200,0.5)';
            ctx.beginPath(); ctx.arc(hx, hy, isActive ? 10 : isNear ? pulse : 7, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Preview line (dashed) to nearest reachable hook when not attached
        if (nearIdx >= 0) {
            const hx = hooks[nearIdx][0] - camX, hy = hooks[nearIdx][1];
            const col = HOOK_COLORS[nearIdx % HOOK_COLORS.length];
            const alpha = 0.4 + Math.sin(Date.now() / 200) * 0.25;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.setLineDash([8, 6]);
            ctx.strokeStyle = col;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(px - camX, py); ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        }

        // Trampolines
        for (let t = 0; t < trampolines.length; t++) {
            const [tx, ty, tw] = trampolines[t];
            const sx = tx - camX;
            if (sx > W + 100 || sx + tw < -100) continue;
            const isFlashing = bounceFlash === t && bounceFlashTimer > 0;
            const flashAlpha = isFlashing ? (bounceFlashTimer / 18) : 0;
            // Shadow/glow
            ctx.shadowColor = '#39FF14'; ctx.shadowBlur = isFlashing ? 28 : 12;
            // Base bar
            const grad = ctx.createLinearGradient(sx, ty, sx, ty + 14);
            grad.addColorStop(0, isFlashing ? `rgba(100,255,80,${0.7 + flashAlpha * 0.3})` : 'rgba(57,255,20,0.85)');
            grad.addColorStop(1, 'rgba(20,120,10,0.7)');
            ctx.fillStyle = grad;
            ctx.fillRect(sx, ty, tw, 14);
            // Shine
            ctx.fillStyle = `rgba(255,255,255,${isFlashing ? 0.6 : 0.25})`;
            ctx.fillRect(sx + 6, ty + 2, tw - 12, 4);
            // Legs
            ctx.strokeStyle = 'rgba(57,255,20,0.6)'; ctx.lineWidth = 3; ctx.setLineDash([]);
            ctx.beginPath(); ctx.moveTo(sx + 14, ty + 14); ctx.lineTo(sx + 6, ty + 30); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(sx + tw - 14, ty + 14); ctx.lineTo(sx + tw - 6, ty + 30); ctx.stroke();
            // Emoji indicator
            ctx.shadowBlur = 0;
            ctx.font = '16px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('🤸', sx + tw / 2, ty - 14);
            ctx.shadowBlur = 0;
        }

        // Rope (solid, when attached)
        if (attached && hookIdx >= 0) {
            const hx = hooks[hookIdx][0] - camX, hy = hooks[hookIdx][1];
            const col = HOOK_COLORS[hookIdx % HOOK_COLORS.length];
            ctx.shadowColor = col; ctx.shadowBlur = 10;
            ctx.strokeStyle = col; ctx.lineWidth = 2.5;
            ctx.setLineDash([]);
            ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(px - camX, py); ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // Finish line — full height
        const fx = FINISH_X - camX;
        if (fx > -20 && fx < W + 20) {
            const pulse = 0.5 + Math.abs(Math.sin(Date.now() / 400)) * 0.5;
            // Glowing vertical line
            ctx.save();
            ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 24;
            const finGrad = ctx.createLinearGradient(0, 0, 0, H);
            finGrad.addColorStop(0,   `rgba(255,215,0,${0.15 + pulse * 0.5})`);
            finGrad.addColorStop(0.5, `rgba(255,215,0,${0.6  + pulse * 0.3})`);
            finGrad.addColorStop(1,   `rgba(255,215,0,${0.15 + pulse * 0.5})`);
            ctx.strokeStyle = finGrad;
            ctx.lineWidth = 4;
            ctx.setLineDash([14, 8]);
            ctx.beginPath(); ctx.moveTo(fx, 0); ctx.lineTo(fx, H); ctx.stroke();
            ctx.setLineDash([]);
            ctx.shadowBlur = 0;
            // Checkered flag icons along the line
            ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            const flagY = [40, 100, 160, 220, 280, 340];
            for (const fy of flagY) ctx.fillText('\uD83C\uDFC1', fx, fy);
            ctx.restore();
        }

        // Player
        const psx = px - camX;
        ctx.save();
        ctx.translate(psx, py);
        const swAngle = attached && hookIdx >= 0
            ? Math.atan2(vx, -(py - hooks[hookIdx][1])) * 0.25
            : Math.atan2(vy, vx) * 0.15;
        ctx.rotate(swAngle);
        ctx.shadowColor = '#4ECDC4'; ctx.shadowBlur = 18;
        ctx.font = '28px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(animal.emoji, 0, 0);
        ctx.shadowBlur = 0;
        ctx.restore();

        // Progress bar
        const prog = Math.min(px / (LEVEL_W - 300), 1);
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(W/2 - 100, 12, 200, 8);
        const pg = ctx.createLinearGradient(W/2 - 100, 0, W/2 + 100, 0);
        pg.addColorStop(0, '#4ECDC4'); pg.addColorStop(1, '#FFD700');
        ctx.fillStyle = pg;
        ctx.fillRect(W/2 - 100, 12, 200 * prog, 8);
        ctx.font = '14px serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#FFD700';
        ctx.fillText('??', W/2 + 104, 16);

        // Overlays
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(0, 0, W, H);
            ctx.shadowColor = '#FF6B6B'; ctx.shadowBlur = 25;
            ctx.fillStyle = '#FF6B6B'; ctx.font = 'bold 34px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('\uD83D\uDCA5 Game Over', W/2, H/2 - 28);
            ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.font = '16px sans-serif';
            const backTo = Math.max(1, currentLevel - 1);
            ctx.fillText('Je gaat terug naar level ' + backTo + ' met 3 levens\u2026', W/2, H/2 + 6);
            ctx.fillStyle = '#888'; ctx.font = '13px sans-serif';
            ctx.fillText('(over 3 seconden automatisch)', W/2, H/2 + 28);
        }
        if (won) {
            const a = Math.min(wonTimer / 60, 0.72);
            ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, W, H);
            if (wonTimer > 10) {
                if (currentLevel >= MAX_LEVELS) {
                    ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 30;
                    ctx.fillStyle = '#FFD700'; ctx.font = 'bold 26px sans-serif'; ctx.textAlign = 'center';
                    ctx.fillText('\uD83C\uDF89 Alle 50 levels gehaald! \uD83C\uDF89', W/2, H/2 - 32);
                    ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.font = '20px sans-serif';
                    ctx.fillText('Totale score: ' + score, W/2, H/2 + 6);
                    ctx.fillStyle = '#4ECDC4'; ctx.font = '14px sans-serif';
                    ctx.fillText(animal.emoji + ' ' + animal.name + ' is een absolute kampioen!', W/2, H/2 + 34);
                } else {
                    ctx.shadowColor = '#4ECDC4'; ctx.shadowBlur = 20;
                    ctx.fillStyle = '#4ECDC4'; ctx.font = 'bold 30px sans-serif'; ctx.textAlign = 'center';
                    ctx.fillText('\uD83C\uDFC1 Gehaald!', W/2, H/2 - 30);
                    ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.font = '17px sans-serif';
                    ctx.fillText('Level ' + currentLevel + ' \u2022 Score: ' + score, W/2, H/2 + 4);
                    // Countdown (180 frames = 3s @ 60fps)
                    const secsLeft = Math.ceil((180 - wonTimer) / 60);
                    ctx.fillStyle = '#aaa'; ctx.font = '14px sans-serif';
                    ctx.fillText('Volgende level over ' + secsLeft + ' seconde' + (secsLeft !== 1 ? 'n' : '') + '\u2026', W/2, H/2 + 30);
                }
            }
        }
    }

    function loop() {
        if (!document.getElementById('gameCanvas')) {
            active = false;
            canvas.removeEventListener('click', grabOrRelease);
            if (window._gameLoopId) cancelAnimationFrame(window._gameLoopId);
            return;
        }
        update(); draw();
        window._gameLoopId = requestAnimationFrame(loop);
    }
    window._gameLoopId = requestAnimationFrame(loop);
}


// Slidedown animatie voor cookie banner
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(100%);
        }
    }
`;
document.head.appendChild(style);

console.log('Condorix website geladen! ??');
