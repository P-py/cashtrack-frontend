const API_URL = 'https://cashtrack-deploy-production.up.railway.app';

document.addEventListener('DOMContentLoaded', async () => {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
        deleteCookie('accessToken');
        window.location.href = 'index.html';
    });

    const accessToken = getCookie('accessToken');
    if (!accessToken) {
        window.location.href = 'index.html';
        return;
    }

    const typeTagMapping = {
        'SALARY': 'Salário',
        'EXTRA': 'Extras',
        'GIFT': 'Presente',
        'MONTHLY_ESSENTIAL': 'Essencial',
        'ENTERTAINMENT': 'Lazer',
        'INVESTMENTS': 'Investimento',
        'LONGTIME_PURCHASE': 'Parcelamento'
    }

    try {
        const transactionsResponse = await fetch(`${API_URL}/users/balance`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (transactionsResponse.ok) {
            const transactionsData = await transactionsResponse.json();
            const expenseElement = document.getElementById('total-expenses');
            if (expenseElement) {
                expenseElement.textContent = `R$ ${transactionsData.totalExpenses.toFixed(2)}`;
            }
        } else {
            console.error('Erro ao obter as transações do usuário');
        }
    } catch (error) {
        console.error('Erro ao enviar a requisição');
    }

    // GET request for the user's expense list
    try {
        const expensesResponse = await fetch(`${API_URL}/expenses`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (expensesResponse.ok) {
            const expensesData = await expensesResponse.json();
            const lastExpensesElement = document.getElementById('expenses-list');
            if (lastExpensesElement) {
                const sortedExpenses = expensesData.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
                if (sortedExpenses.length === 0) {
                    lastExpensesElement.innerHTML = `<li style="border: 0px;"><p>Não há despesas registradas</p></li>`
                } else {
                    lastExpensesElement.innerHTML = sortedExpenses.map(expense => `
                        <hr>
                        <li>
                            <h4>${expense.expenseLabel}</h4>
                            <span style="display:none;">${expense.id}</span>
                            <div>
                                <p><span class="value">R$ ${expense.value.toFixed(2)}</span></p>
                                <p><span class="type-tag">${typeTagMapping[expense.type] || expense.type}</span></p>
                                <p>${new Date(expense.dateCreated).toLocaleDateString()}</p>
                                <button class="delete-btn-desktop" id="delete-btn" data-id="expense-${expense.id}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button class="edit-btn-desktop" id="edit-btn" data-id="expense-${expense.id}">
                                    <i class="fas fa-pencil-alt"></i>
                                </button>
                            </div>
                            <button class="delete-btn" id="delete-btn" data-id="expense-${expense.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                            <button class="edit-btn" id="edit-btn" data-id="expense-${expense.id}">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                        </li>
                    `).join('');
                }
            }

            const expensesByDate = expensesData.reduce((acc, expense) => {
                const date = new Date(expense.dateCreated).toLocaleDateString();
                if (!acc[date]) {
                    acc[date] = 0;
                }
                acc[date] += expense.value;
                return acc;
            }, {});

            const labels = Object.keys(expensesByDate).reverse();
            const data = Object.values(expensesByDate).reverse();
            const ctx = document.getElementById('expensesChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [{
                    label: 'Despesas',
                    data: data,
                    borderColor: 'rgba(244, 67, 54, 0.3)',
                    backgroundColor: 'rgba(244, 67, 54, 0.8)',
                  }]
                },
                options: {
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }
              });
        } else {
            console.error('Erro ao obter as transações do usuário');
        }
    } catch (error) {
        console.error('Erro ao enviar a requisição');
    }

    // When the burger button is clicked, activates the hidden nav menu
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            console.log('aqui');
            const id = event.target.getAttribute('data-id').split('-')[1];
            const endpoint = event.target.getAttribute('data-id').split('-')[0];
            try {
                const response = await fetch(`${API_URL}/${endpoint}s/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                });

                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error('Erro ao excluir o item');
                }
            } catch (error) {
                console.error('Erro ao enviar a requisição de exclusão');
            }
        });
    });

    document.querySelectorAll('.delete-btn-desktop').forEach(button => {
        button.addEventListener('click', async (event) => {
            console.log('aqui');
            const id = event.target.getAttribute('data-id').split('-')[1];
            const endpoint = event.target.getAttribute('data-id').split('-')[0];
            try {
                const response = await fetch(`${API_URL}/${endpoint}s/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                });

                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error('Erro ao excluir o item');
                }
            } catch (error) {
                console.error('Erro ao enviar a requisição de exclusão');
            }
        });
    });
});