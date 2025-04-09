// Language switching, mobile nav toggle, smooth scroll, progress ring update, share modal open/close and copy link

function initializeLanguage() {
  let currentLang = localStorage.getItem("language") || "en";

  if (!localStorage.getItem("language")) {
    const browserLang = navigator.language.split("-")[0];
    if (["en", "it", "sw", "de"].includes(browserLang)) {
      currentLang = browserLang;
    }
  }

  const langSelect = document.getElementById("language-select");
  const langSelectFooter = document.getElementById("language-select-footer");

  if (langSelect) langSelect.value = currentLang;
  if (langSelectFooter) langSelectFooter.value = currentLang;

  changeLanguage(currentLang);
}

function changeLanguage(lang) {
  document.querySelectorAll(".lang").forEach((element) => {
    element.style.opacity = "0";
    setTimeout(() => {
      const key = element.getAttribute("data-key");
      if (key && window.translations && window.translations[lang] && window.translations[lang][key]) {
        element.innerHTML = window.translations[lang][key];
      }
      element.style.opacity = "1";
    }, 150);
  });

  localStorage.setItem("language", lang);
  document.documentElement.lang = lang;
}

function scrollToProject() {
  const projectSection = document.querySelector("#the-project");
  if (projectSection) {
    projectSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function updateProgressRing() {
  const ring = document.querySelector(".progress-ring__circle");
  const percent = 58; // You can update this easily
  const radius = 28;  // Your correct SVG radius
  const circumference = 2 * Math.PI * radius;

  if (ring) {
    ring.style.strokeDasharray = `${circumference} ${circumference}`;
    ring.style.strokeDashoffset = circumference;

    const offset = circumference - (percent / 100) * circumference;
    ring.style.strokeDashoffset = offset;

    const progressText = document.querySelector(".progress-ring__text");
    if (progressText) {
      progressText.textContent = `${percent}%`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeLanguage();
  updateProgressRing();

  const langSelect = document.getElementById("language-select");
  const langSelectFooter = document.getElementById("language-select-footer");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const nav = document.querySelector("nav");

  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      changeLanguage(e.target.value);
      if (langSelectFooter) langSelectFooter.value = e.target.value;
    });
  }

  if (langSelectFooter) {
    langSelectFooter.addEventListener("change", (e) => {
      changeLanguage(e.target.value);
      if (langSelect) langSelect.value = e.target.value;
    });
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ===== Share Modal: ONLY opening, closing, copy link functionality =====
  const shareModal = document.getElementById("share-modal");
  const shareClose = document.querySelector(".share-close");
  const shareButtons = document.querySelectorAll('a.lang[data-key="hero_read"], a.lang[data-key="cta_share"]');
  const copyLink = document.getElementById("copy-link");

  shareButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      if (shareModal) {
        shareModal.style.display = "block";
      }
    });
  });

  if (shareClose) {
    shareClose.addEventListener("click", () => {
      shareModal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === shareModal) {
      shareModal.style.display = "none";
    }
  });

  if (copyLink) {
    copyLink.addEventListener("click", () => {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link."));
    });
  }
});
// Scroll effect for header background
document.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Lightbox functionality
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.createElement('div');
  lightbox.classList.add('lightbox');
  document.body.appendChild(lightbox);

  const lightboxImg = document.createElement('img');
  lightbox.appendChild(lightboxImg);

  const lightboxClose = document.createElement('div');
  lightboxClose.classList.add('lightbox-close');
  lightboxClose.innerHTML = '&times;';
  lightbox.appendChild(lightboxClose);

  const triggers = document.querySelectorAll('.lightbox-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('href');
      lightboxImg.src = imgSrc;
      lightbox.classList.add('active');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      lightbox.classList.remove('active');
    }
  });
});

