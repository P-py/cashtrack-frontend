document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const submitButtons = document.querySelectorAll('.submit-btn');
    const modal = document.getElementById('confirmationModal');
    const closeModal = document.querySelector('.close');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });

    submitButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            button.classList.add('loading');

            // Simula um tempo de carregamento
            setTimeout(() => {
                button.classList.remove('loading');
                modal.style.display = 'block';
            }, 2000);
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});