/**
 * Secure Twitch Client - Hybrid Deployment Version
 * This client communicates with a Vercel API to fetch streamer data
 * while the main site is hosted on GitHub Pages.
 */

class TwitchClient {
  constructor() {
    this.waitForConfig().then(() => {
      this.config = this.getConfig()

      // 🔥 UPDATE THIS with your actual Vercel API URL
      this.apiUrl = "https://gruppo-nairobi-api.vercel.app/api/twitch-streamers"

      this.checkInterval = Math.max(60, this.config.twitch?.display?.refreshInterval || 300) * 1000
      this.streamers = []
      this.isInitialized = false
      this.retryCount = 0
      this.maxRetries = 3
      this.abortController = null

      this.init()
    })
  }

  async waitForConfig() {
    let attempts = 0
    while (!window.SITE_CONFIG && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      attempts++
    }

  }

  getConfig() {
    const defaultConfig = {
      twitch: {
        display: {
          maxStreamers: 6,
          refreshInterval: 300,
          showOffline: true,
          prioritizeLive: true,
        },
        ui: {
          liveLabel: "LIVE",
          liveColor: "#ef4444",
        },
        streamerDescriptions: {},
      },
    }

    if (window.SITE_CONFIG?.twitch) {
      return {
        twitch: {
          ...defaultConfig.twitch,
          ...window.SITE_CONFIG.twitch,
          display: {
            ...defaultConfig.twitch.display,
            ...(window.SITE_CONFIG.twitch.display || {}),
          },
          ui: {
            ...defaultConfig.twitch.ui,
            ...(window.SITE_CONFIG.twitch.ui || {}),
          },
        },
      }
    }

    return defaultConfig
  }

  async init() {
    try {

      const container = document.querySelector("#streamers-container")
      if (!container) {
        console.error("❌ Streamers container not found in DOM")
        return
      }

      if (!this.validateEnvironment()) {
        console.error("❌ Environment validation failed")
        this.renderErrorState("Environment validation failed")
        return
      }

      await this.fetchStreamers()

      if (this.streamers.length > 0) {
        this.renderStreamers()
        this.startPeriodicCheck()
        this.isInitialized = true
      } else {
        console.warn("⚠️ No streamers returned from API")
        this.renderEmptyState(container)
      }
    } catch (error) {
      console.error("❌ Initialization error:", error)
      this.handleError(error)
    }
  }

  validateEnvironment() {
    if (!window.fetch) {
      console.error("Fetch API not supported")
      return false
    }
    return true
  }

  async fetchStreamers() {
    if (this.abortController) {
      try {
        this.abortController.abort()
      } catch (e) {
        // Ignore abort errors
      }
    }

    this.abortController = window.AbortController ? new AbortController() : null
    const timeoutId = setTimeout(() => {
      if (this.abortController) this.abortController.abort()
    }, 15000) // Longer timeout for external API

    try {

      const fetchOptions = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      }

      if (this.abortController) {
        fetchOptions.signal = this.abortController.signal
      }

      const response = await fetch(this.apiUrl, fetchOptions)
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response content type")
      }

      const data = await response.json()

      if (!this.validateApiResponse(data)) {
        throw new Error("Invalid API response structure")
      }

      if (data.success && Array.isArray(data.data)) {
        this.streamers = this.sanitizeStreamersData(data.data)
        this.retryCount = 0
      } else {
        throw new Error(data.error || "API returned error")
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error.name === "AbortError") {
        console.log("🔄 Request aborted")
        return
      }

      console.error("❌ Error fetching streamers:", error)
      throw error
    }
  }

  validateApiResponse(data) {
    if (!data || typeof data !== "object") return false
    if (typeof data.success !== "boolean") return false
    if (!Array.isArray(data.data)) return false
    return true
  }

  sanitizeStreamersData(streamers) {
    return streamers.map((streamer) => {
      if (this.config.twitch.streamerDescriptions[streamer.login]) {
        streamer.description = this.config.twitch.streamerDescriptions[streamer.login]
      }
      return streamer
    })
  }

  renderStreamers() {
    const container = document.querySelector("#streamers-container")
    if (!container) {
      console.warn("⚠️ Streamers container not found")
      return
    }

    // Remove skeleton screens first
    const skeletons = container.querySelector(".streamer-skeleton")
    if (skeletons) {
      skeletons.remove()
    }

    container.textContent = ""

    if (this.streamers.length === 0) {
      this.renderEmptyState(container)
      return
    }

    let displayStreamers = [...this.streamers]

    if (this.config.twitch.display.prioritizeLive) {
      displayStreamers.sort((a, b) => {
        if (a.is_live && !b.is_live) return -1
        if (!a.is_live && b.is_live) return 1
        return 0
      })
    }

    const maxStreamers = this.config.twitch.display.maxStreamers || 6
    displayStreamers = displayStreamers.slice(0, maxStreamers)

    displayStreamers.forEach((streamer, index) => {
      try {
        const card = this.createStreamerCard(streamer, index)
        container.appendChild(card)
      } catch (error) {
        console.error(`Error rendering streamer ${streamer.login}:`, error)
      }
    })

  }

  createStreamerCard(streamer, index) {
    const card = document.createElement("div")
    card.className = "streamer-card"
    card.setAttribute("data-streamer-id", streamer.id)
    card.setAttribute("data-index", index)

    const followerCount = this.formatNumber(streamer.follower_count || streamer.view_count || 0)
    const description = streamer.description
      ? streamer.description.substring(0, 150)
      : `${streamer.display_name} streams on Twitch`

    // Create avatar
    const avatar = document.createElement("div")
    avatar.className = "streamer-avatar"

    const img = document.createElement("img")
    img.loading = "lazy"
    img.alt = `${streamer.display_name} avatar`
    img.className = "loading"

    img.onload = () => {
      img.classList.remove("loading")
      img.style.opacity = "1"
    }

    img.onerror = () => {
      console.warn(`❌ Image failed to load for ${streamer.display_name}`)
      img.style.display = "none"
      const placeholder = document.createElement("div")
      placeholder.className = "avatar-placeholder"

      const initials = streamer.display_name
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("")

      placeholder.textContent = initials || streamer.display_name.charAt(0).toUpperCase()
      avatar.appendChild(placeholder)
    }

    // Set image source
    if (streamer.profile_image_url && typeof streamer.profile_image_url === "string") {
      if (streamer.profile_image_url.startsWith("https://")) {
        img.src = streamer.profile_image_url
      } else {
        img.onerror()
      }
    } else {
      img.onerror()
    }

    avatar.appendChild(img)

    // Add live indicator if streaming
    if (streamer.is_live && streamer.live_data) {
      const liveIndicator = document.createElement("div")
      liveIndicator.className = "live-indicator"
      liveIndicator.setAttribute("aria-label", "Currently live")

      const dot = document.createElement("span")
      dot.className = "live-dot"
      dot.setAttribute("aria-hidden", "true")

      const text = document.createElement("span")
      text.textContent = this.config.twitch.ui.liveLabel || "LIVE"

      liveIndicator.appendChild(dot)
      liveIndicator.appendChild(text)
      avatar.appendChild(liveIndicator)
    }

    // Create info section
    const info = document.createElement("div")
    info.className = "streamer-info"

    const name = document.createElement("h3")
    name.className = "streamer-name"
    name.textContent = streamer.display_name

    const followers = document.createElement("p")
    followers.className = "streamer-followers"

    const twitchIcon = document.createElement("i")
    twitchIcon.className = "fab fa-twitch"
    twitchIcon.setAttribute("aria-hidden", "true")

    const followerText = document.createElement("span")
    followerText.textContent = `${followerCount} followers`

    followers.appendChild(twitchIcon)
    followers.appendChild(followerText)

    const desc = document.createElement("p")
    desc.className = "streamer-description"

    if (streamer.is_live && streamer.live_data) {
      const liveInfo = document.createElement("div")
      liveInfo.className = "live-info"

      const liveStatus = document.createElement("div")
      liveStatus.className = "live-status"

      const statusText = document.createElement("strong")
      statusText.textContent = "LIVE: "

      const gameSpan = document.createElement("span")
      gameSpan.textContent = streamer.live_data.game_name || "Unknown Game"

      liveStatus.appendChild(statusText)
      liveStatus.appendChild(gameSpan)

      const viewerInfo = document.createElement("div")
      const viewerText = document.createElement("strong")
      viewerText.textContent = "Viewers: "

      const viewerSpan = document.createElement("span")
      viewerSpan.textContent = this.formatNumber(streamer.live_data.viewer_count || 0)

      viewerInfo.appendChild(viewerText)
      viewerInfo.appendChild(viewerSpan)

      liveInfo.appendChild(liveStatus)
      liveInfo.appendChild(viewerInfo)
      desc.appendChild(liveInfo)
    } else {
      desc.textContent = description
    }

    info.appendChild(name)
    info.appendChild(followers)
    info.appendChild(desc)

    // Create actions
    const actions = document.createElement("div")
    actions.className = "streamer-actions"

    const link = document.createElement("a")
    link.className = "btn-twitch"
    link.href = `https://twitch.tv/${encodeURIComponent(streamer.login)}`
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    link.setAttribute("aria-label", `Watch ${streamer.display_name} on Twitch`)

    const linkIcon = document.createElement("i")
    linkIcon.className = "fab fa-twitch"
    linkIcon.setAttribute("aria-hidden", "true")

    const linkText = document.createElement("span")
    linkText.textContent = "Watch Stream"

    link.appendChild(linkIcon)
    link.appendChild(linkText)
    actions.appendChild(link)

    // Assemble card
    card.appendChild(avatar)
    card.appendChild(info)
    card.appendChild(actions)

    return card
  }

  formatNumber(num) {
    const number = Number(num)
    if (!Number.isFinite(number)) return "0"

    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M"
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K"
    }
    return number.toString()
  }

  renderEmptyState(container) {
    const emptyState = document.createElement("div")
    emptyState.className = "error-state"
    emptyState.innerHTML = `
    <div class="error-icon">
      <i class="fas fa-exclamation-triangle"></i>
    </div>
    <p style="margin-bottom: 1rem;">No streamers available at the moment.</p>
    <p style="font-size: 0.9rem; margin-bottom: 1.5rem;">This could be due to API configuration issues.</p>
    <button class="btn btn-secondary retry-btn" onclick="window.location.reload()">
      <i class="fas fa-refresh"></i> Reload Page
    </button>
  `
    container.appendChild(emptyState)
  }

  renderErrorState(message) {
    const container = document.querySelector("#streamers-container")
    if (!container) return

    container.textContent = ""

    const errorState = document.createElement("div")
    errorState.className = "error-state"
    errorState.innerHTML = `
    <div class="error-icon">
      <i class="fas fa-exclamation-triangle"></i>
    </div>
    <p style="margin-bottom: 1rem;">Unable to load streamers</p>
    <p style="font-size: 0.9rem; margin-bottom: 1.5rem;">${message}</p>
    <button class="btn btn-secondary retry-btn" onclick="window.twitchClient?.forceRefresh()">
      <i class="fas fa-refresh"></i> Try Again
    </button>
  `
    container.appendChild(errorState)
  }

  handleError(error) {
    this.retryCount++

    if (this.retryCount <= this.maxRetries) {
      setTimeout(() => this.fetchStreamers().catch(() => {}), 5000 * this.retryCount)
    } else {
      console.error("❌ Max retries reached")
      this.renderErrorState("Failed to load streamers after multiple attempts")
    }
  }

  startPeriodicCheck() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }

    this.intervalId = setInterval(() => {
      this.fetchStreamers()
        .then(() => this.renderStreamers())
        .catch((error) => console.error("Periodic check failed:", error))
    }, this.checkInterval)

  }

  async forceRefresh() {
    console.log("🔄 Force refreshing streamers...")
    this.retryCount = 0

    try {
      await this.fetchStreamers()
      if (this.streamers.length > 0) {
        this.renderStreamers()
        this.startPeriodicCheck()
      } else {
        console.warn("⚠️ No data available")
        this.renderEmptyState(document.querySelector("#streamers-container"))
      }
    } catch (error) {
      console.error("❌ Force refresh failed:", error)
      this.renderErrorState("Failed to refresh data")
    }
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      streamersLoaded: this.streamers.length,
      retryCount: this.retryCount,
      lastUpdate: new Date().toISOString(),
      config: this.config,
      apiUrl: this.apiUrl,
    }
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    if (this.abortController) {
      try {
        this.abortController.abort()
      } catch (e) {
        // Ignore abort errors
      }
    }
  }
}

// Initialize
let twitchClient = null

try {
  twitchClient = new TwitchClient()

  // Global debug functions (only in development)
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    window.twitchClient = twitchClient
    window.twitchDebug = {
      refresh: () => twitchClient?.forceRefresh(),
      status: () => twitchClient?.getStatus(),
      destroy: () => twitchClient?.destroy(),
    }
  }
} catch (error) {
  console.error("❌ Failed to initialize Twitch client:", error)
}

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (twitchClient) {
    twitchClient.destroy()
  }
})
