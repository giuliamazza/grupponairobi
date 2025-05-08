// Main JavaScript for interactivity

// Set the project progress percentage in one place
// Change this value to update all progress indicators
const PROJECT_PROGRESS = 58 // Current progress percentage

document.addEventListener("DOMContentLoaded", () => {
  // Initialize language
  initializeLanguage()
  updateProgressIndicators()
  initAnimations()

  const langSelect = document.getElementById("language-select")
  const langSelectFooter = document.getElementById("language-select-footer")
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const nav = document.querySelector("nav")
  const navLinks = document.querySelectorAll("nav a")

  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      changeLanguage(e.target.value)
      if (langSelectFooter) langSelectFooter.value = e.target.value
      closeMobileMenu() // Close mobile menu when changing language
    })
  }

  if (langSelectFooter) {
    langSelectFooter.addEventListener("change", (e) => {
      changeLanguage(e.target.value)
      if (langSelect) langSelect.value = e.target.value
    })
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      nav.classList.toggle("active")
    })
  }

  // Add click event to all navigation links to close mobile menu
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Immediate close for better responsiveness
      closeMobileMenu()

      // Handle smooth scrolling for anchor links
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    })
  })

  // Optimize anchor links for better performance
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (!this.closest("nav")) {
        // Skip if already handled by nav links
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" })
          closeMobileMenu()
        }
      }
    })
  })


  // Lightbox
  const lightbox = document.createElement("div")
  lightbox.classList.add("lightbox")
  document.body.appendChild(lightbox)
  
  const lightboxImg = document.createElement("img")
  lightbox.appendChild(lightboxImg)
  
  const lightboxClose = document.createElement("div")
  lightboxClose.classList.add("lightbox-close")
  lightboxClose.innerHTML = "&times;"
  lightbox.appendChild(lightboxClose)
  
  // Set up delegated event listener (more reliable)
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".lightbox-trigger")
    if (!trigger) return
  
    e.preventDefault()
  
    const imgSrc = trigger.getAttribute("href")
    if (!imgSrc) return
  
    lightboxImg.src = imgSrc
    lightbox.classList.add("active")
  })
  
  // Handle close events
  lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("active")
  })
  
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active")
    }
  })
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      lightbox.classList.remove("active")
    }
  })
  

  // ===== Share Modal: ONLY opening, closing, copy link functionality =====
  const shareModal = document.getElementById("share-modal")
  const shareClose = document.querySelector(".share-close")
  const shareButtons = document.querySelectorAll('a.lang[data-key="hero_read"], a.lang[data-key="cta_share"]')
  const copyLink = document.getElementById("copy-link")

  if (shareModal) {
    // Update ARIA attributes when opening/closing modal
    const updateModalAccessibility = (isOpen) => {
      shareModal.setAttribute("aria-hidden", !isOpen)
      
      // Get all focusable elements in the modal
      const focusableElements = shareModal.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      )
      
      if (isOpen) {
        // Focus the first element when modal opens
        if (focusableElements.length > 0) {
          setTimeout(() => {
            focusableElements[0].focus()
          }, 50)
        }
      }
    }
    
    // Update open/close functions to handle accessibility
    shareButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        shareModal.style.display = "block"
        updateModalAccessibility(true)
        closeMobileMenu()
      })
    })
    
    if (shareClose) {
      shareClose.addEventListener("click", () => {
        shareModal.style.display = "none"
        updateModalAccessibility(false)
      })
    }
    
    // Handle keyboard navigation within modal
    shareModal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        shareModal.style.display = "none"
        updateModalAccessibility(false)
        return
      }
      
      if (e.key === "Tab") {
        const focusableElements = shareModal.querySelectorAll(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]
        
        // If shift+tab on first element, go to last element
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } 
        // If tab on last element, go to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    })
    
    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === shareModal) {
        shareModal.style.display = "none"
        updateModalAccessibility(false)
      }
    })
  }

  if (copyLink) {
    copyLink.addEventListener("click", () => {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link."))
    })
  }
})

// Language functions
function initializeLanguage() {
  // Check if a language preference is stored
  let currentLang = localStorage.getItem("language") || "en"

  // If no stored preference, try to detect browser language
  if (!localStorage.getItem("language")) {
    const browserLang = navigator.language.split("-")[0]
    if (["en", "it", "de"].includes(browserLang)) {
      currentLang = browserLang
    }
  }

  // Set the language select value
  const langSelect = document.getElementById("language-select")
  const langSelectFooter = document.getElementById("language-select-footer")

  if (langSelect) {
    langSelect.value = currentLang
  }

  if (langSelectFooter) {
    langSelectFooter.value = currentLang
  }

  // Apply translations immediately without transition
  changeLanguage(currentLang, false)
}

function changeLanguage(lang, animate = true) {
  console.log("Changing language to:", lang)

  // Save language preference
  localStorage.setItem("language", lang)

  document.querySelectorAll(".lang").forEach((element) => {
    if (animate) {
      element.style.opacity = "0"
      setTimeout(() => {
        updateElementText(element, lang)
        element.style.opacity = "1"
      }, 50) // Reduced from 150ms to 50ms for faster response
    } else {
      // Immediate update without animation for initial load
      updateElementText(element, lang)
    }
  })

  // Update HTML lang attribute
  document.documentElement.lang = lang
}

function updateElementText(element, lang) {
  const key = element.getAttribute("data-key")
  if (key && window.translations && window.translations[lang] && window.translations[lang][key]) {
    element.innerHTML = window.translations[lang][key]
  }
}

function closeMobileMenu() {
  const nav = document.querySelector("nav")
  if (nav && nav.classList.contains("active")) {
    nav.classList.remove("active")
  }
}

function scrollToProject() {
  const projectSection = document.querySelector("#the-project")
  if (projectSection) {
    projectSection.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

// Function to update all progress indicators based on PROJECT_PROGRESS
function updateProgressIndicators() {
  // Update progress ring
  updateProgressRing(PROJECT_PROGRESS)

  // Update funding progress bar
  updateFundingProgress(PROJECT_PROGRESS)
}

// Update the progress ring with the given percentage
function updateProgressRing(percent) {
  const ring = document.querySelector(".progress-ring__circle")
  const radius = 28 // SVG radius
  const circumference = 2 * Math.PI * radius

  if (ring) {
    ring.style.strokeDasharray = `${circumference} ${circumference}`
    ring.style.strokeDashoffset = circumference

    const offset = circumference - (percent / 100) * circumference
    ring.style.strokeDashoffset = offset

    const progressText = document.querySelector(".progress-ring__text")
    if (progressText) {
      progressText.textContent = `${percent}%`
    }
  }
}

// Update the funding progress bar with the given percentage
function updateFundingProgress(percent) {
  const progressBar = document.getElementById("funding-progress-bar")
  const progressText = document.getElementById("funding-progress-text")
  const remainingText = document.getElementById("funding-remaining-text")

  if (progressBar) {
    progressBar.style.width = `${percent}%`
  }

  if (progressText) {
    progressText.textContent = `${percent}%`
  }

  if (remainingText) {
    remainingText.textContent = `${100 - percent}%`
  }
}

// Initialize animations for fade-in elements
function initAnimations() {
  // Add fade-in class to elements we want to animate
  const sections = document.querySelectorAll("section")
  sections.forEach((section) => {
    const h2 = section.querySelector("h2")
    const paragraphs = section.querySelectorAll("p")
    const buttons = section.querySelectorAll(".btn")

    if (h2) h2.classList.add("fade-in")

    paragraphs.forEach((p, index) => {
      p.classList.add("fade-in")
      if (index === 1) p.classList.add("fade-in-delay-1")
      if (index === 2) p.classList.add("fade-in-delay-2")
    })

    buttons.forEach((btn) => {
      btn.classList.add("fade-in", "fade-in-delay-3")
    })
  })

  // Timeline items animation
  const timelineItems = document.querySelectorAll(".timeline-item")
  timelineItems.forEach((item, index) => {
    item.classList.add("fade-in")
    item.style.transitionDelay = `${0.1 * index}s`
  })

  // Team members animation
  const teamMembers = document.querySelectorAll(".team-member")
  teamMembers.forEach((member, index) => {
    member.classList.add("fade-in")
    member.style.transitionDelay = `${0.1 * index}s` // Reduced from 0.2s to 0.1s
  })

  // Values animation
  const values = document.querySelectorAll(".value")
  values.forEach((value, index) => {
    value.classList.add("fade-in")
    value.style.transitionDelay = `${0.1 * index}s` // Reduced from 0.2s to 0.1s
  })

  // Check which elements are in viewport on load
  checkVisibility()

  // Add scroll event listener to check for elements entering viewport
  window.addEventListener("scroll", checkVisibility)
}

function checkVisibility() {
  const fadeElements = document.querySelectorAll(".fade-in")

  fadeElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150 // How far from the top before the element becomes visible

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("visible")
    }
  })
}

// Scroll effect for header background
document.addEventListener("scroll", () => {
  const header = document.querySelector("header")
  if (window.scrollY > 10) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
})