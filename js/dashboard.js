const API_URL = 'https://cashtrack-deploy-production.up.railway.app';
//const API_URL = 'http://localhost:8080';

const typeTagMapping = {
    'SALARY': 'Salário',
    'EXTRA': 'Extras',
    'GIFT': 'Presente',
    'MONTHLY_ESSENTIAL': 'Essencial',
    'ENTERTAINMENT': 'Lazer',
    'INVESTMENTS': 'Investimento',
    'LONGTIME_PURCHASE': 'Parcelamento'
}

document.addEventListener('DOMContentLoaded', async () => {
    const editModal = document.getElementById('editModal');
    const editModalTitle = document.getElementById('editModalTitle');
    const editIncomeForm = document.getElementById('editIncomeForm');
    const editExpenseForm = document.getElementById('editExpenseForm');
    const editIncomeLabel = document.getElementById('editIncomeLabel');
    const editExpenseLabel = document.getElementById('editExpenseLabel');
    const editExpenseType = document.getElementById('editExpenseType');
    const editIncomeType = document.getElementById('editIncomeType');
    const editIncomeValue = document.getElementById('editIncomeValue');
    const editExpenseValue = document.getElementById('editExpenseValue');

    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    // Message modal for error or success messages
    const messageModal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');

    function showMessage(message) {
        modalMessage.textContent = message;
        messageModal.style.display = 'flex';

        messageModal.querySelector('.close').addEventListener('click', () => {
            messageModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == messageModal) {
                messageModal.style.display = 'none';
            }
        });
    }

    function showEditModal(title, type, data) {
        if (type === 'expense') {
            editIncomeForm.style.display = 'none';
            editExpenseForm.style.display = 'flex';
            editExpenseLabel.value = data.expenseLabel;
            editExpenseType.value = data.type;
            editExpenseValue.value = data.value;
        } else {
            editIncomeForm.style.display = 'flex';
            editExpenseForm.style.display = 'none';
            editIncomeLabel.value = data.incomeLabel;
            editIncomeType.value = data.type;
            editIncomeValue.value = data.value;
        }
        editModalTitle.textContent = title;
        editModal.style.display = 'flex';

        editModal.querySelector('.close').addEventListener('click', () => {
            editModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == editModal) {
                editModal.style.display = 'none';
            }
        });
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    const accessToken = getCookie('accessToken');
    if (!accessToken) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
        deleteCookie('accessToken');
        window.location.href = 'index.html';
    });

    // When the burger button is clicked, activates the hidden nav menu
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });


    // GET request for the user account data
    try {
        const accountDataResponse = await fetch(`${API_URL}/users/account`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (accountDataResponse.ok) {
            const usernameData = await accountDataResponse.json();
            const usernameElement = document.getElementById('username');
            if (usernameElement) {
                usernameElement.textContent = usernameData.username;
            }
        } else {
            showMessage('Erro ao obter os dados do usuário. Tente recarregar a página ou fazer login novamente.');
        }
    } catch (error) {
        showMessage('Erro ao obter os dados do usuário. Tente recarregar a página ou fazer login novamente.');
    }

    // GET request for the user's transactions
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
            const incomeElement = document.getElementById('total-incomes');
            const balanceElement = document.getElementById('balance');
            if (expenseElement && incomeElement) {
                expenseElement.textContent = `R$ ${transactionsData.totalExpenses.toFixed(2)}`;
                incomeElement.textContent = `R$ ${transactionsData.totalIncomes.toFixed(2)}`;
                balanceElement.textContent = `R$ ${transactionsData.balance.toFixed(2)}`;
            }
        } else {
            showMessage('Erro ao obter as transações do usuário. Tente recarregar a página ou fazer login novamente.');
        }
    } catch (error) {
        showMessage('Erro ao obter as transações do usuário. Tente recarregar a página ou fazer login novamente.');
    }

    // GET request for the user's income list
    try {
        const incomesResponse = await fetch(`${API_URL}/incomes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (incomesResponse.ok) {
            const incomesData = await incomesResponse.json();
            const lastIncomesElement = document.getElementById('last-incomes');
            if (lastIncomesElement) {
                const sortedIncomes = incomesData.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
                const lastThreeIncomes = sortedIncomes.slice(0, 3);
                if (lastThreeIncomes.length === 0) {
                    lastIncomesElement.innerHTML = `<li style="border: 0px;"><p>Não há entradas registradas</p></li>`
                } else {
                    lastIncomesElement.innerHTML = lastThreeIncomes.map(income => `
                        <hr>
                        <li>
                            <h4>${income.incomeLabel}</h4>
                            <span style="display:none;">${income.id}</span>
                            <div>
                                <p><span class="value">R$ ${income.value.toFixed(2)}</span></p>
                                <p><span class="type-tag">${typeTagMapping[income.type] || income.type}</span></p>
                                <p>${new Date(income.dateCreated).toLocaleDateString()}</p>
                                <button class="delete-btn-desktop" id="delete-btn" data-id="income-${income.id}">
                                    <i class="fas fa-trash-alt" data-id="income-${income.id}"></i>
                                </button>
                                <button class="edit-btn-desktop" id="edit-btn" data-id="income-${income.id}">
                                    <i class="fas fa-pencil-alt" data-id="income-${income.id}"></i>
                                </button>
                            </div>
                            <button class="delete-btn" id="delete-btn" data-id="income-${income.id}">
                                <i class="fas fa-trash-alt" data-id="income-${income.id}"></i>
                            </button>
                            <button class="edit-btn" id="edit-btn" data-id="income-${income.id}">
                                <i class="fas fa-pencil-alt" data-id="income-${income.id}"></i>
                            </button>
                        </li>
                    `).join('');
                }
            }
        } else {
            showMessage('Erro ao obter as transações do usuário. Tente recarregar a página ou fazer login novamente.');
        }
    } catch (error) {
        showMessage('Erro ao obter as transações do usuário. Tente recarregar a página ou fazer login novamente.');
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
            const lastExpensesElement = document.getElementById('last-expenses');
            if (lastExpensesElement) {
                const sortedExpenses = expensesData.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
                const lastThreeExpenses = sortedExpenses.slice(0, 3);
                if (lastThreeExpenses.length === 0) {
                    lastExpensesElement.innerHTML = `<li style="border: 0px;"><p>Não há despesas registradas</p></li>`
                } else {
                    lastExpensesElement.innerHTML = lastThreeExpenses.map(expense => `
                        <hr>
                        <li>
                            <h4>${expense.expenseLabel}</h4>
                            <span style="display:none;">${expense.id}</span>
                            <div>
                                <p><span class="value">R$ ${expense.value.toFixed(2)}</span></p>
                                <p><span class="type-tag">${typeTagMapping[expense.type] || expense.type}</span></p>
                                <p>${new Date(expense.dateCreated).toLocaleDateString()}</p>
                                <button class="delete-btn-desktop" id="delete-btn" data-id="expense-${expense.id}">
                                    <i class="fas fa-trash-alt" data-id="expense-${expense.id}"></i>
                                </button>
                                <button class="edit-btn-desktop" id="edit-btn" data-id="expense-${expense.id}">
                                    <i class="fas fa-pencil-alt" data-id="expense-${expense.id}"></i>
                                </button>
                            </div>
                            <button class="delete-btn" id="delete-btn" data-id="expense-${expense.id}">
                                <i class="fas fa-trash-alt" data-id="expense-${expense.id}"></i>
                            </button>
                            <button class="edit-btn" id="edit-btn" data-id="expense-${expense.id}">
                                <i class="fas fa-pencil-alt" data-id="expense-${expense.id}"></i>
                            </button>
                        </li>
                    `).join('');
                }
            }
        } else {
            showMessage('Erro ao obter as transações do usuário. Tente recarregar a página ou fazer login novamente.');
        }
    } catch (error) {
        showMessage('Erro ao obter as transações do usuário. Tente recarregar a página ou fazer login novamente.');
    }

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
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
                    showMessage('Erro ao obter as transações do usuário. Tente recarregar a página ou fazer login novamente.');
                }
            } catch (error) {
                showMessage('Erro ao obter as transações do usuário. Tente recarregar a página ou fazer login novamente.');
            }
        });
    });

    document.querySelectorAll('.delete-btn-desktop').forEach(button => {
        button.addEventListener('click', async (event) => {
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
                    showMessage('Erro ao obter as transações do usuário. Tente recarregar a página ou fazer login novamente.');
                }
            } catch (error) {
                showMessage('Erro ao obter as transações do usuário. Tente recarregar a página ou fazer login novamente.');
            }
        });
    });

    document.querySelectorAll('.edit-btn-desktop').forEach(button => {
        button.addEventListener('click', async (event) => {
            const [endpoint, id] = event.target.getAttribute('data-id').split('-');
    
            try {
                const response = await fetch(`${API_URL}/${endpoint}s/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                });
    
                if (response.ok) {
                    const data = await response.json();
                    showEditModal('Editar registro', endpoint, data);
                } else {
                    showMessage('Erro ao obter os dados do registro');
                }
            } catch (error) {
                showMessage('Erro ao enviar a requisição');
            }

            editIncomeForm.addEventListener('submit', async (event) => {
                event.preventDefault();
        
                const data = {
                    id: parseInt(id),
                    incomeLabel: editIncomeLabel.value,
                    value: parseFloat(editIncomeValue.value),
                    type: editIncomeType.value
                }
        
                try {
                    const response = await fetch(`${API_URL}/incomes`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        credentials: 'include',
                        body: JSON.stringify(data)
                    });
        
                    if (response.status === 200) {
                        window.location.reload();
                    } else {
                        editModal.style.display = 'none';
                        showMessage('Erro ao adicionar. Tente novamente.');
                    }
                } catch (error) {
                    editModal.style.display = 'none';
                    showMessage('Erro ao adicionar. Tente novamente.');
                }
            });

            editExpenseForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const data = {
                    id: parseInt(id),
                    expenseLabel: editExpenseLabel.value,
                    value: parseFloat(editExpenseValue.value),
                    type: editExpenseType.value
                }
        
                try {
                    const response = await fetch(`${API_URL}/expenses`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        credentials: 'include',
                        body: JSON.stringify(data)
                    });
        
                    if (response.status === 200) {
                        window.location.reload();
                    } else {
                        editModal.style.display = 'none';
                        showMessage('Erro ao adicionar. Tente novamente.');
                    }
                } catch (error) {
                    editModal.style.display = 'none';
                    showMessage('Erro ao adicionar. Tente novamente.');
                }
            });

        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const [endpoint, id] = event.target.getAttribute('data-id').split('-');
    
            try {
                const response = await fetch(`${API_URL}/${endpoint}s/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                });
    
                if (response.ok) {
                    const data = await response.json();
                    showEditModal('Editar registro', endpoint, data);
                } else {
                    showMessage('Erro ao obter os dados do registro');
                }
            } catch (error) {
                showMessage('Erro ao enviar a requisição');
            }

            editIncomeForm.addEventListener('submit', async (event) => {
                event.preventDefault();
        
                const data = {
                    id: parseInt(id),
                    incomeLabel: editIncomeLabel.value,
                    value: parseFloat(editIncomeValue.value),
                    type: editIncomeType.value
                }
        
                try {
                    const response = await fetch(`${API_URL}/incomes`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        credentials: 'include',
                        body: JSON.stringify(data)
                    });
        
                    if (response.status === 200) {
                        window.location.reload();
                    } else {
                        editModal.style.display = 'none';
                        showMessage('Erro ao editar. Tente novamente.');
                    }
                } catch (error) {
                    editModal.style.display = 'none';
                    showMessage('Erro ao editar. Tente novamente.');
                }
            });

            editExpenseForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const data = {
                    id: parseInt(id),
                    expenseLabel: editExpenseLabel.value,
                    value: parseFloat(editExpenseValue.value),
                    type: editExpenseType.value
                }
        
                try {
                    const response = await fetch(`${API_URL}/expenses`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        credentials: 'include',
                        body: JSON.stringify(data)
                    });
        
                    if (response.status === 200) {
                        window.location.reload();
                    } else {
                        editModal.style.display = 'none';
                        showMessage('Erro ao editar. Tente novamente.');
                    }
                } catch (error) {
                    editModal.style.display = 'none';
                    showMessage('Erro ao editas. Tente novamente.');
                }
            });

        });
    });

    document.getElementById('view-all-expenses-btn').addEventListener('click', () => {
        window.location.href = 'expenses-dashboard.html'; 
    });

    document.getElementById('view-all-incomes-btn').addEventListener('click', () => {
        window.location.href = 'incomes-dashboard.html'; 
    });
});