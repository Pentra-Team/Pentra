// =====================================================
//  قائمة المستخدم المنسدلة
// =====================================================
const userMenu = document.getElementById('userMenu');
const userBtn = document.getElementById('userBtn');

function closeUserMenu() {
  userMenu.classList.remove('open');
  userBtn.setAttribute('aria-expanded', 'false');
}

userBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = userMenu.classList.toggle('open');
  userBtn.setAttribute('aria-expanded', String(isOpen));
});

// تسكر لما تضغطي برّاها
document.addEventListener('click', (e) => {
  if (!userMenu.contains(e.target)) closeUserMenu();
});

// تسكر بزر Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeUserMenu();
});

// =====================================================
//  خطوات الرحلة
// =====================================================
const JOURNEY = [
  'أنشئ حسابك',
  'اكتشف التخصص والدورة',
  'اختر مستواك',
  'سجّل وأكمل الدفع',
  'ابدأ التعلم',
  'تابع تقدمك',
  'احصل على شهادتك',
];

const CURRENT_STEP = 5;   // ← غيّري هاد الرقم وكل إشي بيتحدّث لحاله

const CHECK_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7"/>
  </svg>`;

function renderJourney() {
  const list = document.getElementById('journeySteps');
  const pill = document.getElementById('journeyPill');

  list.innerHTML = JOURNEY.map((label, i) => {
    const n = i + 1;
    const state = n < CURRENT_STEP ? 'done' : n === CURRENT_STEP ? 'current' : 'todo';
    const dot = state === 'done' ? CHECK_ICON : n;

    return `
      <li class="js-step ${state}" ${state === 'current' ? 'aria-current="step"' : ''}>
        <span class="js-dot">${dot}</span>
        <span class="js-label">${label}</span>
      </li>`;
  }).join('');

  pill.textContent = `المرحلة ${CURRENT_STEP} من ${JOURNEY.length}`;
}

renderJourney();

// =====================================================
//  شريط التقدم: بيتعبّى بحركة لما تفتح الصفحة
// =====================================================
document.querySelectorAll('.progress').forEach((bar) => {
  const value = Number(bar.dataset.progress) || 0;
  const fill = bar.querySelector('.progress-fill');
  const label = bar.querySelector('.progress-value');

  if (label) label.textContent = `${value}%`;

  // تأخير صغير عشان تبيّن الحركة
  setTimeout(() => { fill.style.width = `${value}%`; }, 200);
});