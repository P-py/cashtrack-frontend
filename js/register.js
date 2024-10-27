document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    // When the burger button is clicked, activates the hidden nav menu
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });
});