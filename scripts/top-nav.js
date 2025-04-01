document.addEventListener('DOMContentLoaded', function() {
    const currentLanguage = document.getElementById('current-language');
    if (window.location.pathname.includes('it.html')) {
        currentLanguage.textContent = 'ITA';
    } else {
        currentLanguage.textContent = 'ENG';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', function() {
        const topNav = document.querySelector('.top-nav');
        const landingSection = document.querySelector('#landing');
        const landingSectionHeight = landingSection.offsetHeight;

        if (window.scrollY > landingSectionHeight - 60) {
            topNav.classList.add('scrolled');
        } else {
            topNav.classList.remove('scrolled');
        }
    });
});