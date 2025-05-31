/**
 * Smart Script Loader
 * Loads scripts only when they're needed based on user interaction and viewport visibility
 * Dramatically improves mobile performance by reducing initial payload
 */

class ScriptLoader {
  constructor() {
    this.loadedScripts = new Set()
    this.observers = new Map()
    this.config = {
      // Core scripts needed immediately
      critical: [{ src: "./scripts/core-minimal.js" }],
      // Scripts needed when specific sections are visible
      sections: [
        {
          id: "get-involved",
          scripts: [
            { src: "./scripts/config.js" },
            { src: "./scripts/twitch-client.js", dependsOn: ["./scripts/config.js"] },
          ],
        },
        {
          id: "the-project",
          scripts: [
            { src: "./scripts/lightbox.js" }, // Corrected path to lightbox script
            { src: "./scripts/ui-components.js" },
          ],
        },
      ],
      // Scripts loaded on specific user interactions
      interactions: [
        {
          selector: ".lightbox-trigger",
          event: "click",
          scripts: [
            { src: "./scripts/lightbox.js" }, // Corrected path to lightbox script
            { src: "./scripts/ui-components.js" },
          ],
        },
        {
          selector: '[data-key="hero_read"], [data-key="cta_share"]',
          event: "click",
          scripts: [{ src: "./scripts/ui-components.js" }],
        },
      ],
    }

    this.init()
  }

  init() {
    // Load critical scripts immediately
    this.loadCriticalScripts()

    // Set up section observers after a small delay to prioritize initial render
    setTimeout(() => {
      this.setupSectionObservers()
      this.setupInteractionObservers()
    }, 100)

    // Handle page visibility changes for better performance
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.checkVisibleSections()
      }
    })
  }

  loadCriticalScripts() {
    this.config.critical.forEach((script) => {
      this.loadScript(script.src)
    })
  }

  setupSectionObservers() {
    this.config.sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (!element) {
        console.warn(`Section #${section.id} not found in DOM`)
        return
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log(`Section #${section.id} is visible, loading scripts`)
              this.loadSectionScripts(section)
              observer.disconnect()
              this.observers.delete(section.id)
            }
          })
        },
        { rootMargin: "200px 0px" }, // Load scripts when section is 200px from viewport
      )

      observer.observe(element)
      this.observers.set(section.id, observer)
    })
  }

  setupInteractionObservers() {
    this.config.interactions.forEach((interaction) => {
      const elements = document.querySelectorAll(interaction.selector)
      if (elements.length === 0) {
        console.warn(`No elements found for selector: ${interaction.selector}`)
        return
      }

      const handler = (e) => {
        console.log(`Interaction with ${interaction.selector}, loading scripts`)
        interaction.scripts.forEach((script) => {
          this.loadScript(script.src, script.dependsOn)
        })

        // Remove event listeners after first interaction
        elements.forEach((el) => {
          el.removeEventListener(interaction.event, handler)
        })
      }

      elements.forEach((el) => {
        el.addEventListener(interaction.event, handler)
      })
    })
  }

  loadSectionScripts(section) {
    // Sort scripts by dependencies
    const scripts = [...section.scripts]
    const loadedInThisBatch = new Set()

    // First pass: load scripts with no dependencies
    scripts.forEach((script) => {
      if (!script.dependsOn || script.dependsOn.length === 0) {
        this.loadScript(script.src)
        loadedInThisBatch.add(script.src)
      }
    })

    // Second pass: load scripts with dependencies
    scripts.forEach((script) => {
      if (script.dependsOn && script.dependsOn.length > 0) {
        this.loadScript(script.src, script.dependsOn)
      }
    })
  }

  loadScript(src, dependencies = []) {
    // Skip if already loaded
    if (this.loadedScripts.has(src)) {
      return Promise.resolve()
    }

    // Check dependencies
    const unloadedDependencies = dependencies.filter((dep) => !this.loadedScripts.has(dep))
    if (unloadedDependencies.length > 0) {
      console.log(`Waiting for dependencies before loading ${src}:`, unloadedDependencies)

      // Set a timeout to check again
      setTimeout(() => {
        this.loadScript(src, dependencies)
      }, 100)

      return
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = src
      script.async = true

      script.onload = () => {
        console.log(`✅ Loaded: ${src}`)
        this.loadedScripts.add(src)
        resolve()
      }

      script.onerror = (error) => {
        console.error(`❌ Error loading ${src}:`, error)
        reject(error)
      }

      document.body.appendChild(script)
    })
  }

  checkVisibleSections() {
    this.observers.forEach((observer, sectionId) => {
      const element = document.getElementById(sectionId)
      if (element && this.isElementInViewport(element)) {
        const section = this.config.sections.find((s) => s.id === sectionId)
        if (section) {
          this.loadSectionScripts(section)
          observer.disconnect()
          this.observers.delete(sectionId)
        }
      }
    })
  }

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 200 && rect.bottom >= -200
  }
}

// Initialize the script loader
window.scriptLoader = new ScriptLoader()
