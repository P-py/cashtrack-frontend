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
            event.preventDefault(); // Previne o comportamento padrão do formulário
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

    // Inicializa o Swiper.js
    const swiper = new Swiper('.swiper-container', {
        //autoplay: {
        //    delay: 5000,
        //},
        lazyPreloadPrevNext: 0,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 1,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });
});