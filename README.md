# DGL 113 2026WI Assignment #7

This assignment continually uses the drink order processing webpage for you to demonstrate programming skills in object oriented programming, DOM operations, and event handling. You will reuse the classes created in the last assignment, and provide additional JS code to support the functionality of the drink order processing web application.

#### Preparation

Preview the docs/index.html file with a web browser to refresh your memory on the webpage layout and its functionality.

Copy the app.js file from your completed assignmeht 6 folder to this assignment's docs folder, then provided the required JS code to complete the tasks specified below.

#### New Tasks

1. Provide the JS code so that when the add button is clicked, it will add the item to the order, update the total and the UI. The item row added to the UI should include a button Delete.
2. Provide the JS code so that when the Delete button is clicked, it will remove that item from the order, then update the total and the UI. HINT: To simplify the operation, you may consider even handling delegation.
3. For the Add item function, add the logic to determine if an item with the same size and description already appears in the order. If so, then consolidate the quantities. For example, if order already contains "3 Venti Earl Grey Tea"
   and the customer adds "4 Venti Earl Grey Tea", then the resulting order should only have one order item for "Venti Earl Grey Tea" with quantity "7".

**Remember that:**

- Short, Tall, Grande, and Venti coffees cost 2.99, 3.19, 3.49 and 3.99 respectively, and
- Short, Tall, Grande, and Venti teas cost 2.85, 3.05, 3.25, and 3.50 respectively.

NOTE: Only modify the `docs/app.js` file.
Do not make changes to any other files.
