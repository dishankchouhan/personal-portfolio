const canvas = document.getElementById("cursor-canvas");
const ctx = canvas.getContext('2d');

// for intro motion
let mouseMoved = false;

const pointer = {
    x: .5 * window.innerWidth,
    y: .5 * window.innerHeight,
}
const params = {
    pointsNumber: 40,
    widthFactor: .3,
    mouseThreshold: .6,
    spring: .4,
    friction: .5
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    }
}

window.addEventListener("click", e => {
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("mousemove", e => {
    mouseMoved = true;
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("touchmove", e => {
    mouseMoved = true;
    updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});

function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", setupCanvas);
setupCanvas();

function update(t) {
    // for intro motion
    if (!mouseMoved) {
        pointer.x = (.5 + .3 * Math.cos(.002 * t) * (Math.sin(.005 * t))) * window.innerWidth;
        pointer.y = (.5 + .2 * (Math.cos(.005 * t)) + .1 * Math.cos(.01 * t)) * window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? .4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
    });

    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);


     ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--cursor-color').trim() || "black";

    for (let i = 1; i < trail.length - 1; i++) {
        const xc = .5 * (trail[i].x + trail[i + 1].x);
        const yc = .5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.stroke();
    }
    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();

    window.requestAnimationFrame(update);
}
update(0);
// Smooth scroll to portfolio section



document.querySelector('.scroll-down-button').addEventListener('click', function(e) {
  e.preventDefault();
  const portfolioSection = document.querySelector('.portfolio-section');
  if (portfolioSection) {
    portfolioSection.scrollIntoView({ behavior: 'smooth' });
  }
});


 class PortfolioTiltCards {
            constructor() {
                this.cards = document.querySelectorAll('.tilt-card');
                this.tooltip = document.getElementById('tiltTooltip');
                this.rotateAmplitude = 8; // Reduced for subtlety
                this.scaleOnHover = 1.05;
                this.init();
            }

            init() {
                this.cards.forEach(card => {
                    // Initialize card state
                    card.tiltState = {
                        currentRotateX: 0,
                        currentRotateY: 0,
                        currentScale: 1,
                        targetRotateX: 0,
                        targetRotateY: 0,
                        targetScale: 1,
                        isHovered: false
                    };

                    // Add event listeners
                    card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
                    card.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, card));
                    card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
                });

                // Start animation loop
                this.animate();
            }

            handleMouseMove(e, card) {
                if (!card.tiltState.isHovered) return;

                const rect = card.getBoundingClientRect();
                const offsetX = e.clientX - rect.left - rect.width / 2;
                const offsetY = e.clientY - rect.top - rect.height / 2;

                // Calculate rotation values
                const rotateX = (offsetY / (rect.height / 2)) * -this.rotateAmplitude;
                const rotateY = (offsetX / (rect.width / 2)) * this.rotateAmplitude;

                card.tiltState.targetRotateX = rotateX;
                card.tiltState.targetRotateY = rotateY;

                // Update tooltip position and content
                if (window.innerWidth > 768) { // Desktop only
                    const tooltipText = card.getAttribute('data-tooltip');
                    if (tooltipText) {
                        this.tooltip.textContent = tooltipText;
                        this.tooltip.style.left = e.clientX + 15 + 'px';
                        this.tooltip.style.top = e.clientY - 10 + 'px';
                    }
                }
            }

            handleMouseEnter(e, card) {
                card.tiltState.isHovered = true;
                card.tiltState.targetScale = this.scaleOnHover;

                // Show tooltip on desktop
                if (window.innerWidth > 768) {
                    this.tooltip.classList.add('visible');
                }
            }

            handleMouseLeave(e, card) {
                card.tiltState.isHovered = false;
                card.tiltState.targetScale = 1;
                card.tiltState.targetRotateX = 0;
                card.tiltState.targetRotateY = 0;

                // Hide tooltip
                this.tooltip.classList.remove('visible');
            }

            // Smooth animation using requestAnimationFrame
            animate() {
                this.cards.forEach(card => {
                    const state = card.tiltState;
                    
                    // Lerp function for smooth transitions
                    const lerp = (start, end, factor) => start + (end - start) * factor;
                    
                    // Animation speeds
                    const rotationSpeed = 0.18;
                    const scaleSpeed = 0.14;
                    
                    // Animate rotation
                    state.currentRotateX = lerp(state.currentRotateX, state.targetRotateX, rotationSpeed);
                    state.currentRotateY = lerp(state.currentRotateY, state.targetRotateY, rotationSpeed);
                    
                    // Animate scale
                    state.currentScale = lerp(state.currentScale, state.targetScale, scaleSpeed);
                    
                    // Apply transforms
                    card.style.transform = `
                        perspective(1000px)
                        rotateX(${state.currentRotateX}deg) 
                        rotateY(${state.currentRotateY}deg) 
                        scale(${state.currentScale})
                    `;
                });

                // Continue animation loop
                requestAnimationFrame(() => this.animate());
            }
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new PortfolioTiltCards();
        });

        // Add some enhanced interaction feedback
        document.addEventListener('DOMContentLoaded', () => {
            const cards = document.querySelectorAll('.tilt-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                });
            });
        });
