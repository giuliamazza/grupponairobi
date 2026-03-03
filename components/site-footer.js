class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<footer>
  <div class="container footer-container">
    <div class="footer-left">
      <a href="/" class="logo">
        <img src="/images/logo.svg" alt="Gruppo Nairobi Logo" width="60" height="40">
        <div class="logo-text">
          <span>ASSOCIAZIONE</span>
          <span class="brand">GRUPPO NAIROBI</span>
        </div>
      </a>
      <div class="footer-description">
        <div class="organization-info">
          <p class="org-name">GRUPPO NAIROBI</p>
          <p>Associazione Gruppo Nairobi \u2013 Associazione di Promozione Sociale/APS \u2013 Ente del Terzo Settore/ETS</p>
          <p>Iscrizione al RUNTS \u2013 Rep. N\u00b0 147799 \u2013 Associazione con riconoscimento di Personalit\u00e0 Giuridica</p>
          <div class="address-section">
            <p class="address-title">Sede legale:</p>
            <p>Via Angelo Emo 40 - 37138 Verona (VR)</p>
            <p>CF: 92031590232</p>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-right">
      <div class="footer-links">
        <div class="footer-column">
          <h3><a href="/" class="footer-link lang" data-key="nav_home">Home</a></h3>
          <h3><a href="/get-involved" class="footer-link lang" data-key="nav_involved">Get Involved</a></h3>
          <h3><a href="/who-we-are" class="footer-link lang" data-key="nav_who">Who We Are</a></h3>
          <h3><a href="/donate" class="footer-link lang" data-key="nav_donate">Donate</a></h3>
        </div>
        <div class="footer-column">
          <div class="language-switcher">
            <button class="language-toggle" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="language-list-footer" aria-label="Language: English">
              <i class="fas fa-globe" aria-hidden="true"></i>
              <span class="language-current">ENG</span>
            </button>
            <ul class="language-dropdown" id="language-list-footer" role="listbox" aria-label="Select language"></ul>
          </div>
          <div class="social-media">
            <h4 class="social-media-heading lang" data-key="footer_follow_us">Follow Us</h4>
            <a href="https://www.instagram.com/grupponairobi" id="footer-instagram-link" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="Follow us on Instagram">
              <i class="fab fa-instagram" aria-hidden="true"></i> <span>Instagram</span>
            </a>
          </div>
          <div class="direct-donate">
            <a href="/donate" class="footer-donate-link">
              <i class="fas fa-heart"></i> <span class="lang" data-key="nav_donate">Donate</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="copyright">
    \u00a9 COPYRIGHT GRUPPO NAIROBI \u2013 TUTTI I DIRITTI RISERVATI
  </div>
</footer>

<a href="/donate" class="donate-fab" aria-label="Donate">
  <i class="fas fa-heart" aria-hidden="true"></i>
</a>`;
  }
}
customElements.define('site-footer', SiteFooter);
