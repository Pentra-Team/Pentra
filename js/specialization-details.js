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