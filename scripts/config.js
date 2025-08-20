// Site Configuration
window.SITE_CONFIG = {
  // Site Information
  site: {
    name: "Gruppo Nairobi",
    description: "Supporting education and community development in Kenya",
    url: "https://grupponairobi.org",
  },

  // Contact Information
  contact: {
    email: "info@grupponairobi.org",
  },

  // Twitch Configuration
  twitch: {
    // Streamers list - easily editable by team members
    // streamers: ["studytme", "forsen", "loltyler1"],
    streamers: ["studytme"],

    display: {
      maxStreamers: 9,
      refreshInterval: 300, // seconds
      showOffline: true,
      prioritizeLive: true,
    },

    ui: {
      liveLabel: "LIVE",
      liveColor: "#ef4444",
    },

    // Custom descriptions for streamers (optional)
    streamerDescriptions: {
      //studytme: "Educational content and study sessions",
      //forsen: "Variety gaming and entertainment",
      //loltyler1: "League of Legends and variety games",
    },
  },

  // Performance Settings
  performance: {
    lazyLoadImages: true,
    enableAnimations: true,
    cacheTimeout: 300000, // 5 minutes
  },

  // Feature Flags
  features: {
    twitchIntegration: true,
    donationTracking: false,
    newsletter: true,
    darkMode: false,
  },
}
