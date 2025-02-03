$(document).ready(function () {
  function saveToLocalStorage(data) {
    localStorage.setItem('budgetData', JSON.stringify(data));
  }

  function loadFromLocalStorage() {
    const data = localStorage.getItem('budgetData');
    return data ? JSON.parse(data) : [];
  }

  function downloadJSON(data) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "budget.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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
        <h1 class="mb-4">Add your Salary and Expenses here</h1>
        <form id="salary-form" class="mb-4">
          <div class="mb-3">
            <label for="salary" class="form-label">Salary:</label>
            <input type="text" class="form-control" id="salary" name="salary">
          </div>
          <button type="submit" class="btn btn-primary">Submit Salary</button>
        </form>
        <form id="expenses-form">
          <div class="mb-3">
            <label for="expenses" class="form-label">Expenses:</label>
            <input type="text" class="form-control" id="expenses" name="expenses">
          </div>
          <div class="mb-3">
            <label for="category" class="form-label">Category:</label>
            <select class="form-select" id="category" name="category">
              <option value="food">Food</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="date" class="form-label">Date:</label>
            <input type="date" class="form-control" id="date" name="date">
          </div>
          <button type="submit" class="btn btn-primary">Submit Expenses</button>
        </form>
      </div>
    `);

    let data = loadFromLocalStorage();

    $("#salary-form").submit(function (event) {
      event.preventDefault();
      const salary = parseFloat($("#salary").val());
      let data = loadFromLocalStorage();
      data = data.filter(item => item.type !== "salary");
      data.push({ type: "salary", amount: salary });
      saveToLocalStorage(data);
  });

    $("#expenses-form").submit(function (event) {
      event.preventDefault();
      const expenses = $("#expenses").val();
      const category = $("#category").val();
      const date = $("#date").val();
      data.push({ type: "expenses", amount: parseFloat(expenses), category: category, date: date });
      saveToLocalStorage(data);
    });
  });

  $("#track").click(function () {
    let data = loadFromLocalStorage();
    let salary = data.find(item => item.type === "salary");
    let expenses = data.filter(item => item.type === "expenses");

    let content = `
      <h1>Track Spending's</h1>
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Salary</h5>
          <p class="card-text">£${salary ? salary.amount : 0}</p>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Cost</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
    `;

    expenses.forEach(item => {
      let date = new Date(item.date);
      let formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
      content += `
        <tr>
          <td>£${item.amount}</td>
          <td>${item.category}</td>
          <td>${formattedDate}</td>
        </tr>
      `;
    });

    content += `
        </tbody>
      </table>
      <button id="download-data" class="btn btn-primary">Download Data</button>
    `;

    $("#content").html(content);

    $("#download-data").click(function () {
      downloadJSON(data);
    });
  });

  $("#data").click(function () {
    $("#content").html(`
      <h1>Data</h1>
      <p>This section will display data.</p>
    `);
  });
});