/* ─── NAV SCROLL ────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ─── HAMBURGER ─────────────────────────────────────────── */
const ham = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(a => {
  a.addEventListener('click', () => {
    ham.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── HERO SLIDESHOW ────────────────────────────────────── */
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.hero-dot');
let current = 0, timer;

/* ─── DATE INPUT ─────────────────────────────────────────── */
const dateInput = document.getElementById('f-date');

function parseDatePT(value) {
  const [day, month, year] = value.split('/');
  return new Date(`${year}-${month}-${day}T00:00:00`);
}

/* ─── FLATPICKR ──────────────────────────────────────────── */
const datePicker = flatpickr("#f-date", {
  dateFormat: "d/m/Y",
  locale: flatpickr.l10ns.pt,
  allowInput: true,
  onChange: (selectedDates, dateStr) => {
    if (dateStr) dateInput.dispatchEvent(new Event("input"));
  }
});

const calendarBtn = document.getElementById('calendar-btn');
if (calendarBtn) {
  calendarBtn.addEventListener('click', () => datePicker.open());
}

/* ─── HERO CONTROLS ──────────────────────────────────────── */
function goTo(n) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}
function startTimer() { timer = setInterval(() => goTo(current + 1), 5000); }
function resetTimer() { clearInterval(timer); startTimer(); }

document.getElementById('heroPrev').addEventListener('click', () => { goTo(current - 1); resetTimer(); });
document.getElementById('heroNext').addEventListener('click', () => { goTo(current + 1); resetTimer(); });
dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.index); resetTimer(); }));
startTimer();

/* ─── INTERSECTION OBSERVER ─────────────────────────────── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ─── COUNTER ANIMATION ─────────────────────────────────── */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = target * ease;
      el.textContent = isDecimal ? (val / 10).toFixed(1) : Math.floor(val);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ─── DYNAMIC TIME SLOTS ──────────────────────────────────── */
let selectedTime = '';

function generateTimeSlots() {
  const container = document.getElementById('timeSlots');
  container.innerHTML = ''; // Clear existing

  // Generate 09:00 to 18:00, 30min intervals
  for (let h = 9; h <= 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const slot = document.createElement('div');
      slot.className = 'time-slot';
      slot.dataset.time = time;
      slot.textContent = time;
      container.appendChild(slot);
    }
  }

  // Attach click handlers
  container.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      container.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      selectedTime = slot.dataset.time;
      document.getElementById('time-error').style.display = 'none';
    });
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', generateTimeSlots);

/* ─── DATE RESTRICTIONS ──────────────────────────────────── */
/* ─── SLOT AVAILABILITY ─────────────────────────────────── */
function updateSlotAvailability(selectedDate) {
  const now = new Date();
  const slots = document.querySelectorAll('.time-slot');
  
  slots.forEach(slot => {
    const [h, m] = slot.dataset.time.split(':').map(Number);
    const slotDateTime = new Date(selectedDate);
    slotDateTime.setHours(h, m, 0, 0);
    
    // Disable past times if today
    if (selectedDate.toDateString() === now.toDateString() && slotDateTime < now) {
      slot.classList.add('disabled');
      slot.style.opacity = '0.4';
      slot.style.cursor = 'not-allowed';
    } else {
      slot.classList.remove('disabled');
      slot.style.opacity = '';
      slot.style.cursor = '';
    }
  });
}

dateInput.addEventListener('input', (e) => {
  const grp = dateInput.closest('.form-group');
  const err = document.getElementById('date-error');

  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 8) value = value.slice(0, 8);
  if (value.length > 4) {
    value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
  } else if (value.length > 2) {
    value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
  }
  e.target.value = value;

  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(e.target.value)) {
    grp.classList.add('error');
    err.textContent = 'Formato: dd/mm/aaaa';
    return;
  }

  const d = parseDatePT(e.target.value);
  if (d.getDay() === 0 || d.getDay() === 6) {
    grp.classList.add('error');
    err.textContent = 'Só atendemos dias úteis (Seg–Sex)';
    e.target.value = '';
  } else {
  grp.classList.remove('error');
    // Regenerate time slots for new date + availability
    generateTimeSlots();
    updateSlotAvailability(d);
  }
});


/* ─── FORM VALIDATION ────────────────────────────────────── */
function validate(id, condition) {
  const grp = document.getElementById(id).closest('.form-group');
  if (!condition) { grp.classList.add('error'); return false; }
  grp.classList.remove('error'); return true;
}
function phoneValid(v) {
  return /^(\+351)?[9][0-9]{8}$/.test(v.replace(/\s/g, '')) ||
         /^2[0-9]{8}$/.test(v.replace(/\s/g, ''));
}

/* ─── SUBMIT ─────────────────────────────────────────────── */
const WORKER_URL = 'https://rececaoclientes.barberco.workers.dev';

document.getElementById('bookingForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name    = document.getElementById('f-name').value.trim();
  const phone   = document.getElementById('f-phone').value.trim();
  const service = document.getElementById('f-service').value;
  const barber  = document.getElementById('f-barber').value;
  const date    = document.getElementById('f-date').value;

  const v1 = validate('f-name',    name.length > 1);
  const v2 = validate('f-phone',   phoneValid(phone));
  const v3 = validate('f-service', service !== '');
  const v4 = validate('f-barber',  barber !== '');

  const dateGrp = dateInput.closest('.form-group');
  const dateErr = document.getElementById('date-error');
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  let v5 = true;

  if (!date || !dateRegex.test(date)) {
    dateGrp.classList.add('error');
    dateErr.textContent = 'Formato: dd/mm/aaaa';
    v5 = false;
  } else {
    const d = parseDatePT(date);
    if (d.getDay() === 0 || d.getDay() === 6) {
      dateGrp.classList.add('error');
      dateErr.textContent = 'Só atendemos dias úteis (Seg–Sex)';
      v5 = false;
    } else {
      dateGrp.classList.remove('error');
    }
  }

  const timeErr = document.getElementById('time-error');
  let v6 = true;
  if (!selectedTime) { timeErr.style.display = 'block'; v6 = false; }
  else { timeErr.style.display = 'none'; }

  if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6) return;

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="loader"></span> A confirmar...';

  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, service, barber, date, time: selectedTime }),
    });

    if (!res.ok) throw new Error('Erro no servidor');

  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = 'Confirmar agendamento';
    alert('Erro ao enviar o agendamento. Tenta novamente ou liga-nos.');
    return;
  }

  const dateObj = parseDatePT(date);
  const dateFormatted = dateObj.toLocaleDateString('pt-PT', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  document.getElementById('modalSummary').innerHTML = `
    <div class="summary-row"><span>Nome</span><span>${name}</span></div>
    <div class="summary-row"><span>Serviço</span><span>${service}</span></div>
    <div class="summary-row"><span>Barbeiro</span><span>${barber}</span></div>
    <div class="summary-row"><span>Data</span><span>${dateFormatted}</span></div>
    <div class="summary-row"><span>Horário</span><span>${selectedTime}</span></div>
    <div class="summary-row"><span>Contacto</span><span>${phone}</span></div>
  `;
  document.getElementById('modal').classList.add('open');

  btn.disabled = false;
  btn.innerHTML = 'Confirmar agendamento';
  document.getElementById('bookingForm').reset();
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  selectedTime = '';
});

/* ─── MODAL CLOSE ─────────────────────────────────────────── */
function closeModal() { document.getElementById('modal').classList.remove('open'); }
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
document.getElementById('modal').addEventListener('click', e => {
  if (e.target.id === 'modal') closeModal();
});