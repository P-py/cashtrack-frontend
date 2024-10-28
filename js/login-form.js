const API_URL = 'https://cashtrack-deploy-production.up.railway.app';

document.getElementById('loginSubmit').addEventListener('click', async function(event) {
    event.preventDefault(); // Prevents the default form submission on the browser

    const submitButton = document.querySelector('.submit-btn');
    submitButton.classList.add('loading');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Message modal for error or success messages
    const modal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeModal = modal.querySelector('.close');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(message) {
        submitButton.classList.remove('loading');
        modalMessage.textContent = message;
        modal.style.display = 'block';

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

    if (email.length < 1 || password.length < 1) {
        showError('Preencha todos os campos.');
        return;
    } else if (!emailRegex.test(email)) {
        showError('E-mail inválido.');
        return;
    } else {
        const data = {
            email: email,
            password: password
        };
    
        const minimumLoadingTime = 2000; // Minimum time in milliseconds to show the loading spinner
        const startTime = Date.now();
    
        try {
            const response = await fetch(`${API_URL}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
    
            const elapsedTime = Date.now() - startTime;
            const remainingTime = minimumLoadingTime - elapsedTime;

            const responseBody = await response.json();
    
            setTimeout(() => {
                submitButton.classList.remove('loading');
    
                switch (response.status) {
                    case 200:
                        // Set the access token as a cookie
                        document.cookie = `accessToken=${responseBody.accessToken}; path=/; max-age=3600; Secure; SameSite=None;`;

                        modalMessage.textContent = 'Login realizado com sucesso!';
                        modal.style.display = 'block';
        
                        closeModal.addEventListener('click', () => {
                            modal.style.display = 'none';
                            window.location.href = 'dashboard.html';
                        });
        
                        window.addEventListener('click', (event) => {
                            if (event.target == modal) {
                                modal.style.display = 'none';
                                window.location.href = 'dashboard.html';
                            }
                        });
                        break;
                    case 418:
                        showError('Credenciais inválidas. Tente novamente.');
                        break;
                    default:
                        showError('Erro ao realizar o login. Tente novamente.');
                        break;
                }
            }, remainingTime > 0 ? remainingTime : 0);
        } catch (error) {
            showError('Erro inesperado ao realizar o login. Tente novamente.');
        }
    }
});