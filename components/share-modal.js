class ShareModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div id="share-modal" class="share-modal" aria-hidden="true" role="dialog" aria-labelledby="share-title">
  <div class="share-modal-content">
    <button class="share-close" aria-label="Close modal" type="button">&times;</button>
    <h3 id="share-title">Share this project</h3>
    <div class="share-buttons">
      <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgrupponairobi.org%2F" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
        <i class="fab fa-facebook-f"></i> Share on Facebook
      </a>
      <a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fgrupponairobi.org%2F&text=Every%20child%20deserves%20a%20future.%20Help%20us%20build%20a%20school%20in%20Kenya%20with%20Gruppo%20Nairobi.%20%F0%9F%8F%AB%E2%9C%A8" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
        <i class="fab fa-twitter"></i> Share on Twitter
      </a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgrupponairobi.org%2F" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
        <i class="fab fa-linkedin-in"></i> Share on LinkedIn
      </a>
      <a href="https://wa.me/?text=Every%20child%20deserves%20a%20future.%20Help%20us%20build%20a%20school%20in%20Kenya%20with%20Gruppo%20Nairobi:%20https%3A%2F%2Fgrupponairobi.org%2F" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
        <i class="fab fa-whatsapp"></i> Share on WhatsApp
      </a>
      <button class="btn btn-secondary" id="copy-link">
        <i class="fas fa-link"></i> Copy Link
      </button>
    </div>
  </div>
</div>`;
  }
}
customElements.define('share-modal', ShareModal);
