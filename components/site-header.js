class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<header>
  <div class="container">
    <a href="/" class="logo">
      <img src="/images/logo.webp" alt="Gruppo Nairobi Logo" width="46" height="46">
      <div class="logo-text">
        <span>ASSOCIAZIONE</span>
        <span class="brand">GRUPPO NAIROBI</span>
      </div>
    </a>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/" class="lang" data-key="nav_home" data-nav-page="home">Home</a></li>
        <li><a href="/get-involved" class="lang" data-key="nav_involved" data-nav-page="get-involved">Get Involved</a></li>
        <li><a href="/who-we-are" class="lang" data-key="nav_who" data-nav-page="who-we-are">Who We Are</a></li>
        <li>
          <div class="language-switcher">
            <button class="language-toggle" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="language-list-header" aria-label="Language: English">
              <i class="fas fa-globe" aria-hidden="true"></i>
              <span class="language-current">ENG</span>
            </button>
            <ul class="language-dropdown" id="language-list-header" role="listbox" aria-label="Select language"></ul>
          </div>
        </li>
        <li class="nav-donate-item">
          <a href="/donate" class="btn-donate lang" data-key="nav_donate" data-nav-page="donate">Donate</a>
        </li>
      </ul>
    </nav>
    <button class="mobile-menu-btn" aria-label="Toggle menu" aria-expanded="false">
      <i class="fas fa-bars" aria-hidden="true"></i>
    </button>
  </div>
</header>`;
  }
}
customElements.define('site-header', SiteHeader);
