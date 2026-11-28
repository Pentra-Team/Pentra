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

document.addEventListener('click', (e) => {
  if (!userMenu.contains(e.target)) closeUserMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeUserMenu();
});
// =====================================================
//  التخصصات (لحد ما يجهز الباك اند)
// =====================================================
const SPEC_ICONS = {
  palette: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.7-1.5 1.6-1.5H16a5 5 0 0 0 5-5c0-4.1-4-7.5-9-7.5z"/><circle cx="7.5" cy="11.5" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="15" cy="7.5" r="1"/></svg>`,
  code:    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7.5L4.2 12.5 9 17.5"/><path d="M15 7.5l4.8 5-4.8 5"/><path d="M13.5 5l-3 15"/></svg>`,
  data:    `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5.5" rx="7.5" ry="2.5"/><path d="M4.5 5.5v6c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-6"/><path d="M4.5 11.5v6c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-6"/></svg>`,
  target:  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>`,
  shield:  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>`,
  brain:   `<svg width="22" height="22" viewBox="0 0 25 25" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12.5 5A3.2 3.2 0 0 0 6.5 6.2A3.4 3.4 0 0 0 4.9 11.5A3.4 3.4 0 0 0 6.3 16.9A3.2 3.2 0 0 0 12.5 18"/><path d="M12.5 5A3.2 3.2 0 0 1 18.5 6.2A3.4 3.4 0 0 1 20.1 11.5A3.4 3.4 0 0 1 18.7 16.9A3.2 3.2 0 0 1 12.5 18"/><path d="M12.5 5v13"/></svg>`,
};

const SPECIALIZATIONS = [
  {
    title: 'التصميم وتجربة المستخدم',
    desc: 'تعلّم تصميم واجهات جميلة وتجارب سهلة ومؤثرة.',
    icon: 'palette',
    tint: '#F1EEFE', color: '#7A5AF8',
    tags: ['design'],
  },
  {
    title: 'البرمجة وتطوير البرمجيات',
    desc: 'اكتسب مهارات بناء المواقع والتطبيقات الحديثة.',
    icon: 'code',
    tint: '#EEF0FE', color: '#5865F2',
    tags: ['programming'],
  },
  {
    title: 'تحليل البيانات',
    desc: 'حوّل البيانات إلى قرارات ورؤى قابلة للتنفيذ.',
    icon: 'data',
    tint: '#E3F7FC', color: '#0EA5C6',
    tags: ['data'],
  },
  {
    title: 'التسويق الرقمي',
    desc: 'ابنِ حملات رقمية تصل للجمهور وتحقق النتائج.',
    icon: 'target',
    tint: '#EEF0FE', color: '#5865F2',
    tags: ['design'],
  },
  {
    title: 'الأمن السيبراني',
    desc: 'تعلّم حماية الأنظمة والبيانات من المخاطر.',
    icon: 'shield',
    tint: '#EEF1F6', color: '#3B4A6B',
    tags: ['programming'],
  },
  {
    title: 'الذكاء الاصطناعي',
    desc: 'استكشف تقنيات المستقبل وتطبيقاتها العملية.',
    icon: 'brain',
    tint: '#E3F4FD', color: '#0EA5E9',
    tags: ['programming', 'data'],
  },
];

// =====================================================
//  الرسم + البحث + الفلاتر
// =====================================================
const spGrid = document.getElementById('spGrid');
const spEmpty = document.getElementById('spEmpty');
const spSearch = document.getElementById('spSearch');
const chips = document.querySelectorAll('.chip');

let spFilter = 'all';
let spQuery = '';

const ARROW = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>`;

function renderSpecs() {
  const q = spQuery.trim();

  const items = SPECIALIZATIONS.filter((s) => {
    const matchFilter = spFilter === 'all' || s.tags.includes(spFilter);
    const matchSearch = !q || s.title.includes(q) || s.desc.includes(q);
    return matchFilter && matchSearch;
  });

  spGrid.innerHTML = items.map((s, i) => `
        <a href="specialization-details.html" class="sp-card" style="--tint:${s.tint}; --color:${s.color}; animation-delay:${i * 50}ms">
      <span class="sp-icon">${SPEC_ICONS[s.icon]}</span>
      <h3 class="sp-title">${s.title}</h3>
      <p class="sp-desc">${s.desc}</p>
      <span class="sp-link">
        <span>اكتشف المجال</span>
        ${ARROW}
      </span>
    </a>
  `).join('');

  spEmpty.classList.toggle('show', items.length === 0);
}

// ---------- الفلاتر ----------
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => {
      c.classList.remove('active');
      c.setAttribute('aria-selected', 'false');
    });
    chip.classList.add('active');
    chip.setAttribute('aria-selected', 'true');

    spFilter = chip.dataset.filter;
    renderSpecs();
  });
});

// ---------- البحث ----------
spSearch.addEventListener('input', () => {
  spQuery = spSearch.value;
  renderSpecs();
});

renderSpecs();