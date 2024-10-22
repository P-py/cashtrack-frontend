document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
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

            // Verifies if the image is the diagram image
            // This image has a different height, so we need to adjust the margin-top
            if (window.innerWidth > 768 && image.src.includes("data-diagram.png")) {
                modalContent.style.marginTop = '55vh';
            } else {
                modalContent.style.marginTop = '0';
            }
        });
    });

    // When the burger button is clicked, activates the hidden nav menu
    burger.addEventListener('click', () => {
        console.log("menu clicado caralha")
        navLinks.classList.toggle('nav-active');
    });

    // Close the modal when the user clicks on the close button
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal when the user clicks outside the modal
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Swiper.js instance for the image content
    const swiperImages = new Swiper('.what-we-do-images', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        lazyPreloadPrevNext: 0, // Does not render the next and previous slides for data saving
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            // Responsive breakpoints
            768: {
                slidesPerView: 1,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });

    // Swiper.js instance for the contact section
    const swiperContact = new Swiper('.who-we-are-container-mobile', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        lazyPreloadPrevNext: 0, // Does not render the next and previous slides for data saving
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            // Responsive breakpoints
            768: {
                slidesPerView: 1,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });
});