function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (!themeToggle) return; // Safety check

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        let theme = 'light';
        if (body.classList.contains('dark-theme')) {
            theme = 'dark';
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }
        localStorage.setItem('theme', theme);
    });
}

// --- Scroll-to-Hide Logic ---
let lastScrollY = window.scrollY;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    // If the current scroll is greater than the last, the user is scrolling down
    if (lastScrollY < window.scrollY) {
        nav.classList.add('nav-hidden');
    } else {
        // If the current scroll is less, the user is scrolling up
        nav.classList.remove('nav-hidden');
    }
    
    // Update the last scroll position
    lastScrollY = window.scrollY;
});

// Single function to load all shared components
function loadComponents() {
    // 1. Load Navigation
    fetch('nav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('nav-placeholder').innerHTML = data;
            // IMPORTANT: Initialize theme toggle ONLY after nav is in the DOM
            initThemeToggle();
            initMobileMenu(); // Setup hamburger menu
        })
        .catch(err => console.error("Error loading navigation:", err));

    // 2. Load Footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(err => console.error("Error loading footer:", err));

    // 3. Initialize Scroll Animations
    initScrollAnimations();
    initCounters();
}

// --- Mobile Menu Logic ---
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon between bars and close (X)
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// --- Scroll Animations Logic ---
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.20, // Triggers when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Triggers slightly before the element fully hits the bottom
    });

    fadeElements.forEach(el => observer.observe(el));
}

function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const prefix = counter.getAttribute('data-prefix') || '';
                const suffix = counter.getAttribute('data-suffix') || '';
                
                // Animation settings
                const duration = 1500; // 1.5 seconds total
                const stepTime = 30; // Update every 30ms for 60fps smoothness
                const steps = duration / stepTime;
                const increment = target / steps;
                
                let current = 0;
                
                const updateCounter = setInterval(() => {
                    current += increment;
                    
                    if (current >= target) {
                        current = target;
                        clearInterval(updateCounter);
                    }
                    
                    // Update DOM with prefix, rounded number, and suffix
                    counter.innerText = prefix + Math.ceil(current) + suffix;
                }, stepTime);
                
                // Stop observing once the animation triggers so it doesn't repeat on scrolling up
                obs.unobserve(counter);
            }
        });
    }, { 
        threshold: 0.5 // Wait until the number is 50% visible on screen before starting
    });
    
    counters.forEach(counter => {
        // Set initial state to 0 on page load
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        counter.innerText = prefix + '0' + suffix;
        
        observer.observe(counter);
    });
}

// Use one single onload event to trigger the process
// Initialize everything when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', loadComponents);