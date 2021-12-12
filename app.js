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
const app = express()
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "intellimall" 
// });

var con = mysql.createConnection({
  host: "sql6.freemysqlhosting.net",
  user: "sql6458205",
  password: "3CcwdlGKqG",
  database: "sql6458205" 
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get("/",(req,res)=>{
  res.send("WELCOME TO APP")
})

app.get('/totalearning',(req,res)=>{
const sql='select price from orders where status="Completed"';
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.get('/admin',(req,res)=>{
const sql="SELECT * FROM admin";
	
  con.query(sql, function (err, result, fields) {
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
  [req.body.name,req.body.email_address,req.body.password,req.body.phone,req.body.address,req.body.is_allowed_in_app,req.body.joined_at]
  ];
	
	console.log(values[0])
  
  con.query("insert into users(name,email_address,password,phone,address,is_allowed_in_app,joined_at) values ?",[values], function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.put('/user',(req,res)=>{
  let values=null
  if(req.body.is_allowed_in_app === 0){
    con.query("update users SET is_allowed_in_app=? WHERE id=?",[1,req.body.id], function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });

  }else if(req.body.is_allowed_in_app === 1){
    con.query("update users SET is_allowed_in_app=? WHERE id=?",[0,req.body.id], function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  }
});

 
app.get('/product',(req,res)=>{
  con.query("select * from products", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
}); 


app.post('/product',(req,res)=>{
	// let date=new Date()

	// let ddate=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()  

  const values=[	
  [req.body.title,req.body.description,req.body.image_url,req.body.price,req.body.category,req.body.date]
  ];

  con.query("insert into products(title,description,image_url,price,category,last_updated_at) values ?",[values], function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});


app.put('/product',(req,res)=>{
  const date = new Date();
  const values=[req.body.title,req.body.description,req.body.image_url,req.body.price,req.body.category,req.body.date,req.body.id]; 
  const sql = "UPDATE products SET title=?,description=?,image_url=?,price=?,category=?,last_updated_at=?  WHERE id=?";


  con.query(sql,values, function (err, result, fields) {
    if (err){
      res.send(err)
    }
    res.send(result);
  });
});
  

// ORDERS TABLE
app.get("/order",(req,res)=>{
  console.log(req.params)
// const sql="select o.id, u.name, u.phone, u.address, o.price, o.status, o.last_updated_at FROM users as u JOIN orders AS o ON o.user_id = u.id"
// const sql="select * from orders"
	const sql="select o.id,u.id AS user_id, u.name, u.phone, u.address, o.price, o.status, o.last_updated_at FROM users as u JOIN orders AS o ON o.user_id = u.id"
	
  con.query(sql,(err,result,fields)=>{
    if (err){
      console.log("ERORR GETTING ALL ORDERS")
      res.send(err)
    }
    res.send(result)
  })
});

app.post("/order",(req,res)=>{
  const values=[[req.body.user_id,req.body.price,req.body.status,req.body.date]];

  con.query("insert into orders(user_id,price,status,last_updated_at) values ?",[values],(err,result,fields)=>{
    if (err){
      console.log("ERORR INSERTING INTO ORDERS TABLE")
      res.send(err)
    }
    res.send(result)
  })
});

app.put("/order",(req,res)=>{
  const values=[req.body.date,req.body.id];

  con.query('UPDATE orders SET last_updated_at=?, status="Completed" WHERE id=?',values,(err,result,fields)=>{
    if (err){
      console.log("ERORR INSERTING INTO ORDERS TABLE")
      res.send(err)
    }
    res.send(result)
  })
});

// shopping_cart
app.get("/cart/:id",(req,res)=>{
  con.query("select * from shopping_cart WHERE id=?",req.params.id,(err,result,fields)=>{
    if (err){
      console.log("ERORR GETTING ALL ORDERS")
      res.send(err)
    }
    res.send(result)
  })
});

app.post("/cart",(req,res)=>{
  const values=[[req.body.product_id,req.body.quantity,req.body.user_id,req.body.date]];

  con.query("insert into shopping_cart(product_id,quantity,user_id,last_updated_at) values ?",[values],(err,result,fields)=>{
    if (err){
      console.log("ERORR INSERTING INTO ORDERS TABLE")
      res.send(err)
    }
    res.send(result)
  })
});

app.put("/cart",(req,res)=>{
  con.query("UPDATE shopping_cart set quantity=? where user_id=? AND product_id=?",[req.body.quantity,req.body.user_id,req.body.product_id],(err,result,fields)=>{
    if (err){
      console.log("ERROR IN UPDATING PRODUCT TABLE")
      console.log(err)
    }
    res.send(result);
  })
})

app.delete("/cart",(req,res)=>{
  con.query("DELETE from shopping_cart WHERE product_id=? AND user_id=?",[req.body.product_id,req.body.user_id],(err,result,fields)=>{
    if (err){
      console.log("ERROR IN UPDATING PRODUCT TABLE")
      console.log(err)
    }
    res.send(result);
  })
})

app.get("/orderitems/:user_id",(req,res)=>{

  const sql="select p.*,o.quantity from products as p JOIN order_items as o on p.id = o.product_id where p.id and o.product_id in (select product_id from shopping_cart where user_id=?)"
	
	con.query(sql,req.params.user_id,(err,result,fields)=>{
      if (err){
        res.send(err)
      }
      res.send(result)
    })
  })

app.post("/orderitems",(req,res)=>{ 
  const values=[[req.body.product_id ,req.body.order_id ,req.body.quantity ,req.body.price ,req.body.date]];

  con.query("insert into order_items(product_id,order_id,quantity,price,added_at) values ?",[values],(err,result,fields)=>{
    if (err){
      console.log("ERORR INSERTING INTO ORDERS TABLE")
      res.send(err)
    } 
    res.send(result)
  })
});

let port=process.env.PORT || 5000 
app.listen(port,()=>{
    console.log("Listening on " + port)
});