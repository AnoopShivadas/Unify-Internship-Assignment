/* ===========================
   PARTICLE ANIMATION SYSTEM
   =========================== */

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 35;

        this.init();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.handleResize());
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    drawParticle(particle) {
        this.ctx.save();

        const pulseFactor = Math.sin(Date.now() * particle.pulseSpeed + particle.pulsePhase);
        const currentOpacity = particle.opacity + pulseFactor * 0.2;
        const currentSize = particle.size + pulseFactor * 0.5;

        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, currentSize * 3
        );

        gradient.addColorStop(0, `rgba(0, 255, 255, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(56, 189, 248, ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, currentSize * 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.8})`;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    updateParticle(particle) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > this.canvas.width) {
            particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > this.canvas.height) {
            particle.speedY *= -1;
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

/* ===========================
   TYPEWRITER EFFECT
   =========================== */

class Typewriter {
    constructor(element, text, options = {}) {
        this.element = element;
        this.text = text;
        this.charIndex = 0;
        this.typeSpeed = options.typeSpeed || 80;
        this.pauseDuration = options.pauseDuration || 500;
        this.restartDelay = options.restartDelay || 3000;
        this.hasTypedOnce = false;

        this.startTyping();
    }

    async startTyping() {
        this.element.textContent = '';
        this.charIndex = 0;

        for (let i = 0; i < this.text.length; i++) {
            this.element.textContent += this.text[i];
            this.charIndex++;

            const char = this.text[i];
            let delay = this.typeSpeed;

            if (char === '.' || char === '!' || char === '?') {
                delay = this.pauseDuration;
            } else if (char === ',') {
                delay = this.pauseDuration / 2;
            }

            await this.sleep(delay);
        }

        if (!this.hasTypedOnce) {
            this.hasTypedOnce = true;
            await this.sleep(this.restartDelay);
            this.startTyping();
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/* ===========================
   MODAL FUNCTIONALITY
   =========================== */

class Modal {
    constructor() {
        this.modalOverlay = document.getElementById('modalOverlay');
        this.notifyBtn = document.getElementById('notifyBtn');
        this.modalClose = document.getElementById('modalClose');
        this.form = document.getElementById('notifyForm');
        this.emailInput = document.getElementById('emailInput');

        this.bindEvents();
    }

    bindEvents() {
        this.notifyBtn.addEventListener('click', () => this.open());

        this.modalClose.addEventListener('click', () => this.close());

        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay.classList.contains('active')) {
                this.close();
            }
        });

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    open() {
        this.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            this.emailInput.focus();
        }, 300);
    }

    close() {
        this.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleSubmit(e) {
        e.preventDefault();
        const email = this.emailInput.value;

        console.log('Email submitted:', email);

        this.emailInput.value = '';
        this.close();

        this.showSuccessMessage();
    }

    showSuccessMessage() {
        const originalText = this.notifyBtn.querySelector('span').textContent;
        this.notifyBtn.querySelector('span').textContent = 'You\'re on the list!';
        this.notifyBtn.style.borderColor = '#10b981';
        this.notifyBtn.style.color = '#10b981';

        setTimeout(() => {
            this.notifyBtn.querySelector('span').textContent = originalText;
            this.notifyBtn.style.borderColor = '';
            this.notifyBtn.style.color = '';
        }, 3000);
    }
}

/* ===========================
   GALLERY ENHANCEMENTS
   =========================== */

class Gallery {
    constructor() {
        this.cards = document.querySelectorAll('.gallery-card');
        this.init();
    }

    init() {
        this.cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;

            card.addEventListener('mouseenter', () => {
                card.style.zIndex = 100;
            });

            card.addEventListener('mouseleave', () => {
                card.style.zIndex = 1;
            });
        });
    }
}

/* ===========================
   INITIALIZATION
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem();

    const typewriterElement = document.getElementById('typewriterContent');
    const typewriterText = "We're building something worth the wait.";
    const typewriter = new Typewriter(typewriterElement, typewriterText, {
        typeSpeed: 80,
        pauseDuration: 500,
        restartDelay: 3000
    });

    const modal = new Modal();

    const gallery = new Gallery();

    const cursorBlink = document.getElementById('cursor');
    setInterval(() => {
        cursorBlink.style.opacity = cursorBlink.style.opacity === '0' ? '1' : '0';
    }, 500);
});
