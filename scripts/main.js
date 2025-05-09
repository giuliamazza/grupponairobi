// Declare variables
const shareModal = document.getElementById("share-modal")
const shareButtons = document.querySelectorAll('a.lang[data-key="hero_read"], a.lang[data-key="cta_share"]')
const shareClose = document.querySelector(".share-close")
const copyLink = document.getElementById("copy-link")

// Cache for current language to avoid unnecessary localStorage reads
let currentLanguage = null

// Console error suppression for third-party scripts - More targeted
;(() => {
  // Store the original console functions
  const originalConsoleError = console.error
  const originalConsoleLog = console.log
  const originalConsoleWarn = console.warn

  // Filter out specific error messages
  console.error = (...args) => {
    // Convert args to string for easier filtering
    const errorText = args.join(" ")

    // Filter out common errors
    if (
      errorText.includes("gofundme.com") ||
      errorText.includes("Transcend") ||
      errorText.includes("airgap.js") ||
      errorText.includes("xdi.js") ||
      errorText.includes("auth.gofundme.com") ||
      errorText.includes("mParticle") ||
      errorText.includes("frame-ancestors") ||
      errorText.includes("Content Security Policy") ||
      errorText.includes("Refused to frame") ||
      errorText.includes("has been blocked by CORS policy") ||
      errorText.includes("401 (Unauthorized)") ||
      errorText.includes("400 (Bad Request)")
    ) {
      // Suppress these errors
      return
    }

    // Pass other errors to the original console.error
    originalConsoleError.apply(console, args)
  }

  // Filter console.log as well - but only for specific patterns
  console.log = (...args) => {
    // Convert args to string for easier filtering
    const logText = args.join(" ")

    if (
      logText.includes("airgap.js") ||
      logText.includes("Successfully registered") ||
      logText.includes("GoogleAnalytics") ||
      logText.includes("GoogleTagManager") ||
      logText.includes("Optimizely") ||
      logText.includes("GoFundMe script not loaded") || // Suppress GoFundMe loading messages
      logText.includes("Initializing GoFundMe widgets") // Suppress GoFundMe initialization messages
    ) {
      // Suppress these logs
      return
    }

    // Pass other logs to the original console.log
    originalConsoleLog.apply(console, args)
  }

  // Filter console.warn as well - but only for specific patterns
  console.warn = (...args) => {
    // Convert args to string for easier filtering
    const warnText = args.join(" ")

    if (
      warnText.includes("preloaded") ||
      warnText.includes("not used within") ||
      warnText.includes("Invalid previewUrl") ||
      warnText.includes("preload") ||
      warnText.includes("credentials mode") ||
      warnText.includes("crossorigin attribute") ||
      warnText.includes("Content Security Policy") ||
      warnText.includes("was preloaded using link")
    ) {
      // Suppress these warnings
      return
    }

    // Pass other warnings to the original console.warn
    originalConsoleWarn.apply(console, args)
  }
})()

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

// Function to close the mobile menu
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

// Optimized localStorage functions
function getStoredLanguage() {
  // Use cached value if available
  if (currentLanguage) return currentLanguage

  try {
    return localStorage.getItem("language") || null
  } catch (e) {
    console.error("Error accessing localStorage:", e)
    return null
  }
}

function storeLanguage(lang) {
  // Only update localStorage if the language has changed
  if (currentLanguage === lang) return

  try {
    localStorage.setItem("language", lang)
    currentLanguage = lang // Update cache
  } catch (e) {
    console.error("Error storing language preference:", e)
  }
}

// Main JavaScript for interactivity
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

  // Simple language switching without disabling or animations
  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      const newLang = e.target.value
      changeLanguage(newLang)

      // Keep the footer select in sync
      if (langSelectFooter) {
        langSelectFooter.value = newLang
      }

      closeMobileMenuFunc() // Close mobile menu when changing language
    })
  }

  // Simple language switching for footer select
  if (langSelectFooter) {
    langSelectFooter.addEventListener("change", (e) => {
      const newLang = e.target.value
      changeLanguage(newLang)

      // Keep the header select in sync
      if (langSelect) {
        langSelect.value = newLang
      }
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

  if (copyLink) {
    copyLink.addEventListener("click", () => {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link."))
    })
  }

  // Check scroll position immediately on page load
  if (window.scrollY > 10) {
    const header = document.querySelector("header")
    if (header) {
      header.classList.add("scrolled")
    }
  }

  // Handle GoFundMe widgets - simplified approach
  handleGoFundMeWidgets()
})

// Language functions
function initializeLanguage() {
  // Check if a language preference is stored - use optimized function
  let lang = getStoredLanguage() || "en"

  // If no stored preference, try to detect browser language
  if (!lang) {
    const browserLang = navigator.language.split("-")[0]
    if (["en", "it", "de"].includes(browserLang)) {
      lang = browserLang
    } else {
      lang = "en" // Default to English
    }
  }

  // Set the language select value
  const langSelect = document.getElementById("language-select")
  const langSelectFooter = document.getElementById("language-select-footer")

  if (langSelect) {
    langSelect.value = lang
  }

  if (langSelectFooter) {
    langSelectFooter.value = lang
  }

  // Apply translations immediately without transition
  changeLanguage(lang)
}

// Simplified changeLanguage function - no animations, no disabling
function changeLanguage(lang) {
  // Skip if language hasn't changed
  if (currentLanguage === lang) return

  // Save language preference - use optimized function
  storeLanguage(lang)

  // Update currency formats
  updateAmountFormats(lang)

  // Make sure we have the translations object
  if (!window.translations || !window.translations[lang]) {
    console.error("Translations not found for language:", lang)
    return
  }

  try {
    // Update all elements with translations immediately
    document.querySelectorAll(".lang").forEach((element) => {
      updateElementTextFunc(element, lang)
    })

    // Update HTML lang attribute
    document.documentElement.lang = lang
  } catch (error) {
    console.error("Error updating translations:", error)
  }

  // Dispatch a custom event to notify other scripts of language change
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: lang } }))
}

// Fix the updateElementTextFunc to properly handle the translations structure
function updateElementTextFunc(element, lang) {
  try {
    const key = element.getAttribute("data-key")
    if (key && window.translations && window.translations[lang] && window.translations[lang][key]) {
      element.innerHTML = window.translations[lang][key]
    }
  } catch (error) {
    console.error("Error updating element text:", error)
  }
}

// Set the project progress percentage in one place
// Change this value to update all progress indicators
const PROJECT_PROGRESS = 58 // Current progress percentage

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

// Replace the initAnimations function with this more balanced version
function initAnimations() {
  // Use IntersectionObserver for better performance
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Add visible class when element enters viewport with minimal delay
        if (entry.isIntersecting) {
          // Minimal delay - just enough to prevent all elements appearing at once
          requestAnimationFrame(() => {
            entry.target.classList.add("visible")
          })
          fadeObserver.unobserve(entry.target) // Stop observing once visible
        }
      })
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, // Trigger when 10% of the element is visible
    },
  )

  // Group 1: Section headings - appear immediately
  const sectionHeadings = document.querySelectorAll("section h2")
  sectionHeadings.forEach((heading) => {
    heading.classList.add("fade-in")
    fadeObserver.observe(heading)
  })

  // Group 2: Main content - appear with minimal staggering
  const sections = document.querySelectorAll("section")
  sections.forEach((section) => {
    const paragraphs = section.querySelectorAll("p")
    paragraphs.forEach((p, index) => {
      p.classList.add("fade-in")
      // Very minimal delay based on index
      p.style.transitionDelay = `${0.03 * index}s` // Just enough to create a subtle flow
      fadeObserver.observe(p)
    })
  })

  // Group 3: Interactive elements
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((btn, index) => {
    btn.classList.add("fade-in")
    btn.style.transitionDelay = `${0.05 * index}s` // Minimal delay
    fadeObserver.observe(btn)
  })

  // Group 4: Timeline items - appear with subtle staggering
  const timelineItems = document.querySelectorAll(".timeline-item")
  timelineItems.forEach((item, index) => {
    item.classList.add("fade-in")
    // Subtle staggering
    const delay = 0.04 * index // Small incremental delay
    item.style.transitionDelay = `${delay}s`
    fadeObserver.observe(item)
  })

  // Group 5: Team members - appear with minimal staggering
  const teamMembers = document.querySelectorAll(".team-member")
  teamMembers.forEach((member, index) => {
    member.classList.add("fade-in")
    member.style.transitionDelay = `${0.05 * index}s` // Minimal delay between members
    fadeObserver.observe(member)
  })

  // Group 6: Values - appear with minimal staggering
  const values = document.querySelectorAll(".value")
  values.forEach((value, index) => {
    value.classList.add("fade-in")
    value.style.transitionDelay = `${0.08 * index}s` // Slightly longer delay between values
    fadeObserver.observe(value)
  })

  // Trigger initial check for elements already in viewport
  document.querySelectorAll(".fade-in").forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      // Immediate visibility for initial content
      requestAnimationFrame(() => {
        el.classList.add("visible")
      })
    }
  })
}

// Scroll effect for header background
window.addEventListener("scroll", () => {
  const header = document.querySelector("header")
  if (header) {
    if (window.scrollY > 10) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  }
})

// Improved GoFundMe widget handling
function handleGoFundMeWidgets() {
  // Show fallbacks immediately for all widgets
  const widgets = document.querySelectorAll(".gfm-embed")

  if (widgets.length === 0) return

  // For each widget, set up a fallback display after a timeout
  widgets.forEach((widget) => {
    // Set a timeout to check if iframe was created
    setTimeout(() => {
      const iframe = widget.querySelector("iframe")

      // If no iframe was created, show the fallback
      if (!iframe) {
        const fallbackContainer = widget.closest(".large-gofundme-container, .gfm-embed-container")
        if (fallbackContainer) {
          const fallback = fallbackContainer.querySelector(".gfm-fallback")
          if (fallback) {
            fallback.style.display = "block"
          }
        }
      } else {
        // If iframe exists, style it properly
        if (widget.closest(".large-gofundme-container")) {
          iframe.style.width = "100%"
          iframe.style.border = "none"

          // Remove extra padding that might be causing white space
          iframe.style.marginBottom = "0"
          iframe.style.paddingBottom = "0"
        }
      }
    }, 3000) // Check after 3 seconds
  })
}

// Share functionality
document.addEventListener("DOMContentLoaded", () => {
  // Share modal functionality
  const shareModal = document.getElementById("share-modal")
  const shareButtons = document.querySelectorAll('a.lang[data-key="hero_read"], a.lang[data-key="cta_share"]')
  const shareClose = document.querySelector(".share-close")

  // Store the element that had focus before opening the modal
  let previouslyFocusedElement = null

  // Open modal
  if (shareButtons && shareModal) {
    shareButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        // Store the element that had focus before opening the modal
        previouslyFocusedElement = document.activeElement

        // Show the modal
        shareModal.style.display = "block"
        shareModal.setAttribute("aria-hidden", "false")

        setTimeout(() => {
          shareModal.classList.add("visible")

          // Focus the close button
          if (shareClose) {
            shareClose.focus()
          }
        }, 10)
      })
    })
  }

  // Close modal
  if (shareClose && shareModal) {
    shareClose.addEventListener("click", () => {
      closeShareModal()
    })
  }

  // Close when clicking outside
  if (shareModal) {
    window.addEventListener("click", (e) => {
      if (e.target === shareModal) {
        closeShareModal()
      }
    })
  }

  // Close with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && shareModal && shareModal.style.display === "block") {
      closeShareModal()
    }
  })

  // Function to close the modal
  function closeShareModal() {
    shareModal.classList.remove("visible")

    setTimeout(() => {
      shareModal.style.display = "none"
      shareModal.setAttribute("aria-hidden", "true")

      // Return focus to the element that had focus before opening the modal
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus()
      }
    }, 300)
  }

  // Trap focus within the modal when it's open
  if (shareModal) {
    shareModal.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        const focusableElements = shareModal.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        // If shift+tab and focus is on first element, move to last element
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
        // If tab and focus is on last element, move to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    })
  }
})
