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
