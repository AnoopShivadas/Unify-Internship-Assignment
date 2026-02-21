// ===================================
// COSMIC GLASS PORTFOLIO - JavaScript
// Interactive Elements & Animations
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navToggle.classList.toggle('active');
        });
    }

    // Smooth Scroll for Navigation Links
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // Scroll Animation for Elements
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe skill cards, project cards
    const animatedElements = document.querySelectorAll('.skill-card, .project-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Form Submission Handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Show success animation (ripple effect is CSS-only)
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00f5ff)';
            
            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = '<span>Send Message</span><div class="ripple"></div>';
                submitBtn.style.background = 'linear-gradient(135deg, var(--electric-blue), var(--neon-purple))';
            }, 3000);
            
            // Log form data (in production, send to backend)
            console.log('Form submitted:', formData);
        });
    }

    // Button Click Effects
    const buttons = document.querySelectorAll('.neon-button, .view-project-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('click-ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Parallax Effect for Hero Section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });

    // Mouse Glow Effect
    const body = document.body;
    let mouseGlow = document.createElement('div');
    mouseGlow.classList.add('mouse-glow');
    mouseGlow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 245, 255, 0.15), transparent);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        display: none;
    `;
    body.appendChild(mouseGlow);

    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            mouseGlow.style.display = 'block';
            mouseGlow.style.left = (e.clientX - 150) + 'px';
            mouseGlow.style.top = (e.clientY - 150) + 'px';
        }
    });

    document.addEventListener('mouseleave', () => {
        mouseGlow.style.display = 'none';
    });

    // Add click ripple styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .click-ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @media (max-width: 768px) {
            .nav-links {
                position: fixed;
                top: 80px;
                left: 0;
                right: 0;
                background: var(--glass-white);
                backdrop-filter: blur(20px);
                flex-direction: column;
                padding: 2rem;
                border-bottom: 1px solid var(--glass-border);
                gap: 1.5rem;
            }
            
            .nav-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .nav-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .nav-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
    `;
    document.head.appendChild(style);

    // Navbar hide/show on scroll
    let lastScroll = 0;
    const navbar = document.querySelector('.glass-nav');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.transform = 'translateY(0)';
        } else if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    console.log('🌌 Cosmic Glass Portfolio loaded successfully!');
});