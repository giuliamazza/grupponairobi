/**
 * Modern Lightbox Implementation
 * Secure, accessible, and optimized for performance
 */
document.addEventListener("DOMContentLoaded", () => {
  // Create lightbox elements
  const lightbox = document.createElement("div")
  lightbox.className = "lightbox"
  lightbox.setAttribute("role", "dialog")
  lightbox.setAttribute("aria-modal", "true")
  lightbox.setAttribute("aria-hidden", "true")
  lightbox.setAttribute("aria-label", "Image lightbox")
  document.body.appendChild(lightbox)

  // Create image element
  const lightboxImg = document.createElement("img")
  lightboxImg.setAttribute("alt", "") // Will be updated with caption text
  lightbox.appendChild(lightboxImg)

  // Create close button
  const lightboxClose = document.createElement("button")
  lightboxClose.className = "lightbox-close"
  lightboxClose.innerHTML = "&times;"
  lightboxClose.setAttribute("aria-label", "Close lightbox")
  lightbox.appendChild(lightboxClose)

  // Create navigation controls
  const lightboxNav = document.createElement("div")
  lightboxNav.className = "lightbox-nav"
  lightbox.appendChild(lightboxNav)

  const prevButton = document.createElement("button")
  prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>'
  prevButton.setAttribute("aria-label", "Previous image")
  lightboxNav.appendChild(prevButton)

  const nextButton = document.createElement("button")
  nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>'
  nextButton.setAttribute("aria-label", "Next image")
  lightboxNav.appendChild(nextButton)

  // Create caption container
  const lightboxCaption = document.createElement("div")
  lightboxCaption.className = "lightbox-caption"
  lightbox.appendChild(lightboxCaption)

  // Create counter
  const lightboxCounter = document.createElement("div")
  lightboxCounter.className = "lightbox-counter"
  lightbox.appendChild(lightboxCounter)

  const lightboxLoader = document.createElement("div")
  lightboxLoader.className = "lightbox-loader"
  lightbox.appendChild(lightboxLoader)

  const lightboxInstructions = document.createElement("div")
  lightboxInstructions.className = "lightbox-instructions"
  lightboxInstructions.textContent = "Use arrow keys to navigate, Escape to close"
  lightbox.appendChild(lightboxInstructions)

  // Get all lightbox triggers
  const lightboxTriggers = document.querySelectorAll(".lightbox-trigger")
  let currentIndex = 0

  // Collect all images and their captions
  const images = Array.from(lightboxTriggers).map((trigger) => ({
    src: trigger.getAttribute("href"),
    caption: trigger.nextElementSibling?.classList.contains("image-caption")
      ? trigger.nextElementSibling.textContent.trim()
      : "",
    trigger: trigger, // Store reference to the trigger element
  }))

  // Store the element that had focus before opening the lightbox
  let lastFocusedElement = null

  // Open lightbox function
  function openLightbox(index) {
    if (images.length === 0) return

    // Store the currently focused element
    lastFocusedElement = document.activeElement

    // Show loader while image loads
    lightboxLoader.style.display = "block"

    // Set current image
    currentIndex = index

    // Update the images array with current captions before showing the lightbox
    updateImagesArray()

    // Then update the lightbox content
    updateLightboxContent()

    // Show lightbox
    lightbox.setAttribute("aria-hidden", "false")
    lightbox.classList.add("active")

    // Prevent body scrolling
    document.body.classList.add("lightbox-open")

    // Set focus to close button after a short delay
    setTimeout(() => {
      lightboxClose.focus()
    }, 100)
  }

  // Add this new function to update the images array with current captions
  function updateImagesArray() {
    // Re-collect all images and their captions to get the latest translations
    lightboxTriggers.forEach((trigger, index) => {
      // Only update the caption, keep the src and trigger reference
      if (images[index]) {
        images[index].caption = trigger.nextElementSibling?.classList.contains("image-caption")
          ? trigger.nextElementSibling.textContent.trim()
          : ""
      }
    })
  }

  // Update lightbox content
  function updateLightboxContent() {
    const image = images[currentIndex]

    // Update counter
    lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`

    // Hide loader when image is loaded
    lightboxLoader.style.display = "none"

    // Update image source and caption
    lightboxImg.src = image.src
    lightboxImg.setAttribute("alt", image.caption || "Image")
    lightboxCaption.textContent = image.caption
  }

  // Close lightbox function
  function closeLightbox() {
    lightbox.classList.remove("active")

    // Wait for transition to complete before hiding completely
    setTimeout(() => {
      lightbox.setAttribute("aria-hidden", "true")

      // Re-enable body scrolling
      document.body.classList.remove("lightbox-open")

      // Return focus to the element that was focused before opening the lightbox
      if (lastFocusedElement) {
        lastFocusedElement.focus()
      }
    }, 300)
  }

  // Navigate to previous image
  function prevImage() {
    lightboxLoader.style.display = "block"
    currentIndex = (currentIndex - 1 + images.length) % images.length
    updateLightboxContent()
  }

  // Navigate to next image
  function nextImage() {
    lightboxLoader.style.display = "block"
    currentIndex = (currentIndex + 1) % images.length
    updateLightboxContent()
  }

  // Set up event listeners for lightbox triggers
  lightboxTriggers.forEach((trigger, index) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault()
      openLightbox(index)
    })

    // Add keyboard support for triggers
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        openLightbox(index)
      }
    })
  })

  // Event listeners
  lightboxClose.addEventListener("click", closeLightbox)

  prevButton.addEventListener("click", prevImage)
  nextButton.addEventListener("click", nextImage)

  // Close when clicking outside the image
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox()
    }
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("active")) {
      switch (e.key) {
        case "Escape":
          closeLightbox()
          break
        case "ArrowLeft":
          prevImage()
          break
        case "ArrowRight":
          nextImage()
          break
        case "Home":
          currentIndex = 0
          updateLightboxContent()
          break
        case "End":
          currentIndex = images.length - 1
          updateLightboxContent()
          break
      }
    }
  })

  // Trap focus within the lightbox when it's open
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      // Get all focusable elements in the lightbox
      const focusableElements = lightbox.querySelectorAll('button, [tabindex]:not([tabindex="-1"])')
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

  // Touch swipe support
  let touchStartX = 0
  let touchEndX = 0

  lightbox.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX
    },
    false,
  )

  lightbox.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    },
    false,
  )

  function handleSwipe() {
    const swipeThreshold = 50
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left, go to next image
      nextImage()
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right, go to previous image
      prevImage()
    }
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    if (lightbox.classList.contains("active")) {
      // Adjust lightbox positioning if needed
      // This is a placeholder for any specific adjustments needed on resize
    }
  })

  // Add a listener for language changes
  document.addEventListener("languageChanged", () => {
    // If the lightbox is currently open, update its content
    if (lightbox.classList.contains("active")) {
      updateImagesArray()
      updateLightboxContent()
    }
  })
})
