$(document).ready(function () {
    // Navigation logic
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
          <h1>Add your Salary and Expenses here</h1>
          <p>This section will load the map content.</p>
        `);
    });

    $("#track").click(function () {
        $("#content").html(`
          <h1>Track Spending's</h1>
          <p>This section will load the treasure game content.</p>
        `);
    });

    $("#data").click(function () {
        $("#content").html(`
          <h1>Data</h1>
          <p>This section will load the data chart content.</p>
        `);
    });
});