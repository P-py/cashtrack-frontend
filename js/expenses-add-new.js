document.addEventListener('DOMContentLoaded', async () => {
    const modal = document.getElementById('addModal');
    const modalTitle = document.getElementById('modalTitle');
    const expenseForm = document.getElementById('addFormExpense');
    const expenseLabel = document.getElementById('expenseLabel');
    const typeExpense = document.getElementById('type-select-expenses');
    const valueExpense = document.getElementById('value-expense')
    // Message modal for error or success messages
    const messageModal = document.getElementById('messageModal');
    const closeModal = modal.querySelector('.close');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const accessToken = getCookie('accessToken');

    //Function to show the add new expense/income modal
    function showModal(title, type) {
        expenseForm.style.display = 'flex';
        modalTitle.textContent = title;
        modal.style.display = 'flex';

        modal.querySelector('.close').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

    function showMessage(message) {
        messageModal.textContent = message;
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

    document.getElementById('add-expense-btn').addEventListener('click', () => {
        showModal('Adicionar Nova Despesa', 'expense');
    });

    document.getElementById('addFormExpense').addEventListener('submit', async (event) => {
        event.preventDefault();

        const data = { 
            expenseLabel: expenseLabel.value,
            value: parseFloat(valueExpense.value),
            type: typeExpense.value
        }

        try {
            const response = await fetch(`${API_URL}/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            if (response.status === 201) {
                window.location.reload();
            } else {
               showMessage('Erro ao adicionar. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao enviar a requisição:', error);
            showMessage('Erro ao adicionar. Tente novamente.');
        }
    });
});