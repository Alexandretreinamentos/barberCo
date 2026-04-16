// script.js — Barber&Co

/* ─── NAV SCROLL ─────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ─── HAMBURGER ──────────────────────────────────────────── */
const ham        = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

ham.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  ham.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(a => {
  a.addEventListener('click', () => {
    ham.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── HERO SLIDESHOW ─────────────────────────────────────── */
const slides  = document.querySelectorAll('.slide');
const dots    = document.querySelectorAll('.hero-dot');
let current   = 0;
let slideTimer;

function goTo(n) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = ((n % slides.length) + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function startTimer() {
  slideTimer = setInterval(() => goTo(current + 1), 5000);
}

function resetTimer() {
  clearInterval(slideTimer);
  startTimer();
}

document.getElementById('heroPrev').addEventListener('click', () => { goTo(current - 1); resetTimer(); });
document.getElementById('heroNext').addEventListener('click', () => { goTo(current + 1); resetTimer(); });
dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.index); resetTimer(); }));
startTimer();

/* ─── INTERSECTION OBSERVER ──────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target); // unobserve após revelar — mais eficiente
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── COUNTER ANIMATION ──────────────────────────────────── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el       = e.target;
    const target   = +el.dataset.target;
    const isDecimal = el.dataset.decimal === 'true';
    const duration  = 1800;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      const val      = target * ease;
      el.textContent = isDecimal ? (val / 10).toFixed(1) : Math.floor(val);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ─── TIME SLOTS ─────────────────────────────────────────── */
let selectedTime = '';
const timeContainer = document.getElementById('timeSlots');

async function generateTimeSlots(selectedDate, dateStr) {
  timeContainer.innerHTML = `
    <div class="time-loading">
      Verificando horários disponíveis...
    </div>
  `;
  selectedTime = ''; // reset seleção ao mudar de data

  const now = new Date();
  const isToday = selectedDate instanceof Date &&
    selectedDate.toDateString() === now.toDateString();

  // Fetch horários ocupados
  const occupiedTimes = await fetchOccupiedTimes(dateStr);

  // Gerar todos possíveis slots
  const allSlots = [];
  for (let h = 9; h <= 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      // 18:30 não existe — paramos às 18:00
      if (h === 18 && m === 30) break;

      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const slotTime = new Date(selectedDate);
      slotTime.setHours(h, m, 0, 0);

      const isPast = isToday && slotTime <= now;
      const isOccupied = occupiedTimes.has(timeStr);

      // Skip se passado OU ocupado
      if (isPast || isOccupied) continue;

      allSlots.push(timeStr);
    }
  }

  // Se não há slots disponíveis
  if (allSlots.length === 0) {
    timeContainer.innerHTML = `
      <div class="time-loading" style="padding:3rem">
        <svg style="width:28px;height:28px;color:var(--gold)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <div style="margin-top:0.5rem">Sem horários disponíveis</div>
        <div style="font-size:0.8rem;color:var(--muted);margin-top:0.25rem">
          Tenta outra data
        </div>
      </div>
    `;
    return;
  }

  // Renderizar slots disponíveis
  timeContainer.innerHTML = '';
  allSlots.forEach(timeStr => {
    const slotTime = new Date(selectedDate);
    const [h, m] = timeStr.split(':').map(Number);
    slotTime.setHours(h, m, 0, 0);

    const slot = document.createElement('div');
    slot.className = 'time-slot';
    slot.dataset.time = timeStr;
    slot.textContent = timeStr;

    // Tooltip para slots poucos disponíveis (melhor UX)
    if (allSlots.length <= 3) {
      slot.dataset.tooltip = 'Poucos horários restantes!';
    }

    slot.addEventListener('click', () => {
      if (slot.classList.contains('selected')) return;
      timeContainer.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      selectedTime = timeStr;
      document.getElementById('time-error').style.display = 'none';
    });

    timeContainer.appendChild(slot);
  });

  // Info de disponibilidade
  const info = document.createElement('div');
  info.className = 'slots-info';
  info.textContent = `${allSlots.length} horário${allSlots.length > 1 ? 's' : ''} disponível${allSlots.length > 1 ? 's' : ''}`;
  timeContainer.appendChild(info);
}

/* ─── FLATPICKR ──────────────────────────────────────────── */
const dateInput = document.getElementById('f-date');

const datePicker = flatpickr('#f-date', {
  dateFormat:  'd/m/Y',
  locale:      flatpickr.l10ns.pt,
  allowInput:  true,
  minDate:     'today',
  disable: [
    // Bloquear apenas domingos diretamente no calendário
    date => date.getDay() === 0,
  ],
  onChange(selectedDates, dateStr) {
    if (!selectedDates.length) return;
    handleDateSelected(selectedDates[0], dateStr);
  },
});

const calendarBtn = document.getElementById('calendar-btn');
calendarBtn?.addEventListener('click', () => datePicker.open());

/* ─── PARSE DATA PT ──────────────────────────────────────── */
function parseDatePT(value) {
  if (!value || !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return null;
  const [day, month, year] = value.split('/').map(Number);
  const d = new Date(year, month - 1, day);
  // Verificar que a data é válida (evita 31/02, etc.)
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
    return null;
  }
  return d;
}

/* ─── LÓGICA PARTILHADA DE SELEÇÃO DE DATA ───────────────── */
function handleDateSelected(dateObj, dateStr) {
  const grp = dateInput.closest('.form-group');
  const err = document.getElementById('date-error');

  if (!dateObj) {
    grp.classList.add('error');
    err.textContent = 'Data inválida';
    return;
  }

  const dow = dateObj.getDay();
  if (dow === 0) {
    grp.classList.add('error');
    err.textContent = 'Não atendemos aos domingos';
    dateInput.value = '';
    datePicker.clear();
    return;
  }

  grp.classList.remove('error');
  generateTimeSlots(dateObj, dateStr);
}

/* ─── INPUT MANUAL DE DATA (auto-formatação) ─────────────── */
dateInput.addEventListener('input', e => {
  // Auto-formatação dd/mm/aaaa
  let raw = e.target.value.replace(/\D/g, '').slice(0, 8);
  if (raw.length > 4)      raw = raw.slice(0, 2) + '/' + raw.slice(2, 4) + '/' + raw.slice(4);
  else if (raw.length > 2) raw = raw.slice(0, 2) + '/' + raw.slice(2);
  e.target.value = raw;

  if (raw.length === 10) {
    const d = parseDatePT(raw);
    if (d) {
      datePicker.setDate(d, false); // sincronizar sem trigger
      handleDateSelected(d, raw);
    }
  }
});

/* ─── VALIDAÇÃO DO FORM ──────────────────────────────────── */
// Regex para nº português: móvel (9xx) e fixo (2xx), com prefixo 351 opcional
const PHONE_RE = /^(\+?351)?[239]\d{8}$/;

function validateField(id, condition) {
  const grp = document.getElementById(id).closest('.form-group');
  grp.classList.toggle('error', !condition);
  return condition;
}

function isPhoneValid(v) {
  return PHONE_RE.test(v.replace(/[\s\-().]/g, ''));
}

/* ─── SUBMIT ─────────────────────────────────────────────── */
const WORKER_URL = 'https://rececaoclientes.barberco.workers.dev/';
const CONTATOS_URL = 'https://consultar.barberco.workers.dev/contatos';

/**
 * Fetch horários ocupados para uma data específica (dd/mm/yyyy)
 * @param {string} dateStr - Data no formato pt-BR
 * @returns {Promise<Set<string>>} Set de horários ocupados ['09:00', '09:30', ...]
 */
async function fetchOccupiedTimes(dateStr) {
  try {
    // Assumindo que API aceita ?data=dd/mm/yyyy ou /contatos?data=...
    // Ajustar query param conforme API real
    const url = `${CONTATOS_URL}?data=${encodeURIComponent(dateStr)}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      console.warn('API contatos falhou:', res.status);
      return new Set();
    }
    
    const data = await res.json();
    const occupied = new Set();
    
    // Parse JSON - suporta array de objetos ou direto array de strings
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.horario || item.time) {
          const time = (item.horario || item.time).trim();
          if (/^\d{2}:\d{2}$/.test(time)) occupied.add(time);
        }
      });
    }
    
    console.log(`Horários ocupados em ${dateStr}:`, occupied.size, Array.from(occupied));
    return occupied;
  } catch (err) {
    console.error('Erro ao buscar horários ocupados:', err);
    return new Set();
  }
}

document.getElementById('bookingForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nameEl    = document.getElementById('f-name');
  const phoneEl   = document.getElementById('f-phone');
  const serviceEl = document.getElementById('f-service');
  const barberEl  = document.getElementById('f-barber');

  const name    = nameEl.value.trim();
  const phone   = phoneEl.value.trim();
  const service = serviceEl.value;
  const barber  = barberEl.value;
  const date    = dateInput.value;

  const v1 = validateField('f-name',    name.length > 1);
  const v2 = validateField('f-phone',   isPhoneValid(phone));
  const v3 = validateField('f-service', service !== '');
  const v4 = validateField('f-barber',  barber !== '');

  // Validar data
  const dateGrp = dateInput.closest('.form-group');
  const dateErr = document.getElementById('date-error');
  let v5 = false;

  const dateObj = parseDatePT(date);
  if (!dateObj) {
    dateGrp.classList.add('error');
    dateErr.textContent = 'Formato: dd/mm/aaaa';
  } else if (dateObj.getDay() === 0) {
    dateGrp.classList.add('error');
    dateErr.textContent = 'Não atendemos aos domingos';
  } else {
    dateGrp.classList.remove('error');
    v5 = true;
  }

  // Validar horário
  const timeErr = document.getElementById('time-error');
  const v6 = !!selectedTime;
  timeErr.style.display = v6 ? 'none' : 'block';

  if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6) {
    // Scroll para o primeiro erro
    const firstError = document.querySelector('.form-group.error');
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="loader"></span> A confirmar...';

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        service,
        barber,
        date,
        time: selectedTime,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `HTTP ${res.status}`);
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = "Confirmar agendamento";
    alert(
      `Erro ao enviar o agendamento: ${err.message}.\nTenta novamente ou liga-nos.`,
    );
    return;
  }

  // Mostrar modal de confirmação
  const dateFormatted = dateObj.toLocaleDateString('pt-PT', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  document.getElementById('modalSummary').innerHTML = `
    <div class="summary-row"><span>Nome</span><span>${escapeHtml(name)}</span></div>
    <div class="summary-row"><span>Serviço</span><span>${escapeHtml(service)}</span></div>
    <div class="summary-row"><span>Barbeiro</span><span>${escapeHtml(barber)}</span></div>
    <div class="summary-row"><span>Data</span><span>${dateFormatted}</span></div>
    <div class="summary-row"><span>Horário</span><span>${selectedTime}</span></div>
    <div class="summary-row"><span>Contacto</span><span>${escapeHtml(phone)}</span></div>
  `;
  document.getElementById('modal').classList.add('open');

  // Reset do formulário
  this.reset();
  datePicker.clear();
  timeContainer.innerHTML = '';
  selectedTime = '';
  btn.disabled = false;
  btn.innerHTML = 'Confirmar agendamento';
});

/* ─── ESCAPE HTML (modal summary) ────────────────────────── */
function escapeHtml(str) {
  return str.replace(/[<>&"']/g, c => (
    { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/* ─── MODAL ──────────────────────────────────────────────── */
function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
document.getElementById('modal').addEventListener('click', e => {
  if (e.target.id === 'modal') closeModal();
});

// Fechar modal com Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
