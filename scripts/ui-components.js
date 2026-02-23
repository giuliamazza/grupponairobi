/**
 * UI Components - Lightbox, Share Modal, Animations, Forms
 * Modular and optimized for performance
 */

// Lightbox Component
class LightboxComponent {
  constructor() {
    this.lightbox = null
    this.currentIndex = 0
    this.images = []
    this.lastFocusedElement = null

    this.init()
  }

  init() {
    this.createLightboxElements()
    this.collectImages()
    this.setupEventListeners()
  }

  createLightboxElements() {
    // Create lightbox container
    this.lightbox = document.createElement("div")
    this.lightbox.className = "lightbox"
    this.lightbox.setAttribute("role", "dialog")
    this.lightbox.setAttribute("aria-modal", "true")
    this.lightbox.setAttribute("aria-hidden", "true")
    this.lightbox.setAttribute("aria-label", "Image lightbox")

    // Create content structure
    this.lightbox.innerHTML = `
      <div class="lightbox-content">
        <img alt="" />
      </div>
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <div class="lightbox-nav">
        <button aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
        <button aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
      </div>
      <div class="lightbox-caption"></div>
      <div class="lightbox-counter"></div>
      <div class="lightbox-loader"></div>
      <div class="lightbox-instructions">Use arrow keys to navigate, Escape to close</div>
    `

    document.body.appendChild(this.lightbox)

    // Cache elements
    this.elements = {
      content: this.lightbox.querySelector(".lightbox-content"),
      img: this.lightbox.querySelector("img"),
      close: this.lightbox.querySelector(".lightbox-close"),
      prev: this.lightbox.querySelector(".lightbox-nav button:first-child"),
      next: this.lightbox.querySelector(".lightbox-nav button:last-child"),
      caption: this.lightbox.querySelector(".lightbox-caption"),
      counter: this.lightbox.querySelector(".lightbox-counter"),
      loader: this.lightbox.querySelector(".lightbox-loader"),
    }
  }

  collectImages() {
    const triggers = document.querySelectorAll(".lightbox-trigger")
    this.images = Array.from(triggers).map((trigger) => ({
      src: trigger.getAttribute("href"),
      caption: trigger.nextElementSibling?.classList.contains("image-caption")
        ? trigger.nextElementSibling.textContent.trim()
        : "",
      trigger,
    }))
  }

  setupEventListeners() {
    // Trigger events
    document.querySelectorAll(".lightbox-trigger").forEach((trigger, index) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault()
        this.openLightbox(index)
      })

      trigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          this.openLightbox(index)
        }
      })
    })

    // Control events
    this.elements.close.addEventListener("click", () => this.closeLightbox())
    this.elements.prev.addEventListener("click", () => this.prevImage())
    this.elements.next.addEventListener("click", () => this.nextImage())

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!this.lightbox.classList.contains("active")) return

      switch (e.key) {
        case "Escape":
          this.closeLightbox()
          break
        case "ArrowLeft":
          this.prevImage()
          break
        case "ArrowRight":
          this.nextImage()
          break
        case "Home":
          this.currentIndex = 0
          this.updateContent()
          break
        case "End":
          this.currentIndex = this.images.length - 1
          this.updateContent()
          break
      }
    })

    // Close on outside click
    this.lightbox.addEventListener("click", (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox()
      }
    })

    // Touch swipe support
    this.setupTouchEvents()

    // Language change listener
    document.addEventListener("languageChanged", () => {
      if (this.lightbox.classList.contains("active")) {
        this.updateImagesArray()
        this.updateContent()
      }
    })
  }

  setupTouchEvents() {
    let touchStartX = 0
    let touchEndX = 0

    this.lightbox.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX
      },
      { passive: true },
    )

    this.lightbox.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX
        this.handleSwipe()
      },
      { passive: true },
    )

    const handleSwipe = () => {
      const swipeThreshold = 50
      if (touchEndX < touchStartX - swipeThreshold) {
        this.nextImage()
      } else if (touchEndX > touchStartX + swipeThreshold) {
        this.prevImage()
      }
    }

    this.handleSwipe = handleSwipe
  }

  openLightbox(index) {
    if (this.images.length === 0) return

    this.lastFocusedElement = document.activeElement
    this.currentIndex = index
    this.updateImagesArray()
    this.updateContent()

    this.lightbox.setAttribute("aria-hidden", "false")
    this.lightbox.classList.add("active")
    document.body.classList.add("lightbox-open")

    setTimeout(() => {
      this.elements.close.focus()
    }, 100)
  }

  closeLightbox() {
    this.lightbox.classList.remove("active")

    setTimeout(() => {
      this.lightbox.setAttribute("aria-hidden", "true")
      document.body.classList.remove("lightbox-open")

      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus()
      }
    }, 300)
  }

  updateImagesArray() {
    document.querySelectorAll(".lightbox-trigger").forEach((trigger, index) => {
      if (this.images[index]) {
        this.images[index].caption = trigger.nextElementSibling?.classList.contains("image-caption")
          ? trigger.nextElementSibling.textContent.trim()
          : ""
      }
    })
  }

  updateContent() {
    const image = this.images[this.currentIndex]

    this.elements.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`
    this.elements.loader.style.display = "none"

    this.elements.img.src = image.src
    this.elements.img.setAttribute("alt", image.caption || "Image")
    this.elements.caption.textContent = image.caption

    this.elements.img.onload = () => {
      this.elements.img.style = ""
    }
  }

  prevImage() {
    this.elements.loader.style.display = "block"
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
    this.updateContent()
  }

  nextImage() {
    this.elements.loader.style.display = "block"
    this.currentIndex = (this.currentIndex + 1) % this.images.length
    this.updateContent()
  }
}

// Share Modal Component
class ShareModalComponent {
  constructor() {
    this.modal = document.getElementById("share-modal")
    this.triggers = document.querySelectorAll('[data-key="hero_read"], [data-key="cta_share"]')
    this.closeBtn = document.querySelector(".share-close")
    this.copyBtn = document.getElementById("copy-link")

    if (!this.modal) return
    this.init()
  }

  init() {
    // Set up triggers
    this.triggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault()
        this.openModal()
      })
    })

    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.closeModal())
    }

    // Copy link functionality
    if (this.copyBtn) {
      this.copyBtn.addEventListener("click", () => this.copyLink())
    }

    // Close on outside click
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal()
      }
    })

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.style.display === "block") {
        this.closeModal()
      }
    })
  }

  openModal() {
    this.modal.style.display = "block"
    this.modal.setAttribute("aria-hidden", "false")

    setTimeout(() => {
      this.modal.classList.add("visible")
    }, 10)

    document.body.style.overflow = "hidden"

    if (this.closeBtn) {
      this.closeBtn.focus()
    }
  }

  closeModal() {
    this.modal.classList.remove("visible")

    setTimeout(() => {
      this.modal.style.display = "none"
      this.modal.setAttribute("aria-hidden", "true")
    }, 300)

    document.body.style.overflow = ""
  }

  async copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      this.showCopyFeedback()
    } catch (err) {
      console.error("Failed to copy link:", err)
      this.fallbackCopyLink()
    }
  }

  fallbackCopyLink() {
    const textArea = document.createElement("textarea")
    textArea.value = window.location.href
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
    this.showCopyFeedback()
  }

  showCopyFeedback() {
    const originalText = this.copyBtn.innerHTML
    this.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!'
    this.copyBtn.style.background = "#10b981"

    setTimeout(() => {
      this.copyBtn.innerHTML = originalText
      this.copyBtn.style.background = ""
    }, 2000)
  }
}

// Progress Ring Animation
class ProgressRingAnimator {
  constructor() {
    this.rings = document.querySelectorAll(".progress-ring__circle")
    this.init()
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateRing(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    this.rings.forEach((ring) => {
      observer.observe(ring)
    })
  }

  animateRing(ring) {
    const circumference = 2 * Math.PI * 28 // radius = 28
    const progress = 58 // 58%
    const offset = circumference - (progress / 100) * circumference

    ring.style.strokeDasharray = circumference
    ring.style.strokeDashoffset = circumference

    setTimeout(() => {
      ring.style.transition = "stroke-dashoffset 2s ease-in-out"
      ring.style.strokeDashoffset = offset
    }, 100)
  }
}

// Form Enhancement
class FormEnhancer {
  constructor() {
    this.forms = document.querySelectorAll("form")
    this.init()
  }

  init() {
    this.forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        this.handleSubmit(form)
      })

      const inputs = form.querySelectorAll("input, textarea")
      inputs.forEach((input) => {
        input.addEventListener("blur", () => this.validateField(input))
        input.addEventListener("input", () => this.clearErrors(input))
      })
    })
  }

  handleSubmit(form) {
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]')
    if (!submitBtn) return

    submitBtn.disabled = true
    submitBtn.style.opacity = "0.7"

    const originalText = submitBtn.textContent || submitBtn.value
    if (submitBtn.tagName === "BUTTON") {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
    } else {
      submitBtn.value = "Sending..."
    }

    // Reset after 5 seconds (fallback)
    setTimeout(() => {
      submitBtn.disabled = false
      submitBtn.style.opacity = ""
      if (submitBtn.tagName === "BUTTON") {
        submitBtn.textContent = originalText
      } else {
        submitBtn.value = originalText
      }
    }, 5000)
  }

  validateField(field) {
    const value = field.value.trim()
    let isValid = true
    let errorMessage = ""

    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        isValid = false
        errorMessage = "Please enter a valid email address"
      }
    }

    // Required field validation
    if (field.required && !value) {
      isValid = false
      errorMessage = "This field is required"
    }

    this.showFieldError(field, isValid, errorMessage)
    return isValid
  }

  showFieldError(field, isValid, message) {
    this.clearErrors(field)

    if (!isValid) {
      field.classList.add("error")

      const errorDiv = document.createElement("div")
      errorDiv.className = "field-error"
      errorDiv.textContent = message
      errorDiv.style.cssText = "color: #e53e3e; font-size: 0.875rem; margin-top: 0.25rem;"

      field.parentNode.appendChild(errorDiv)
    }
  }

  clearErrors(field) {
    field.classList.remove("error")
    const existingError = field.parentNode.querySelector(".field-error")
    if (existingError) {
      existingError.remove()
    }
  }
}

// Performance Monitor (Development only)
class PerformanceMonitor {
  constructor() {
    this.init()
  }

  init() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.logPerformanceMetrics()
      }, 1000)
    })
  }

  logPerformanceMetrics() {
    if ("performance" in window) {
      const navigation = performance.getEntriesByType("navigation")[0]
      const paint = performance.getEntriesByType("paint")
    }
  }
}

// Initialize UI Components
document.addEventListener("DOMContentLoaded", () => {

  try {
    // Initialize UI components
    window.lightboxComponent = new LightboxComponent()
    window.shareModalComponent = new ShareModalComponent()
    window.progressRingAnimator = new ProgressRingAnimator()
    window.formEnhancer = new FormEnhancer()

    // Development tools
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      window.performanceMonitor = new PerformanceMonitor()
    }

  } catch (error) {
    console.error("❌ Error during UI initialization:", error)
  }
})
