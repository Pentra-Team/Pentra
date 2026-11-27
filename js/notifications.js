// =====================================================
//  قائمة المستخدم المنسدلة (نفس الداشبورد)
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
//  الأيقونات
// =====================================================
const ICONS = {
  payments: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/></svg>`,
  courses:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M10.5 8.5l4 2-4 2z"/></svg>`,
  results:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/></svg>`,
  system:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`,
};

const CATEGORY_LABELS = {
  courses: 'الدورات',
  payments: 'المدفوعات',
  results: 'النتائج والشهادات',
  system: 'النظام',
};

// =====================================================
//  الإشعارات (لحد ما يجهز الباك اند)
// =====================================================
const notifications = [
  {
    id: 1,
    category: 'payments',
    title: 'تم الدفع بنجاح وتم تسجيلك في الدورة',
    desc: 'تم تفعيل تسجيلك في أساسيات UI/UX Design',
    time: 'منذ 1 ساعة',
    read: false,
  },
  {
    id: 2,
    category: 'courses',
    title: 'تمت إضافة محاضرة جديدة',
    desc: 'محاضرة التسلسل البصري أصبحت متاحة الآن',
    time: 'منذ 2 ساعة',
    read: false,
  },
  {
    id: 3,
    category: 'results',
    title: 'تم اعتماد نتيجتك النهائية',
    desc: 'نتيجة مبادئ التسويق الرقمي معتمدة.',
    time: 'منذ 3 ساعة',
    read: false,
  },
  {
    id: 4,
    category: 'results',
    title: 'أصبحت شهادتك جاهزة',
    desc: 'يمكنك عرض وتحميل شهادتك الآن.',
    time: 'منذ 4 ساعة',
    read: false,
  },
];

// =====================================================
//  الرسم والفلترة
// =====================================================
const list = document.getElementById('notifList');
const emptyMsg = document.getElementById('notifEmpty');
const markAllBtn = document.getElementById('markAllBtn');
const bellDot = document.getElementById('bellDot');
const tabs = document.querySelectorAll('.tab');

let currentFilter = 'all';

function render() {
  const items = currentFilter === 'all'
    ? notifications
    : notifications.filter((n) => n.category === currentFilter);

  list.innerHTML = items.map((n, i) => `
    <li class="n-item ${n.read ? 'read' : ''}" data-id="${n.id}" style="animation-delay:${i * 50}ms">
      <span class="icon-box icon-box-sm">${ICONS[n.category]}</span>
      <div class="n-body">
        <span class="n-tag">${CATEGORY_LABELS[n.category]}</span>
        <span class="n-title">${n.title}</span>
        <span class="n-desc">${n.desc}</span>
        <span class="n-time">${n.time}</span>
      </div>
      <span class="n-dot" aria-label="${n.read ? 'مقروء' : 'غير مقروء'}"></span>
    </li>
  `).join('');

  emptyMsg.classList.toggle('show', items.length === 0);
  updateUnreadState();
}

// النقطة على الجرس وزر "تحديد الكل"
function updateUnreadState() {
  const hasUnread = notifications.some((n) => !n.read);
  bellDot.classList.toggle('hide', !hasUnread);
  markAllBtn.disabled = !hasUnread;
}

// ---------- التابات ----------
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    currentFilter = tab.dataset.filter;
    render();
  });
});

// ---------- الضغط على إشعار = مقروء ----------
list.addEventListener('click', (e) => {
  const item = e.target.closest('.n-item');
  if (!item) return;

  const n = notifications.find((x) => x.id === Number(item.dataset.id));
  if (n && !n.read) {
    n.read = true;
    item.classList.add('read');
    updateUnreadState();
  }
});

// ---------- تحديد الكل كمقروء ----------
markAllBtn.addEventListener('click', () => {
  notifications.forEach((n) => { n.read = true; });
  list.querySelectorAll('.n-item').forEach((el) => el.classList.add('read'));
  updateUnreadState();
});

render();