const express = require("express");
const app = express();

const bodyparser = require("body-parser");
app.use(bodyparser.json());

const cors = require("cors");
app.use(cors());

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "algodomain",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/get_all", (req, res) => {
    const query = "SELECT * FROM products";
  
    connection.query(query, (err, result) => {
      if (err) {
        console.log("server error");
        res.status(500).send({
          success: false,
          msg: "Server Error",
          data: [],
        });
      } else {
        console.log("succesfully...");
        res.send({
          success: true,
          msg: "succesfully...",
          data: result,
        });
      }
    });
  });


  app.post("/add_product", (req, res) =>{
    const product_id  = req.body.product_id;
    const product_name  = req.body.product_name;
    const product_type  = req.body.product_type;
    const product_category = req.body.product_category;
    const product_price  = req.body.product_price;
    const query = "INSERT INTO products(product_id, product_name, product_type, product_category, product_price) VALUES(?,?,?,?,?)";
    connection.query(query, [product_id, product_name, product_type, product_category, product_price], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({
          success: false,
          msg: "server error",
          data: []
        });
      } else {
        res.status(200).send({
          success: true,
          msg: "Product Added successfully",
          data: result
        });
      }
    });
  });

  app.put("/update_products/:product_id", (req, res) => {
    const xyz = req.params.product_id;
    console.log(xyz)
    const product_id  = req.body.product_id;
    const product_name  = req.body.product_name;
    const product_type  = req.body.product_type;
    const product_category  = req.body.product_category;
    const product_price  = req.body.product_price;
    const query = "UPDATE products SET product_id = ?, product_name = ?, product_type = ?, product_category = ?,  product_price = ?  WHERE product_id = ?";
    connection.query(query, [product_id, product_name, product_type, product_category, product_price, xyz],
      (err, result) => {
        if (err) {
            console.log(err)
          res.status(500).send({
            success: false,
            msg: "server error",
            data: [],
          });
        } else {
          res.status(200).send({
            success: true,
            msg: "data updated",
            data: result
          });
        }
      }
    );
  });

  app.delete("/delete_products/:product_id", (req, res) => {
    const id = req.params.product_id;
    const query = "DELETE FROM products WHERE product_id = ?";
    connection.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          msg: "server error",
          data: [],
        });
      } else {
        res.status(201).send({
          success: true,
          msg: "done",
          data: result.affectedRows,
        });
      }
    });
  });

const port = 9000;
app.listen(port);