$(document).ready(function () {
  $("#home").click(function () {
      $("#content").html(`
        <div id="welcome-section">
          <h1>Welcome</h1>
          <p>
            Welcome to the COMP1004 sample Single Page Application. In this example,
            we shall load a map, a treasure game, and a data chart into this space
            to illustrate how jQuery will allow you to provide a rich user
            experience on one HTML page.
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
          <button type="submit" class="btn btn-primary">Submit Expenses</button>
        </form>
      </div>
    `);

    $("#salary-form").submit(function (event) {
      event.preventDefault();
      const salary = $("#salary").val();
      const data = { salary: salary };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      saveAs(blob, "budget.json");
    });

    $("#expenses-form").submit(function (event) {
      event.preventDefault();
      const expenses = $("#expenses").val();
      const category = $("#category").val();
      const data = { expenses: expenses, category: category };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      saveAs(blob, "budget.json");
    });
  });

  $("#track").click(function () {
      $("#content").html(`
        <h1>Track Spending's</h1>
        <p>This section will track spendings.</p>
      `);
  });

  $("#data").click(function () {
      $("#content").html(`
        <h1>Data</h1>
        <p>This section will display data.</p>
      `);
  });
}); 