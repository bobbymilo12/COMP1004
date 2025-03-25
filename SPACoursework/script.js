$(document).ready(function () {
  let data = loadFromLocalStorage();
  function saveToLocalStorage(data) {
    localStorage.setItem('budgetData', JSON.stringify(data));
  }

  function loadFromLocalStorage() {
    const data = localStorage.getItem('budgetData');
    return data ? JSON.parse(data) : [];
  }

  function downloadJSON(data) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "budget.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  function sortData(data, key, ascending = true) {
    return data.sort((a, b) => {
      if (a[key] < b[key]) return ascending ? -1 : 1;
      if (a[key] > b[key]) return ascending ? 1 : -1;
      return 0;
    });
  }


  $("#home").click(function () {
    $("#content").html(`
      <div id="welcome-section">
        <h1>Welcome</h1>
        <p>
          Welcome to the COMP1004 sample Single Page Application. 
        </p>
      </div>
    `);
  });

  $("#input").click(function () {
    $("#content").html(`
      <div class="container mt-5">
        <h1 class="mb-4">Add your Salary and Expenses here:</h1>
        <div class="row">
          <div class="col-md-6">
            <form id="salary-form" class="mb-4">
              <div class="mb-3">
                <label for="salary" class="form-label">Salary:</label>
                <input type="text" class="form-control" id="salary" name="salary">
              </div>
              <button type="submit" class="btn btn-primary">Submit Salary</button>
            </form>
          </div>
          <div class="col-md-6">
            <form id="expenses-form">
              <div class="mb-3">
                <label for="expenses" class="form-label">Expenses:</label>
                <input type="text" class="form-control" id="expenses" name="expenses">
              </div>
              <div class="mb-3">
                <label for="category" class="form-label">Category:</label>
                <select class="form-select" id="category" name="category">
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Rent">Rent</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="date" class="form-label">Date:</label>
                <input type="date" class="form-control" id="date" name="date">
              </div>
              <button type="submit" class="btn btn-primary">Submit Expenses</button>
            </form>
          </div>
        </div>
      </div>
    `);

    let data = loadFromLocalStorage();

    $("#salary-form").submit(function (event) {
      event.preventDefault();
      const salary = parseFloat($("#salary").val());
    
      if (isNaN(salary) || salary <= 0) {
        alert("Please enter a valid salary.");
        return;
      }
    
      let data = loadFromLocalStorage();
      data = data.filter(item => item.type !== "salary");
      data.push({ type: "salary", amount: salary });
      saveToLocalStorage(data);
      alert("Salary added successfully!");
    
      this.reset();
    });


    $("#expenses-form").submit(function (event) {
      event.preventDefault();
      const expenses = parseFloat($("#expenses").val());
      const category = $("#category").val();
      const date = $("#date").val();
    
      if (isNaN(expenses) || expenses <= 0) {
        alert("Please enter a valid expense amount.");
        return;
      }
      if (!date) {
        alert("Please select a date.");
        return;
      }
    
      let data = loadFromLocalStorage();
      data.push({ type: "expenses", amount: expenses, category: category, date: date });
      saveToLocalStorage(data);
      alert("Expense added successfully!");

      this.reset();
    });
  });

  $("#track").click(function () {
    let data = loadFromLocalStorage();
    let salary = data.find(item => item.type === "salary");
    let expenses = data.filter(item => item.type === "expenses");


    function renderTable(data) {
      let totalExpenses = data.reduce((sum, item) => item.type === 'expenses' ? sum + item.amount : sum, 0);
      let remainingBudget = salary ? salary.amount - totalExpenses : 0;

      let content = `
    <h1>Track Spending's</h1>
    <div class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Salary</h5>
            <p class="card-text">£${salary ? salary.amount : 0}</p>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th id="sort-cost">Cost</th>
              <th id="sort-category">Category</th>
              <th id="sort-date">Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  `;

      data.forEach((item, index) => {
        let date = new Date(item.date);
        let formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        content += `
      <tr data-index="${index}">
        <td>£${item.amount}</td>
        <td>${item.category}</td>
        <td>${formattedDate}</td>
        <td>
          <button class="btn btn-warning btn-edit">Edit</button>
          <button class="btn btn-danger btn-delete">Delete</button>
        </td>
      </tr>
    `;
      });

      content += `
          </tbody>
        </table>
                <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Remaining Budget</h5>
            <p class="card-text">£${remainingBudget}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <canvas id="expensesChart"></canvas>
      </div>
    </div>
  `;

      $("#content").html(content);

      $(".btn-delete").click(function () {
        const index = $(this).closest('tr').data('index');
        data.splice(index, 1);
        saveToLocalStorage(data);
        renderTable(data);
      });

      $(".btn-edit").click(function () {
        const index = $(this).closest('tr').data('index');
        const item = data[index];
        const newAmount = prompt("Enter new amount:", item.amount);
        const newCategory = prompt("Enter new category:", item.category);
        const newDate = prompt("Enter new date (YYYY-MM-DD):", item.date);
        if (newAmount && newCategory && newDate) {
          item.amount = parseFloat(newAmount);
          item.category = newCategory;
          item.date = newDate;
          saveToLocalStorage(data);
          renderTable(data);
        }
      });

      

      $("#sort-cost").click(function () {
        expenses = sortData(expenses, 'amount', false);
        renderTable(expenses);
      });

      $("#sort-category").click(function () {
        expenses = sortData(expenses, 'category');
        renderTable(expenses);
      });

      $("#sort-date").click(function () {
        expenses = sortData(expenses, 'date');
        renderTable(expenses);
      });

      renderChart(expenses);
    }


    function renderChart(expenses) {
      const ctx = document.getElementById('expensesChart').getContext('2d');
      const categories = [...new Set(expenses.map(item => item.category))];
      const categoryTotals = categories.map(category => {
        return expenses
          .filter(item => item.category === category)
          .reduce((sum, item) => sum + item.amount, 0);
      });

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: categories,
          datasets: [{
            data: categoryTotals,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Expenses by Category'
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.raw !== null) {
                    label += '£' + context.raw;
                  }
                  return label;
                }
              }
            }
          }
        }
      });
    }

    renderTable(expenses);
  });

  $("#data").click(function () {
    $("#content").html(`
      <h1>Data</h1>
      <button id="download-data" class="btn btn-primary">Download Data</button>
      <button id="upload-data" class="btn btn-primary">Upload Data</button>
    `);

    $("#download-data").click(function () {
      downloadJSON(data);
    });

    $("#upload-data").click(function () {
      $("#file-input").click();
    });

    $("#file-input").change(function (event) {
      const reader = new FileReader();
      reader.onload = function (e) {
        data = JSON.parse(e.target.result);
        saveToLocalStorage(data);
        alert("Budget data sucessfully uploaded!");
      };
      reader.readAsText(event.target.files[0]);
      }
    );
  });
});