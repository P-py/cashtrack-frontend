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

            // Verifica se o src da imagem contém "data-diagram.png"
            if (image.src.includes("data-diagram.png")) {
                modalContent.style.marginTop = '55vh';
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

    // Inicializa o Swiper.js para as imagens
    const swiperImages = new Swiper('.image-content-mobile', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        slidesPerView: 1,
        spaceBetween: 10,
    });

    // Inicializa o Swiper.js para a seção de contato
    const swiperContact = new Swiper('.contact-container-mobile', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        slidesPerView: 1,
        spaceBetween: 10,
    });
});