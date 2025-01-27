        let income = 0;
        let expenses = [];

        const setIncomeButton = document.getElementById('setIncome');
        const addExpenseButton = document.getElementById('addExpense');
        const incomeDisplay = document.getElementById('display-income');
        const expensesDisplay = document.getElementById('display-expenses');
        const remainingDisplay = document.getElementById('display-remaining');

        setIncomeButton.addEventListener('click', () => {
            const incomeInput = document.getElementById('income');
            income = parseFloat(incomeInput.value) || 0;
            updateSummary();
            incomeInput.value = '';
        });

        addExpenseButton.addEventListener('click', () => {
            const title = document.getElementById('expense-title').value;
            const amount = parseFloat(document.getElementById('expense-amount').value) || 0;
            const category = document.getElementById('expense-category').value;

            if (title && amount > 0) {
                expenses.push({ title, amount, category });
                updateSummary();
            }

            document.getElementById('expense-title').value = '';
            document.getElementById('expense-amount').value = '';
        });

        function updateSummary() {
            const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const remainingBudget = income - totalExpenses;

            incomeDisplay.textContent = income.toFixed(2);
            expensesDisplay.textContent = totalExpenses.toFixed(2);
            remainingDisplay.textContent = remainingBudget.toFixed(2);
        }