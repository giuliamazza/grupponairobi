// Declare variables
const shareModal = document.getElementById("share-modal")
const shareButtons = document.querySelectorAll('a.lang[data-key="hero_read"], a.lang[data-key="cta_share"]')
const shareClose = document.querySelector(".share-close")
const copyLink = document.getElementById("copy-link")

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
  console.log("Updating amount formats for language:", lang)
  document.querySelectorAll(".amount").forEach((element) => {
    const value = element.getAttribute("data-value")
    console.log("Found element with data-value:", value)
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
  if (shareModal) {
    // Update ARIA attributes when opening/closing modal
    const updateModalAccessibility = (isOpen) => {
      shareModal.setAttribute("aria-hidden", !isOpen)

      if (isOpen) {
        // Add visible class for animation
        shareModal.classList.add("visible")

        // Get all focusable elements in the modal
        const focusableElements = shareModal.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')

        // Focus the first element when modal opens - minimal delay
        if (focusableElements.length > 0) {
          requestAnimationFrame(() => {
            focusableElements[0].focus()
          })
        }
      } else {
        // Remove visible class for animation
        shareModal.classList.remove("visible")
      }
    }

    // Update open/close functions to handle accessibility
    shareButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        shareModal.style.display = "block"
        // Minimal delay to allow display:block to take effect
        requestAnimationFrame(() => {
          updateModalAccessibility(true)
        })
        closeMobileMenuFunc()
      })
    })

    if (shareClose) {
      // Add keyboard support for the close button
      shareClose.addEventListener("click", () => {
        updateModalAccessibility(false)
        // Delay hiding the modal to allow for fade-out animation
        setTimeout(() => {
          shareModal.style.display = "none"
        }, 600) // Balanced delay for fade out
      })

      // Add keyboard support for the close button
      shareClose.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          updateModalAccessibility(false)
          // Delay hiding the modal to allow for fade-out animation
          setTimeout(() => {
            shareModal.style.display = "none"
          }, 600) // Balanced delay for fade out
        }
      })
    }

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === shareModal) {
        updateModalAccessibility(false)
        // Delay hiding the modal to allow for fade-out animation
        setTimeout(() => {
          shareModal.style.display = "none"
        }, 600) // Balanced delay for fade out
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

  // Check scroll position immediately on page load
  if (window.scrollY > 10) {
    const header = document.querySelector("header")
    if (header) {
      header.classList.add("scrolled")
    }
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

function updateElementTextFunc(element, lang) {
  const key = element.getAttribute("data-key")
  if (key && window.translations && window.translations[lang] && window.translations[lang][key]) {
    element.innerHTML = window.translations[lang][key]
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

// Replace the old checkVisibility function with this more efficient version
// that only runs when needed
function checkVisibility() {
  // This function is now handled by the IntersectionObserver in initAnimations
  // Keeping this as a placeholder for backward compatibility
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
