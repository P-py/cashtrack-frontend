document.addEventListener('DOMContentLoaded', () => {
    const submitButtons = document.querySelectorAll('.submit-btn');

    // Goes through all submit buttons and adds a loading class to them if clicked
    submitButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            button.classList.add('loading');

            setTimeout(() => {
                button.classList.remove('loading');
                modal.style.display = 'block';
            }, 2000);
        });
    });
});