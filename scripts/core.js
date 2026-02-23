/**
 * Core Website Functionality - Optimized & Secure
 * Handles essential features: header, navigation, language, accessibility
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

  // Safe DOM element creation
  createElement(tag, className, attributes = {}) {
    const element = document.createElement(tag)
    if (className) element.className = className
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value)
    })
    return element
  },

  // Sanitize strings for XSS prevention
  sanitizeString(str) {
    if (typeof str !== "string") return ""
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .trim()
      .substring(0, 500)
  },
}

// Enhanced Header Controller
class HeaderController {
  constructor() {
    this.header = document.querySelector("header")
    this.lastScrollY = 0
    this.scrollThreshold = 50
    this.hideThreshold = 200
    this.isScrolling = false

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
    const scrollDifference = Math.abs(currentScrollY - this.lastScrollY)

    // Only update if scroll difference is significant
    if (scrollDifference < 5) return

    const scrollDirection = currentScrollY > this.lastScrollY ? "down" : "up"

    // Apply scrolled state
    this.header.classList.toggle("scrolled", currentScrollY > this.scrollThreshold)

    // Desktop: always visible
    if (window.innerWidth > 768) {
      this.header.classList.remove("scrolled-hidden", "scrolled-visible")
      return;
    }

    // Handle header visibility
    if (currentScrollY > this.hideThreshold) {
      if (scrollDirection === "down" && currentScrollY > this.lastScrollY + 10) {
        this.header.classList.add("scrolled-hidden")
        this.header.classList.remove("scrolled-visible")
      } else if (scrollDirection === "up" && currentScrollY < this.lastScrollY - 10) {
        this.header.classList.remove("scrolled-hidden")
        this.header.classList.add("scrolled-visible")
      }
    } else {
      this.header.classList.remove("scrolled-hidden")
      this.header.classList.add("scrolled-visible")
    }

    this.lastScrollY = currentScrollY
  }

  forceUpdate() {
    this.updateHeader()
  }
}

// Language Management System
class LanguageManager {
  constructor() {
    this.currentLanguage = "en"
    this.translations = window.translations || {}
    this.languages = (window.SITE_CONFIG && window.SITE_CONFIG.languages) || [
      { code: "en", label: "English", shortLabel: "ENG" },
      { code: "it", label: "Italiano", shortLabel: "ITA" },
      { code: "de", label: "Deutsch", shortLabel: "DEU" },
    ]
    this.switchers = document.querySelectorAll(".language-switcher")
    this.storageKey = "selectedLanguage"

    this.init()
  }

  init() {
    // Load saved language or detect from browser
    const savedLanguage = localStorage.getItem(this.storageKey)
    const browserLanguage = navigator.language.slice(0, 2)
    const validCodes = this.languages.map((l) => l.code)

    if (savedLanguage && validCodes.includes(savedLanguage)) {
      this.currentLanguage = savedLanguage
    } else if (validCodes.includes(browserLanguage)) {
      this.currentLanguage = browserLanguage
    }

    // Set document language
    document.documentElement.lang = this.currentLanguage

    // Build dropdown options and bind events for each switcher
    this.switchers.forEach((switcher) => this.setupSwitcher(switcher))

    this.updateAllSwitchers()
    this.applyTranslations()
  }

  setupSwitcher(switcher) {
    const dropdown = switcher.querySelector(".language-dropdown")
    const toggle = switcher.querySelector(".language-toggle")
    const listId = dropdown.id

    // Build options from config
    dropdown.innerHTML = ""
    this.languages.forEach((lang) => {
      const li = document.createElement("li")
      const optionId = `${listId}-${lang.code}`
      li.setAttribute("role", "option")
      li.setAttribute("id", optionId)
      li.setAttribute("data-lang", lang.code)
      li.setAttribute("tabindex", "-1")
      li.setAttribute("aria-selected", lang.code === this.currentLanguage ? "true" : "false")
      li.textContent = lang.label
      if (lang.code === this.currentLanguage) {
        li.classList.add("active")
        toggle.setAttribute("aria-activedescendant", optionId)
      }
      dropdown.appendChild(li)
    })

    // Toggle open/close
    toggle.addEventListener("click", (e) => {
      e.stopPropagation()
      const isOpen = toggle.getAttribute("aria-expanded") === "true"
      this.closeAllDropdowns()
      if (!isOpen) this.openDropdown(switcher)
    })

    // Select language on option click
    dropdown.addEventListener("click", (e) => {
      const option = e.target.closest("[data-lang]")
      if (option) {
        this.changeLanguage(option.getAttribute("data-lang"))
        this.closeAllDropdowns()
        toggle.focus()
      }
    })

    // Keyboard navigation
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        this.openDropdown(switcher)
        // Focus currently active option, or first
        const active = dropdown.querySelector("[role=option].active") || dropdown.querySelector("[role=option]")
        if (active) active.focus()
      }
    })

    dropdown.addEventListener("keydown", (e) => {
      const options = [...dropdown.querySelectorAll("[role=option]")]
      const current = document.activeElement
      const idx = options.indexOf(current)

      if (e.key === "ArrowDown") {
        e.preventDefault()
        const next = options[idx + 1] || options[0]
        next.focus()
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prev = options[idx - 1] || options[options.length - 1]
        prev.focus()
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (current.hasAttribute("data-lang")) {
          this.changeLanguage(current.getAttribute("data-lang"))
          this.closeAllDropdowns()
          toggle.focus()
        }
      } else if (e.key === "Escape") {
        this.closeAllDropdowns()
        toggle.focus()
      } else if (e.key === "Tab") {
        this.closeAllDropdowns()
      } else if (e.key === "Home") {
        e.preventDefault()
        options[0]?.focus()
      } else if (e.key === "End") {
        e.preventDefault()
        options[options.length - 1]?.focus()
      }
    })
  }

  openDropdown(switcher) {
    const toggle = switcher.querySelector(".language-toggle")
    toggle.setAttribute("aria-expanded", "true")
  }

  closeAllDropdowns() {
    this.switchers.forEach((s) => {
      const toggle = s.querySelector(".language-toggle")
      toggle.setAttribute("aria-expanded", "false")
    })
  }

  updateAllSwitchers() {
    const lang = this.languages.find((l) => l.code === this.currentLanguage)
    if (!lang) return

    this.switchers.forEach((switcher) => {
      const toggle = switcher.querySelector(".language-toggle")
      const current = switcher.querySelector(".language-current")
      if (current) current.textContent = lang.shortLabel

      // Update button aria-label with current language name
      toggle.setAttribute("aria-label", `Language: ${lang.label}`)

      // Update active state and aria-selected on options
      const options = switcher.querySelectorAll("[role=option]")
      options.forEach((opt) => {
        const isActive = opt.getAttribute("data-lang") === this.currentLanguage
        opt.classList.toggle("active", isActive)
        opt.setAttribute("aria-selected", isActive ? "true" : "false")
        if (isActive) {
          toggle.setAttribute("aria-activedescendant", opt.id)
        }
      })
    })
  }

  changeLanguage(language) {
    if (!this.translations[language]) {
      console.warn(`Language ${language} not available`)
      return
    }

    this.currentLanguage = language
    localStorage.setItem(this.storageKey, language)
    document.documentElement.lang = language

    this.updateAllSwitchers()
    this.applyTranslations()

    // Announce language change to screen readers
    const lang = this.languages.find((l) => l.code === language)
    if (lang && window.announceToScreenReader) {
      window.announceToScreenReader(`Language changed to ${lang.label}`)
    }

    // Dispatch event for other components
    document.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language },
      }),
    )
  }

  applyTranslations() {
    const elements = document.querySelectorAll("[data-key]")

    elements.forEach((element) => {
      const key = element.getAttribute("data-key")
      const translation = this.getTranslation(key)

      if (translation) {
        if (element.tagName === "INPUT" && element.type === "submit") {
          element.value = translation
        } else if (element.tagName === "INPUT" && element.placeholder !== undefined) {
          element.placeholder = translation
        } else {
          element.textContent = translation
        }
      }
    })
  }

  getTranslation(key) {
    const languageData = this.translations[this.currentLanguage]
    if (languageData && languageData[key]) return languageData[key]
    const fallback = this.translations["en"]
    return fallback ? fallback[key] : null
  }

  getCurrentLanguage() {
    return this.currentLanguage
  }
}

// Mobile Menu Handler
class MobileMenuHandler {
  constructor() {
    this.menuBtn = document.querySelector(".mobile-menu-btn")
    this.nav = document.querySelector("nav")
    this.navItems = document.querySelectorAll("nav a")
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

    // Close menu when clicking nav items
    this.navItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (this.isOpen && window.innerWidth <= 768) {
          this.closeMenu()
        }
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (this.isOpen && !this.nav.contains(e.target) && !this.menuBtn.contains(e.target)) {
        this.closeMenu()
      }
    })

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeMenu()
      }
    })

    // Close menu when window is resized to desktop
    window.addEventListener(
      "resize",
      utils.debounce(() => {
        if (window.innerWidth > 768 && this.isOpen) {
          this.closeMenu()
        }
      }, 250),
    )
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

// Smooth Scroll Handler
class SmoothScrollHandler {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href")
        if (href === "#") return

        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          this.scrollToElement(target)
        }
      })
    })
  }

  scrollToElement(element) {
    const header = document.querySelector("header")
    const headerHeight = header ? header.offsetHeight : 0
    const targetPosition = element.offsetTop - headerHeight - 20

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    })
  }
}

// Accessibility Enhancements
class AccessibilityEnhancer {
  constructor() {
    this.init()
  }

  init() {
    this.addSkipLink()
    this.enhanceFocusManagement()
    this.improveKeyboardNavigation()
    this.setupAriaLiveRegions()
  }

  addSkipLink() {
    const skipLink = utils.createElement("a", "skip-link", {
      href: "#main",
      "aria-label": "Skip to main content",
    })

    skipLink.textContent = "Skip to main content"
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
      border-radius: 4px;
      transition: top 0.3s ease;
    `

    skipLink.addEventListener("focus", () => {
      skipLink.style.top = "6px"
    })

    skipLink.addEventListener("blur", () => {
      skipLink.style.top = "-40px"
    })

    document.body.insertBefore(skipLink, document.body.firstChild)
  }

  enhanceFocusManagement() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation")
      }
    })

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-navigation")
    })
  }

  improveKeyboardNavigation() {
    document.querySelectorAll("[onclick], .clickable").forEach((element) => {
      if (!element.hasAttribute("tabindex")) {
        element.setAttribute("tabindex", "0")
      }

      element.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          element.click()
        }
      })
    })
  }

  setupAriaLiveRegions() {
    const liveRegion = utils.createElement("div", "sr-only", {
      "aria-live": "polite",
      "aria-atomic": "true",
      id: "live-region",
    })

    document.body.appendChild(liveRegion)

    // Global function to announce messages
    window.announceToScreenReader = (message) => {
      liveRegion.textContent = message
      setTimeout(() => {
        liveRegion.textContent = ""
      }, 1000)
    }
  }
}

// Error Handler
class ErrorHandler {
  constructor() {
    this.init()
  }

  init() {
    window.addEventListener("error", (e) => {
      this.logError(e.error, "Global Error")
    })

    window.addEventListener("unhandledrejection", (e) => {
      this.logError(e.reason, "Promise Rejection")
    })
  }

  logError(error, type) {
    const errorInfo = {
      type,
      message: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    }

    console.group(`❌ ${type}`)
    console.error(errorInfo)
    console.groupEnd()

    // In production, send to error tracking service
    // analytics.track('error', errorInfo);
  }
}

// Footer Link Manager
class FooterLinkManager {
  constructor() {
    this.init()
  }

  init() {
    this.updateInstagramLink()
  }

  updateInstagramLink() {
    if (window.SITE_CONFIG?.contact?.instagram) {
      const instagramLink = document.getElementById("footer-instagram-link")
      if (instagramLink) {
        instagramLink.href = `https://www.instagram.com/${window.SITE_CONFIG.contact.instagram}`
      }
    }
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

// Initialize core functionality
document.addEventListener("DOMContentLoaded", () => {

  try {
    // Initialize core components
    window.headerController = new HeaderController()
    window.languageManager = new LanguageManager()
    window.mobileMenuHandler = new MobileMenuHandler()
    window.smoothScrollHandler = new SmoothScrollHandler()
    window.accessibilityEnhancer = new AccessibilityEnhancer()
    window.errorHandler = new ErrorHandler()
    window.footerLinkManager = new FooterLinkManager()

    // Expose language manager globally
    window.changeLanguage = (language) => {
      if (window.languageManager) {
        window.languageManager.changeLanguage(language)
      }
    }

    // Close language dropdowns on outside click
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".language-switcher")) {
        window.languageManager.closeAllDropdowns()
      }
    })

  } catch (error) {
    console.error("❌ Error during core initialization:", error)
  }
})

// Development debug helpers
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  window.debug = {
    header: () => window.headerController,
    language: () => window.languageManager,
    menu: () => window.mobileMenuHandler,
    forceHeaderUpdate: () => window.headerController?.forceUpdate(),
    getCurrentLanguage: () => window.languageManager?.getCurrentLanguage(),
  }

}
