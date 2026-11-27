// =====================================================
//  إعدادات (للتجربة لحد ما يجهز الباك اند)
// =====================================================
const DEMO_CODE = '123456';      // الرمز الصح للتجربة
const MAX_ATTEMPTS = 3;          // كم محاولة غلط قبل القفل
const LOCK_MINUTES = 50;         // مدة القفل
const RESEND_SECONDS = 60;       // لازم يستنى قبل ما يعيد الإرسال

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// =====================================================
//  التنقل بين المراحل
// =====================================================
const steps = document.querySelectorAll('.step');
const heroImg = document.getElementById('heroImg');

function showStep(n) {
  steps.forEach((s) => s.classList.toggle('active', s.dataset.step === String(n)));

  // المرحلة الأخيرة: صورة الدرع بدل القفل
  heroImg.src = n === 4 ? 'images/3D-Shield.png' : 'images/3D-Lock.png';

  // نحط المؤشر على أول حقل بالمرحلة
  const firstInput = document.querySelector(`.step[data-step="${n}"] .input`);
  if (firstInput && !firstInput.disabled) firstInput.focus();
}

// =====================================================
//  العين: إظهار الباسوورد بالضغط وإخفاؤه بالإفلات
// =====================================================
document.querySelectorAll('.eye').forEach((eyeBtn) => {
  const input = document.getElementById(eyeBtn.dataset.target);

  const show = () => { input.type = 'text'; eyeBtn.classList.add('active'); };
  const hide = () => { input.type = 'password'; eyeBtn.classList.remove('active'); };

  eyeBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); show(); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) =>
    eyeBtn.addEventListener(ev, hide)
  );
});

// دالة صغيرة لإظهار/مسح الخطأ
function setError(el, msg, input) {
  el.textContent = msg;
  el.classList.remove('success');
  if (input) input.classList.toggle('has-error', !!msg);
}

// =====================================================
//  المرحلة 1: الإيميل
// =====================================================
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');

document.getElementById('emailForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();

  if (!email) return setError(emailError, 'الرجاء إدخال البريد الالكتروني', emailInput);
  if (!EMAIL_REGEX.test(email)) return setError(emailError, 'الرجاء إدخال بريد الكتروني صحيح', emailInput);

  setError(emailError, '', emailInput);
  console.log('Send code to:', email);
  showStep(2);
  startResendCooldown();
});

// =====================================================
//  المرحلة 2: رمز التحقق
// =====================================================
const codeInput = document.getElementById('code');
const codeBtn = document.getElementById('codeBtn');
const codeSubtitle = document.getElementById('codeSubtitle');
const resendRow = document.getElementById('resendRow');
const resendBtn = document.getElementById('resendBtn');
const lockMsg = document.getElementById('lockMsg');

const SUBTITLE_NORMAL = 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.';
const SUBTITLE_LOCKED = 'لقد حاولت إدخال رمز التحقق عدة مرات.';

let attempts = 0;
let lockTimer = null;
let resendTimer = null;

lockMsg.textContent = ''; // بالبداية مخفية

// أرقام بس بحقل الرمز
codeInput.addEventListener('input', () => {
  codeInput.value = codeInput.value.replace(/\D/g, '');
});

document.getElementById('codeForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const code = codeInput.value.trim();

  if (!code) return setError(lockMsg, 'الرجاء إدخال رمز التحقق', codeInput);

  if (code !== DEMO_CODE) {
    attempts++;
    if (attempts >= MAX_ATTEMPTS) return lockCode();
    const left = MAX_ATTEMPTS - attempts;
    return setError(lockMsg, `الرمز غير صحيح، تبقّى لك ${left} ${left === 1 ? 'محاولة' : 'محاولات'}`, codeInput);
  }

  // الرمز صح
  attempts = 0;
  setError(lockMsg, '', codeInput);
  showStep(3);
});

// ---------- القفل بعد محاولات كثيرة ----------
function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function lockCode() {
  let remaining = LOCK_MINUTES * 60;

  codeSubtitle.textContent = SUBTITLE_LOCKED;
  codeInput.value = '';
  codeInput.disabled = true;
  codeBtn.disabled = true;
  resendRow.style.display = 'none';
  codeInput.classList.remove('has-error');

  const tick = () => {
    lockMsg.textContent = `يرجى المحاولة مرة أخرى بعد ${formatTime(remaining)} دقيقة`;
    if (remaining-- <= 0) unlockCode();
  };
  tick();
  lockTimer = setInterval(tick, 1000);
}

function unlockCode() {
  clearInterval(lockTimer);
  attempts = 0;
  codeSubtitle.textContent = SUBTITLE_NORMAL;
  codeInput.disabled = false;
  codeBtn.disabled = false;
  resendRow.style.display = '';
  lockMsg.textContent = '';
}

// ---------- إعادة الإرسال ----------
function startResendCooldown() {
  let remaining = RESEND_SECONDS;
  resendBtn.disabled = true;

  clearInterval(resendTimer);
  const tick = () => {
    resendBtn.textContent = `إعادة إرسال (${remaining})`;
    if (remaining-- <= 0) {
      clearInterval(resendTimer);
      resendBtn.disabled = false;
      resendBtn.textContent = 'إعادة إرسال';
    }
  };
  tick();
  resendTimer = setInterval(tick, 1000);
}

resendBtn.addEventListener('click', () => {
  console.log('Resend code to:', emailInput.value.trim());
  lockMsg.textContent = 'تم إرسال رمز جديد إلى بريدك الإلكتروني';
  lockMsg.classList.add('success');
  codeInput.classList.remove('has-error');
  startResendCooldown();
});

// =====================================================
//  المرحلة 3: كلمة المرور الجديدة
// =====================================================
const newPass = document.getElementById('newPassword');
const confirmPass = document.getElementById('confirmNewPassword');
const resetError = document.getElementById('resetError');

document.getElementById('resetForm').addEventListener('submit', (e) => {
  e.preventDefault();

  if (!newPass.value || !confirmPass.value) {
    return setError(resetError, 'الرجاء تعبئة الحقلين');
  }
  if (newPass.value.length < 8) {
    return setError(resetError, 'كلمة المرور لازم تكون 8 أحرف على الأقل');
  }
  if (newPass.value !== confirmPass.value) {
    return setError(resetError, 'كلمة المرور وتأكيدها غير متطابقين');
  }

  setError(resetError, '');
  console.log('Password reset done');
  showStep(4);
});