// User Login DONE
// User Register DONE
// Admin Login DONE
// Add Products DONE
// Edit Products DONE
// Delete product DONE
// Manage users (Edit / Delete) DONE
// All orders DONE
// Update order status DONE
// Add products to cart DONE
// Remove item to cart DONE
// Place order DONE

var mysql = require('mysql');
var cors = require('cors')
const express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs');
const app = express()
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1122",
  database: "intellimall"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


app.get('/',(req,res)=>{
  con.query("SELECT * FROM admin", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.get('/user',(req,res)=>{
  con.query("select * from users", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.post('/user',(req,res)=>{
  const values=[
  [req.body.name,req.body.email_address,req.body.password,req.body.phone,req.body.address,req.body.is_allowed_in_app]
  ];

  con.query("insert into users(name,email_address,password,phone,address,is_allowed_in_app) values ?",[values], function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.delete("/user",(req,res)=>{
  con.query("DELETE from users WHERE id=?",req.body.id,(err,result,fields)=>{
    if (err){
      console.log("ERROR IN UPDATING PRODUCT TABLE")
      console.log(err)
    }
    res.send(result);
  })
})
 
app.get('/product',(req,res)=>{
  con.query("select * from products ", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
    console.log(result)
  });
});


app.post('/product',(req,res)=>{
  const date = new Date();  
  const values=[
  [req.body.title,req.body.description,req.body.image_url,req.body.price,req.body.category,date]
  ];

  con.query("insert into products(title,description,image_url,price,category,last_updated_at) values ?",[values], function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});


app.put('/product',(req,res)=>{
  const date = new Date();
  const values=[req.body.title,req.body.description,req.body.image_url,req.body.price,req.body.category,date,req.body.id]; 
  const sql = "UPDATE products SET title=?,description=?,image_url=?,price=?,category=?,last_updated_at=?  WHERE id=?";

  con.query(sql,values, function (err, result, fields) {
    if (err){
      res.send(err)
    }
    res.send(result);
  });
});
  
app.delete("/product",(req,res)=>{
  // res.send(req.body.id)
  con.query("DELETE from products WHERE id=?",req.body.id,(err,result,fields)=>{
    if (err){
      console.log("ERROR IN DELETING RECORD IN PRODUCT TABLE")
      console.log(err)
    }
    res.send(result);
  })
});

// ORDERS TABLE
app.get("/order",(req,res)=>{
  con.query("select * from orders",(err,result,fields)=>{
    if (err){
      console.log("ERORR GETTING ALL ORDERS")
      res.send(err)
    }
    res.send(result)
  })
});

app.post("/order",(req,res)=>{
  const date = new Date();
  const values=[[req.body.user_id,req.body.price,req.body.status,date]];

  con.query("insert into orders(user_id,price,status,last_updated_at) values ?",[values],(err,result,fields)=>{
    if (err){
      console.log("ERORR INSERTING INTO ORDERS TABLE")
      res.send(err)
    }
    res.send(result)
  })
});

app.put("/order",(req,res)=>{
  // const date = new Date();
  // const values=[req.body.id,req.body.status,date];
  const values=[req.body.status,req.body.id];

  con.query("UPDATE orders SET status=? WHERE id=?",values,(err,result,fields)=>{
    if (err){
      console.log("ERORR INSERTING INTO ORDERS TABLE")
      res.send(err)
    }
    res.send(result)
  })
});

// shopping_cart
app.get("/cart",(req,res)=>{
  con.query("select * from shopping_cart",(err,result,fields)=>{
    if (err){
      console.log("ERORR GETTING ALL ORDERS")
      res.send(err)
    }
    res.send(result)
  })
});

app.post("/cart",(req,res)=>{
  const date = new Date();
  const values=[[req.body.product_id,req.body.quantity,req.body.user_id,date]];

  con.query("insert into shopping_cart(product_id,quantity,user_id,last_updated_at) values ?",[values],(err,result,fields)=>{
    if (err){
      console.log("ERORR INSERTING INTO ORDERS TABLE")
      res.send(err)
    }
    res.send(result)
  })
});

app.delete("/cart",(req,res)=>{
  con.query("DELETE from shopping_cart WHERE id=?",req.body.id,(err,result,fields)=>{
    if (err){
      console.log("ERROR IN UPDATING PRODUCT TABLE")
      console.log(err)
    }
    res.send(result);
  })
})

app.get("/orderitems",(req,res)=>{
  con.query("select * from order_items",(err,result,fields)=>{
    if (err){
      console.log("ERORR GETTING ALL ORDERS")
      res.send(err)
    }
    res.send(result)
  })
});

app.post("/orderitems",(req,res)=>{
  const date = new Date();
  const values=[[req.body.product_id ,req.body.order_id ,req.body.quantity ,req.body.price ,req.body.added_at ]];

  con.query("insert into order_items(product_id,order_id,quantity,price,added_at) values ?",[values],(err,result,fields)=>{
    if (err){
      console.log("ERORR INSERTING INTO ORDERS TABLE")
      res.send(err)
    }
    res.send(result)
  })
});

let port=process.env.PORT || 3000

app.listen(port,()=>{
    console.log("Listening on 3000")
});