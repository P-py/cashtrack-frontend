const API_URL = 'http://localhost:8080';

document.getElementById('registerSubmit').addEventListener('click', async function(event) {
    event.preventDefault(); // Prevents the default form submission on the browser

    const submitButton = document.querySelector('.submit-btn');
    submitButton.classList.add('loading');

    const username = document.getElementById('username').value;
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

    if (username.length < 1 || email.length < 1) {
        showError('Preencha todos os campos.');
        return;
    } else if (username.length < 4) {
        showError('O nome de usuário deve ter pelo menos 4 caracteres.');
        return; 
    } else if (password.length < 8) {
        showError('A senha deve ter pelo menos 8 caracteres.');
        return; 
    } else if (!emailRegex.test(email)) {
        showError('E-mail inválido.');
        return;
    } else {
        const data = {
            username: username,
            email: email,
            password: password
        };
    
        const minimumLoadingTime = 2000; // Minimum time in milliseconds to show the loading spinner
        const startTime = Date.now();
    
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' // CORS policy
                },
                body: JSON.stringify(data)
            });
    
            const elapsedTime = Date.now() - startTime;
            const remainingTime = minimumLoadingTime - elapsedTime;

            const responseBody = await response.json();
    
            setTimeout(() => {
                submitButton.classList.remove('loading');
    
                switch (response.status) {
                    case 201:
                        modalMessage.textContent = 'Cadastro realizado com sucesso!';
                        modal.style.display = 'block';
        
                        closeModal.addEventListener('click', () => {
                            modal.style.display = 'none';
                            window.location.href = 'login.html';
                        });
        
                        window.addEventListener('click', (event) => {
                            if (event.target == modal) {
                                modal.style.display = 'none';
                                window.location.href = 'login.html';
                            }
                        });
                        break;
                    case 400:
                        showError('Este endereço de e-mail já está em uso.');
                        break;
                    default:
                        showError('Erro ao realizar o cadastro. Tente novamente.');
                        break;
                }
            }, remainingTime > 0 ? remainingTime : 0);
        } catch (error) {
            console.error('Erro:', error);
            showError(error);
        }
    }
});