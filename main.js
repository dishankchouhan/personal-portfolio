document.querySelector('.scroll-down-button').addEventListener('click', function(e) {
  e.preventDefault();
  const portfolioSection = document.querySelector('.portfolio-section');
  if (portfolioSection) {
    portfolioSection.scrollIntoView({ behavior: 'smooth' });
  }
});