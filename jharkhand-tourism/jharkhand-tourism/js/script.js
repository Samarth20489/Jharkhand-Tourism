/* ============================================
   JHARKHAND TOURISM — Main JavaScript
   ============================================ */

// ---- Supabase Configuration (Optional) ----
let supabaseClient = null;

// Initialize Supabase only if library is loaded
if (typeof supabase !== 'undefined') {
  try {
    const SUPABASE_URL = 'https://qdxdwrpljyejupksredi.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkeGR3cnBsanllanVwa3NyZWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzI4ODQsImV4cCI6MjA5MjQ0ODg4NH0.V1vYMiqOHhAM1UpvocLa_p0I95X6nQlLCdoAYI1pDXs';
    const { createClient } = supabase;
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (error) {
    console.warn('Supabase initialization failed:', error);
  }
}

// ---- Language Translations ----
const translations = {
  en: {
    home: "Home",
    about: "About",
    bookHotel: "Book My Hotel",
    contact: "Contact Us",
    brand: "Jharkhand Tourism",
    tagline: "Explore the Beauty of Nature",
    heroTitle: 'Discover <span>Jharkhand</span>',
    heroSub: "Explore the untouched beauty of waterfalls, hills, temples & tribal heritage",
    heroCta: "Explore Places",
    placesSubtitle: "Top Destinations",
    placesTitle: 'Must Visit Places in <span>Jharkhand</span>',
    aboutSubtitle: "About Jharkhand",
    aboutTitle: 'The Land of <span>Forests</span>',
    aboutDesc1: "Jharkhand, meaning 'The Land of Forests', is a state in eastern India known for its stunning natural beauty, ancient temples, majestic waterfalls and vibrant tribal culture.",
    aboutDesc2: "From the misty hills of Netarhat to the sacred temples of Deoghar, Jharkhand offers a unique blend of spirituality, adventure, and natural wonders.",
    learnMore: "Learn More",
    ctaTitle: "Ready to Explore Jharkhand?",
    ctaSub: "Book your hotels now and plan the perfect getaway to the heart of tribal India.",
    ctaBtn: "Book Hotels Now",
    feedbackTitle: "Send Your Feedback",
    feedbackName: "Your Name",
    feedbackEmail: "Your Email",
    feedbackPhone: "Phone Number",
    feedbackSubject: "Subject",
    feedbackMsg: "Your Message...",
    feedbackSubmit: "Submit Feedback",
    footerDesc: "Explore the majestic waterfalls, ancient temples, lush forests and vibrant tribal culture of Jharkhand.",
    quickLinks: "Quick Links",
    contactInfo: "Contact Info",
    copyright: "© 2026 Jharkhand Tourism. College Project. All rights reserved.",
    exploreMore: "Explore More →",
    // Place cards
    rajrappaTitle: "Rajrappa Temple",
    rajrappaDesc: "Sacred Chinnamasta Temple at the confluence of Damodar & Bhairavi rivers.",
    rajrappaBadge: "Spiritual",
    betlaTitle: "Betla National Park",
    betlaDesc: "Home to wild elephants, tigers and diverse wildlife in dense forests.",
    betlaBadge: "Wildlife",
    deogharTitle: "Deoghar (Baidyanath)",
    deogharDesc: "One of the 12 Jyotirlingas, a major Hindu pilgrimage destination.",
    deogharBadge: "Pilgrimage",
    netarhatTitle: "Netarhat",
    netarhatDesc: "The 'Queen of Chotanagpur' — famous for breathtaking sunrises.",
    netarhatBadge: "Hill Station",
    hundruTitle: "Hundru Falls",
    hundruDesc: "A spectacular 98-meter waterfall near Ranchi amidst lush greenery.",
    hundruBadge: "Waterfall",
    parasnathTitle: "Parasnath Hill",
    parasnathDesc: "Jharkhand's highest peak and a sacred Jain pilgrimage site.",
    parasnathBadge: "Trekking",
    // Stats
    stat1Num: "32K+",
    stat1Label: "Sq Km Forests",
    stat2Num: "24",
    stat2Label: "Districts",
    stat3Num: "200+",
    stat3Label: "Tourist Spots",
    stat4Num: "32",
    stat4Label: "Tribal Groups",
  },
  hi: {
    home: "होम",
    about: "हमारे बारे में",
    bookHotel: "होटल बुक करें",
    contact: "संपर्क करें",
    brand: "झारखंड पर्यटन",
    tagline: "प्रकृति की सुंदरता का अन्वेषण करें",
    heroTitle: '<span>झारखंड</span> की खोज करें',
    heroSub: "झरनों, पहाड़ियों, मंदिरों और आदिवासी विरासत की अनछुई सुंदरता का अनुभव करें",
    heroCta: "स्थान देखें",
    placesSubtitle: "शीर्ष गंतव्य",
    placesTitle: '<span>झारखंड</span> में अवश्य देखने योग्य स्थान',
    aboutSubtitle: "झारखंड के बारे में",
    aboutTitle: '<span>वनों</span> की भूमि',
    aboutDesc1: "झारखंड, जिसका अर्थ है 'वनों की भूमि', पूर्वी भारत का एक राज्य है जो अपनी प्राकृतिक सुंदरता, प्राचीन मंदिरों, भव्य झरनों और जीवंत आदिवासी संस्कृति के लिए जाना जाता है।",
    aboutDesc2: "नेतरहाट की धुंध भरी पहाड़ियों से लेकर देवघर के पवित्र मंदिरों तक, झारखंड आध्यात्मिकता, रोमांच और प्राकृतिक अजूबों का अनूठा मिश्रण प्रदान करता है।",
    learnMore: "और जानें",
    ctaTitle: "झारखंड की खोज के लिए तैयार हैं?",
    ctaSub: "अभी अपने होटल बुक करें और आदिवासी भारत के हृदय में एक शानदार छुट्टी की योजना बनाएं।",
    ctaBtn: "होटल बुक करें",
    feedbackTitle: "अपनी प्रतिक्रिया भेजें",
    feedbackName: "आपका नाम",
    feedbackEmail: "आपका ईमेल",
    feedbackPhone: "फोन नंबर",
    feedbackSubject: "विषय",
    feedbackMsg: "आपका संदेश...",
    feedbackSubmit: "प्रतिक्रिया भेजें",
    footerDesc: "झारखंड के भव्य झरनों, प्राचीन मंदिरों, हरे-भरे जंगलों और जीवंत आदिवासी संस्कृति का अन्वेषण करें।",
    quickLinks: "त्वरित लिंक",
    contactInfo: "संपर्क जानकारी",
    copyright: "© 2026 झारखंड पर्यटन। कॉलेज प्रोजेक्ट। सर्वाधिकार सुरक्षित।",
    exploreMore: "और देखें →",
    rajrappaTitle: "राजरप्पा मंदिर",
    rajrappaDesc: "दामोदर और भैरवी नदियों के संगम पर पवित्र छिन्नमस्ता मंदिर।",
    rajrappaBadge: "आध्यात्मिक",
    betlaTitle: "बेतला राष्ट्रीय उद्यान",
    betlaDesc: "घने जंगलों में जंगली हाथियों, बाघों और विविध वन्यजीवों का घर।",
    betlaBadge: "वन्यजीव",
    deogharTitle: "देवघर (बैद्यनाथ)",
    deogharDesc: "12 ज्योतिर्लिंगों में से एक, एक प्रमुख हिंदू तीर्थ स्थल।",
    deogharBadge: "तीर्थयात्रा",
    netarhatTitle: "नेतरहाट",
    netarhatDesc: "'छोटानागपुर की रानी' — मनमोहक सूर्योदय के लिए प्रसिद्ध।",
    netarhatBadge: "हिल स्टेशन",
    hundruTitle: "हुंडरू जलप्रपात",
    hundruDesc: "रांची के पास घने हरियाली के बीच एक शानदार 98 मीटर ऊंचा जलप्रपात।",
    hundruBadge: "जलप्रपात",
    parasnathTitle: "पारसनाथ पहाड़ी",
    parasnathDesc: "झारखंड की सबसे ऊंची चोटी और एक पवित्र जैन तीर्थ स्थल।",
    parasnathBadge: "ट्रेकिंग",
    stat1Num: "32K+",
    stat1Label: "वर्ग किमी वन",
    stat2Num: "24",
    stat2Label: "जिले",
    stat3Num: "200+",
    stat3Label: "पर्यटन स्थल",
    stat4Num: "32",
    stat4Label: "आदिवासी समूह",
  },
  mr: {
    home: "मुख्यपृष्ठ",
    about: "आमच्याबद्दल",
    bookHotel: "हॉटेल बुक करा",
    contact: "संपर्क करा",
    brand: "झारखंड पर्यटन",
    tagline: "निसर्गाच्या सौंदर्याचा शोध घ्या",
    heroTitle: '<span>झारखंड</span> शोधा',
    heroSub: "धबधबे, टेकड्या, मंदिरे आणि आदिवासी वारशाच्या अस्पर्शित सौंदर्याचा अनुभव घ्या",
    heroCta: "ठिकाणे पहा",
    placesSubtitle: "शीर्ष ठिकाणे",
    placesTitle: '<span>झारखंड</span>मधील अवश्य भेट द्यावी अशी ठिकाणे',
    aboutSubtitle: "झारखंडबद्दल",
    aboutTitle: '<span>जंगलांची</span> भूमी',
    aboutDesc1: "झारखंड, म्हणजे 'जंगलांची भूमी', पूर्व भारतातील एक राज्य आहे जे त्याच्या नैसर्गिक सौंदर्य, प्राचीन मंदिरे, भव्य धबधबे आणि जिवंत आदिवासी संस्कृतीसाठी ओळखले जाते.",
    aboutDesc2: "नेतरहाटच्या धुक्याच्या टेकड्यांपासून देवघरच्या पवित्र मंदिरांपर्यंत, झारखंड अध्यात्म, साहस आणि नैसर्गिक चमत्कारांचे अनोखे मिश्रण देते.",
    learnMore: "अधिक जाणून घ्या",
    ctaTitle: "झारखंड शोधायला तयार आहात?",
    ctaSub: "आत्ताच तुमचे हॉटेल बुक करा आणि आदिवासी भारताच्या हृदयात एक उत्तम सुट्टी नियोजित करा.",
    ctaBtn: "हॉटेल बुक करा",
    feedbackTitle: "तुमचा अभिप्राय पाठवा",
    feedbackName: "तुमचे नाव",
    feedbackEmail: "तुमचा ईमेल",
    feedbackPhone: "फोन नंबर",
    feedbackSubject: "विषय",
    feedbackMsg: "तुमचा संदेश...",
    feedbackSubmit: "अभिप्राय पाठवा",
    footerDesc: "झारखंडच्या भव्य धबधब्यांचा, प्राचीन मंदिरांचा, हिरव्यागार जंगलांचा आणि जिवंत आदिवासी संस्कृतीचा शोध घ्या.",
    quickLinks: "द्रुत दुवे",
    contactInfo: "संपर्क माहिती",
    copyright: "© 2026 झारखंड पर्यटन. कॉलेज प्रकल्प. सर्व हक्क राखीव.",
    exploreMore: "अधिक पहा →",
    rajrappaTitle: "राजरप्पा मंदिर",
    rajrappaDesc: "दामोदर आणि भैरवी नद्यांच्या संगमावर पवित्र छिन्नमस्ता मंदिर.",
    rajrappaBadge: "अध्यात्मिक",
    betlaTitle: "बेतला राष्ट्रीय उद्यान",
    betlaDesc: "घनदाट जंगलांत रानटी हत्ती, वाघ आणि विविध वन्यजीवांचे निवासस्थान.",
    betlaBadge: "वन्यजीव",
    deogharTitle: "देवघर (बैद्यनाथ)",
    deogharDesc: "12 ज्योतिर्लिंगांपैकी एक, एक प्रमुख हिंदू तीर्थक्षेत्र.",
    deogharBadge: "तीर्थयात्रा",
    netarhatTitle: "नेतरहाट",
    netarhatDesc: "'छोटानागपूरची राणी' — मनमोहक सूर्योदयासाठी प्रसिद्ध.",
    netarhatBadge: "हिल स्टेशन",
    hundruTitle: "हुंडरू धबधबा",
    hundruDesc: "रांचीजवळ दाट हिरवळीत एक भव्य 98 मीटर उंच धबधबा.",
    hundruBadge: "धबधबा",
    parasnathTitle: "पारसनाथ टेकडी",
    parasnathDesc: "झारखंडचे सर्वोच्च शिखर आणि एक पवित्र जैन तीर्थक्षेत्र.",
    parasnathBadge: "ट्रेकिंग",
    stat1Num: "32K+",
    stat1Label: "चौ. किमी जंगल",
    stat2Num: "24",
    stat2Label: "जिल्हे",
    stat3Num: "200+",
    stat3Label: "पर्यटन स्थळे",
    stat4Num: "32",
    stat4Label: "आदिवासी समूह",
  }
};

let currentLang = 'en';

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  initLanguageSwitcher();
  initRippleEffects();
  initStickyHeader();
  initScrollAnimations();
  initMobileMenu();
  initFeedbackForm();
});

// ---- Hero Carousel ----
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  const prevBtn = document.querySelector('.hero__arrow--prev');
  const nextBtn = document.querySelector('.hero__arrow--next');
  if (!slides.length) return;

  let current = 0;
  let interval;

  function goTo(idx) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    interval = setInterval(next, 5000);
  }

  function resetAutoplay() {
    clearInterval(interval);
    startAutoplay();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
  });

  goTo(0);
  startAutoplay();
}

// ---- Language Switcher ----
function initLanguageSwitcher() {
  const btns = document.querySelectorAll('.lang-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;
      currentLang = lang;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyTranslations(lang);
    });
  });
}

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.innerHTML = t[key];
      }
    }
  });
}

// ---- Ripple Effect on Buttons ----
function initRippleEffects() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.ripple');
    if (!btn) return;

    const circle = document.createElement('span');
    circle.classList.add('ripple__circle');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
    circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
  });
}

// ---- Sticky Header Shadow ----
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ---- Scroll Fade-in Animations ----
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => observer.observe(el));
}

// ---- Mobile Hamburger Menu ----
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    });
  });
}

// ---- Feedback Form Validation ----
function initFeedbackForm() {
  const form = document.getElementById('feedbackForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    const subject = form.querySelector('[name="subject"]');
    const message = form.querySelector('[name="message"]');

    if (!name.value.trim() || !email.value.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(email.value)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // Submit to Supabase if available
    if (supabaseClient && typeof submitFeedbackToSupabase === 'function') {
      const result = await submitFeedbackToSupabase(
        name.value,
        email.value,
        phone.value || '',
        subject.value || '',
        message.value || ''
      );

      if (result.success) {
        showToast('Thank you for your feedback! 🙏');
        form.reset();
      } else {
        showToast('Error submitting feedback: ' + result.error, 'error');
      }
    } else {
      // Fallback if Supabase not available
      showToast('Thank you for your feedback! 🙏');
      form.reset();
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---- Toast Notification ----
function showToast(msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.classList.add('toast');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.background = type === 'error' ? '#ef4444' : '#1a8a5c';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
