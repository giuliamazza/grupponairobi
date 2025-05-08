// Declare variables
const shareModal = document.getElementById("shareModal")
const shareButtons = document.querySelectorAll(".share-button")
const shareClose = document.getElementById("shareClose")

// Function to close the mobile menu (replace with actual implementation)
const closeMobileMenu = () => {
  // Your implementation here
  console.log("closeMobileMenu function called")
}

// Improve keyboard accessibility for share modal
if (shareModal) {
  // Update ARIA attributes when opening/closing modal
  const updateModalAccessibility = (isOpen) => {
    shareModal.setAttribute("aria-hidden", !isOpen)

    // Get all focusable elements in the modal
    const focusableElements = shareModal.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')

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

  // Add event listener for the new close button
  const closeShareModalBtn = document.getElementById("close-share-modal")
  if (closeShareModalBtn) {
    closeShareModalBtn.addEventListener("click", () => {
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
      const focusableElements = shareModal.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')
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

// Add this function to your existing main.js file

// Format currency amounts based on language
function formatCurrencyForLanguage(value, lang) {
  if (lang === "en") {
    // English uses comma as thousands separator
    return "€" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  } else {
    // Italian and German use dot as thousands separator
    return "€" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }
}

// Update all amount elements with the correct format
function updateAmountFormats(lang) {
  document.querySelectorAll(".amount").forEach((element) => {
    const value = element.getAttribute("data-value")
    if (value) {
      // If it's inside parentheses (like in timeline items)
      if (element.tagName.toLowerCase() === "em") {
        element.textContent = "(" + formatCurrencyForLanguage(value, lang) + ")"
      } else {
        element.textContent = formatCurrencyForLanguage(value, lang)
      }
    }
  })
}

// This function can be removed or commented out
// function updateElementText(element, lang) {
//   console.log(`Updating element text to language: ${lang}`)
//   element.textContent = "Translated (" + lang + ")"
// }

// Modify your existing changeLanguage function to call updateAmountFormats
function changeLanguage(lang, animate = true) {
  console.log("Changing language to:", lang)

  // Save language preference
  localStorage.setItem("language", lang)

  // Update currency formats
  updateAmountFormats(lang)

  document.querySelectorAll(".lang").forEach((element) => {
    if (animate) {
      element.style.opacity = "0"
      setTimeout(() => {
        updateElementTextFunc(element, lang)
        element.style.opacity = "1"
      }, 50) // Reduced from 150ms to 50ms for faster response
    } else {
      // Immediate update without animation for initial load
      updateElementTextFunc(element, lang)
    }
  })

  // Update HTML lang attribute
  document.documentElement.lang = lang
}

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
      closeMobileMenuFunc() // Close mobile menu when changing language
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
      closeMobileMenuFunc()

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
          closeMobileMenuFunc()
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
      const focusableElements = shareModal.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')

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
        closeMobileMenuFunc()
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
        const focusableElements = shareModal.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')
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
  changeLanguageInner(currentLang, false)
}

function changeLanguageInner(lang, animate = true) {
  console.log("Changing language to:", lang)

  // Save language preference
  localStorage.setItem("language", lang)

  // Update currency formats
  updateAmountFormats(lang)

  document.querySelectorAll(".lang").forEach((element) => {
    if (animate) {
      element.style.opacity = "0"
      setTimeout(() => {
        updateElementTextFunc(element, lang)
        element.style.opacity = "1"
      }, 50) // Reduced from 150ms to 50ms for faster response
    } else {
      // Immediate update without animation for initial load
      updateElementTextFunc(element, lang)
    }
  })

  // Update HTML lang attribute
  document.documentElement.lang = lang
}

function updateElementTextFunc(element, lang) {
  const key = element.getAttribute("data-key")
  if (key && window.translations && window.translations[lang] && window.translations[lang][key]) {
    element.innerHTML = window.translations[lang][key]
  }
}

function closeMobileMenuFunc() {
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
  // Group 1: Section headings - appear first
  const sectionHeadings = document.querySelectorAll("section h2")
  sectionHeadings.forEach((heading) => {
    heading.classList.add("fade-in")
  })

  // Group 2: Main content - appear second
  const sections = document.querySelectorAll("section")
  sections.forEach((section) => {
    const paragraphs = section.querySelectorAll("p")
    paragraphs.forEach((p) => {
      p.classList.add("fade-in", "fade-in-delay-1")
    })
  })

  // Group 3: Interactive elements - appear third
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((btn) => {
    btn.classList.add("fade-in", "fade-in-delay-2")
  })

  // Group 4: Timeline items - appear in sequence but faster
  const timelineItems = document.querySelectorAll(".timeline-item")
  timelineItems.forEach((item, index) => {
    item.classList.add("fade-in")
    // Faster sequential appearance
    item.style.transitionDelay = `${0.05 * index}s`
  })

  // Group 5: Team members - appear together
  const teamMembers = document.querySelectorAll(".team-member")
  teamMembers.forEach((member) => {
    member.classList.add("fade-in", "fade-in-delay-1")
  })

  // Group 6: Values - appear together
  const values = document.querySelectorAll(".value")
  values.forEach((value) => {
    value.classList.add("fade-in", "fade-in-delay-2")
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
