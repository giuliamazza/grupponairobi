/**
 * Core Minimal - Essential functionality for initial page load
 * Extracted from core.js to provide only what's needed for first paint
 */

// Utility functions
const utils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle
    return function () {
      const args = arguments

      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },
}

// Enhanced Header Controller - Minimal version
class HeaderController {
  constructor() {
    this.header = document.querySelector("header")
    this.lastScrollY = 0
    this.scrollThreshold = 50

    if (!this.header) {
      console.warn("Header element not found")
      return
    }

    this.init()
  }

  init() {
    // Use throttled scroll handler for better performance
    const throttledUpdate = utils.throttle(() => this.updateHeader(), 16) // ~60fps
    window.addEventListener("scroll", throttledUpdate, { passive: true })
    this.updateHeader() // Initial state
  }

  updateHeader() {
    const currentScrollY = window.scrollY
    this.header.classList.toggle("scrolled", currentScrollY > this.scrollThreshold)
    this.lastScrollY = currentScrollY
  }
}

// Mobile Menu Handler - Minimal version
class MobileMenuHandler {
  constructor() {
    this.menuBtn = document.querySelector(".mobile-menu-btn")
    this.nav = document.querySelector("nav")
    this.isOpen = false

    if (!this.menuBtn || !this.nav) {
      console.warn("Mobile menu elements not found")
      return
    }

    this.init()
  }

  init() {
    // Menu toggle
    this.menuBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.toggleMenu()
    })
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu()
  }

  openMenu() {
    this.nav.classList.add("active")
    this.menuBtn.setAttribute("aria-expanded", "true")
    this.menuBtn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>'
    this.isOpen = true
    document.body.style.overflow = "hidden"
  }

  closeMenu() {
    this.nav.classList.remove("active")
    this.menuBtn.setAttribute("aria-expanded", "false")
    this.menuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>'
    this.isOpen = false
    document.body.style.overflow = ""
  }
}

// Global utility functions
window.scrollToProject = () => {
  const projectSection = document.getElementById("the-project")
  if (projectSection) {
    const header = document.querySelector("header")
    const headerHeight = header ? header.offsetHeight : 0
    const targetPosition = projectSection.offsetTop - headerHeight - 20

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    })
  }
}

// Initialize core minimal functionality
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Initialize only essential components for first paint
    window.headerController = new HeaderController()
    window.mobileMenuHandler = new MobileMenuHandler()

    console.log("✅ Core minimal initialized")
  } catch (error) {
    console.error("❌ Error during core minimal initialization:", error)
  }
})
