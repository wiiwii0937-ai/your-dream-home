/**
 * Light Steel Theme - Main JavaScript
 *
 * @package Light_Steel
 */

(function() {
    'use strict';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        initSmoothScroll();
        initHeaderScroll();
        initScrollAnimations();
        initContactForm();
        initThemeToggle();
    });

    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navigation = document.querySelector('.main-navigation');

        if (!menuToggle || !navigation) return;

        menuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            navigation.classList.toggle('is-active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navigation.contains(e.target) && !menuToggle.contains(e.target)) {
                navigation.classList.remove('is-active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navigation.classList.contains('is-active')) {
                navigation.classList.remove('is-active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        });
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;

                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navigation = document.querySelector('.main-navigation');
                    const menuToggle = document.querySelector('.menu-toggle');
                    
                    if (navigation?.classList.contains('is-active')) {
                        navigation.classList.remove('is-active');
                        menuToggle?.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });
    }

    /**
     * Header Background on Scroll
     */
    function initHeaderScroll() {
        const header = document.querySelector('.site-header');
        
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }

            // Hide/show on scroll direction (optional)
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.classList.add('is-hidden');
            } else {
                header.classList.remove('is-hidden');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * Scroll Animations with Intersection Observer
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-fade-in-up, .service-card, .advantage-card');

        if (!animatedElements.length) return;

        // Set initial state
        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
        });

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    /**
     * Contact Form AJAX Submission
     */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const responseContainer = document.getElementById('form-response');

        if (!form || !responseContainer) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            // Disable button and show loading
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Collect form data
            const formData = new FormData(form);
            formData.append('action', 'light_steel_contact');
            formData.append('nonce', lightSteelAjax.nonce);

            // Send AJAX request
            fetch(lightSteelAjax.ajaxUrl, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                responseContainer.style.display = 'block';
                
                if (data.success) {
                    responseContainer.className = 'form-response success';
                    responseContainer.textContent = data.data.message;
                    form.reset();
                } else {
                    responseContainer.className = 'form-response error';
                    responseContainer.textContent = data.data.message;
                }
            })
            .catch(function(error) {
                responseContainer.style.display = 'block';
                responseContainer.className = 'form-response error';
                responseContainer.textContent = 'An error occurred. Please try again later.';
                console.error('Form submission error:', error);
            })
            .finally(function() {
                submitButton.disabled = false;
                submitButton.textContent = originalText;

                // Auto-hide response after 5 seconds
                setTimeout(function() {
                    responseContainer.style.display = 'none';
                }, 5000);
            });
        });
    }
    /**
     * Dark/Light Mode Toggle
     */
    function initThemeToggle() {
        var toggle = document.getElementById('theme-toggle');
        if (!toggle) return;

        // Restore saved preference
        var saved = localStorage.getItem('light-steel-theme');
        if (saved === 'light') {
            document.body.classList.add('light-mode');
        }

        toggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            var isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('light-steel-theme', isLight ? 'light' : 'dark');
        });
    }

})();
