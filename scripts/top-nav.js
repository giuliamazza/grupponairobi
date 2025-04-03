function getCurrentLanguage() {
    const path = window.location.pathname;
    if (path.includes('/it/')) {
        return 'ITA';
    } else {
        return 'ENG';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const currentLangElement = document.getElementById('current-language');
    if (currentLangElement) {
        currentLangElement.textContent = getCurrentLanguage();
    }

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

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navCenter = document.querySelector('.nav-center');

    hamburger.addEventListener('click', function() {
        navCenter.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when a nav link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navCenter.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
});
