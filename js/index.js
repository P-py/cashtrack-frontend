document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const submitButtons = document.querySelectorAll('.submit-btn');
    const modal = document.getElementById('confirmationModal');
    const closeModal = document.querySelector('.close');
    const loginBtn = document.getElementById('login-btn');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const accessToken = getCookie('accessToken');
    if(accessToken) {
        loginBtn.textContent = 'Seu Dashboard';
    }

    // When the burger button is clicked, activates the hidden nav menu
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });

    // Goes through all submit buttons and adds a loading class to them if clicked
    submitButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            button.classList.add('loading');
            
            setTimeout(() => {
                button.classList.remove('loading');
                modal.style.display = 'block';
                const form = button.closest('form');
                if (form) {
                    console.log("teste");
                    const inputs = form.querySelectorAll('input');
                    const textAreas = form.querySelectorAll('textarea');
                    inputs.forEach(input => {
                        input.value = '';
                    });
                    textAreas.forEach(textArea => {
                        textArea.value = '';
                    });
                }
            }, 2000);
        });
    });

    // When the close button is clicked, closes the modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // When the user clicks outside the modal, closes it
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Swiper slider initizalization
    const swiper = new Swiper('.swiper-container', {
        //autoplay: {
        //    delay: 5000, // Interval of the automatic slide change
        //},
        lazyPreloadPrevNext: 0, // Does not render the next and previous slides for data saving
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
            // Responsive breakpoints
            768: {
                slidesPerView: 1,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });

    // Swiper slider initizalization
    const swiper_auto = new Swiper('.swiper-container-auto', {
        autoplay: {
            delay: 5000, // Interval of the automatic slide change
        },
        lazyPreloadPrevNext: 0, // Does not render the next and previous slides for data saving
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