document.addEventListener('DOMContentLoaded', () => {
    const expandableImages = document.querySelectorAll('.expandableImage');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalContent = modal.querySelector('.modal-content');
    const closeModal = modal.querySelector('.close');

    expandableImages.forEach(image => {
        image.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalImg.src = image.src;
            modalImg.alt = image.alt;

            // Verifica se a altura da imagem é maior que a altura da tela

            console.log(image.src)
            if (image.src.includes("data-diagram.png")) {
                modalContent.style.marginTop = '60vh';
            } else {
                modalContent.style.marginTop = '0';
            }
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