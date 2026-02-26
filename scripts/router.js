(function () {
  var path = window.location.pathname.replace(/\/index\.html$/, '/');

  var page = 'home';
  if (path.startsWith('/get-involved')) page = 'get-involved';
  else if (path.startsWith('/who-we-are')) page = 'who-we-are';
  else if (path.startsWith('/donate')) page = 'donate';

  var links = document.querySelectorAll('[data-nav-page]');
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute('data-nav-page') === page) {
      links[i].classList.add('active');
    }
  }
})();
