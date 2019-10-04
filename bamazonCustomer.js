var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  loadProducts();
});

function loadProducts() {
    connection.query("select * from products", function(err,res){
        if (err) throw err;
        console.table(res);
        promptForId(res);
    })
}
function promptForId(inventory){
    inquirer
    .prompt({
      name: "choice",
      type: "input",
      message: "Enter the id of the product you would like to buy?"
    })
    .then(function(answer) {
        var id = parseInt(answer.choice);
        var product = checkInventory(id, inventory);
        if(product){
            promptForQuantity(product);
        }
        else{
            console.log("The item is not in the inventory.");
            loadProducts();
        }
    });

}

function checkInventory(id, inventory){
    for (var i = 0; i < inventory.length; i ++){
        if (inventory[i].id == id) {
            return inventory[i]
        }
    }
    return null;
}   

function promptForQuantity(product){
    inquirer
    .prompt({
      name: "quantity",
      type: "input",
      message: "How many would you like to buy?"
    })
    .then(function(answer) {
        var quantity = parseInt(answer.quantity)
        if (quantity > product.stock_quantity) {
            console.log("Insufficient inventory, please select less.")
            loadProducts()
        }
        else {
            makePurchase(product, quantity)
        }

    })
}

function makePurchase(product, quantity) {
    // query quantity by id
    connection.query ("UPDATE products SET ? WHERE id = ?", [quantity, product.id], function(err, res){
        
        console.log(" Successfully purchased " + quantity + " " + product.product_name + " " + " which costs " + "$" + product.price * quantity);
        
        // quanity - input
        // query update where id quanity 
        loadProducts();

    })
}