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
var bodyParser = require('body-parser');
const { response } = require('express');
const app = express()
app.use(cors())

// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '50mb' }))

// var con = mysql.createConnection({
//   host: "localhost", 
//   user: "root",
//   password: "password",
//   database: "intellimall" 
// });

var con = mysql.createConnection({
  host: "sql6.freemysqlhosting.net",
  user: "sql6459930",
  password: "BXgVmKuFeJ",
  database: "sql6459930" 
});
 
con.connect((err)=> {
  if (err) {
    // throw err
    throw (err)
  }
  console.log("Connected!");
}); 

app.get("/",(req,res)=>{
  res.send("welcome");
})

app.get('/totalearning',(req,res)=>{
const sql='select sum(price) as price from orders where status="Completed"';
  con.query(sql, function (err, result, fields) {
    if (err) {
      res.send(err)
    }
    res.send(result);
  });
});

app.get('/feedback/:user_id/:order_id',(req,res)=>{
  con.query("select * from feedback where user_id=? and order_id=?",[req.params.user_id,req.params.order_id], (err, result, fields)=> {
    if (err) {
      res.send(err)
    }
    if (result.length === 0){
      res.send(
        {
          id:1,
          user_id:1,
          order_id:1,
          rating:0.0,
          last_activity_at: "", 
          status:"",
          comment:"",
      }) 
    } else{
      res.send(result);
    }
  })
});

app.get('/feedbackuser/:user_id',(req,res)=>{
  con.query("select * from feedback where user_id=? and status='pending'",[req.params.user_id], (err, result, fields)=> {
    if (err) {
      res.send(err)
    }
    res.send(result);
  })
});

app.post('/feedback',(req,res)=>{
  const values=[ 
    [req.body.user_id,req.body.last_activity_at,req.body.status,req.body.rating,req.body.comment,req.body.order_id]
    ];

    con.query("insert into feedback(user_id,last_activity_at,status,rating,comment,order_id) values ?",[values], function (err, result, fields) {
      if (err) {
        res.send(err)
      }
      res.send(result);
    });
  });

  app.put('/feedback',(req,res)=>{
    const values=[req.body.last_activity_at,req.body.status,req.body.rating,req.body.comment,req.body.id];
  
      con.query("update feedback set last_activity_at=?,status=?, rating=?, comment=? where id=?",[req.body.last_activity_at,req.body.status,req.body.rating,req.body.comment,req.body.id], function (err, result, fields) {
        if (err) {
          res.send(err)
        }
        res.send(result);
      });
    });


app.get('/admin',(req,res)=>{
const sql="SELECT * FROM admin";
	
  con.query(sql, function (err, result, fields) {
    if (err) {
      res.send(err)
    }
    res.send(result);
  });
});

app.get('/user',(req,res)=>{
  con.query("select * from users", function (err, result, fields) {
    if (err) {
      res.send(err)
    }
    res.send(result);
  });
});

app.get('/user/login/:email/:password',(req,res)=>{
  con.query("select * from users where email_address=? and password=?",[req.params.email,req.params.password], function (err, result, fields) {
    // if (err) {
    //   res.send(err)
    // }
    // if (result[0].email_address === req.params.email && result[0].password === req.params.password){
    //   res.send({
    //     status: true,
    //     message: "login successfull",
    //   });
    // } else{
    //   res.send({
    //     status: false,
    //     message: "email or password is not correct",
    //   });

      if (result.length > 0){
        res.send({
          user:result[0],
          status: true,
          message: "login successfull",
        });
      } else{
        res.send({
          user:null,
          status: false,
          message: "email or password is not correct",
        });
    }
    // console.log(result[0]) 
    // res.send(result);

  });
});


app.post('/user',(req,res)=>{
  const values=[ 
  [req.body.name,req.body.email_address,req.body.password,req.body.phone,req.body.address,req.body.is_allowed_in_app,req.body.joined_at]
  ];
	 
  con.query("insert into users(name,email_address,password,phone,address,is_allowed_in_app,joined_at) values ?",[values], function (err, result, fields) {
    if (err) {
      if(err.code === "ER_DUP_ENTRY"){
        res.send({
          message:"Email Already used",
          user: null
        })
      }
    }else{
      res.send({
        message:"Resigteration Successful",
        user:{name:req.body.name,
        email_address:req.body.email_address,
        password:req.body.password,
        phone:req.body.phone,
        address:req.body.address,
        is_allowed_in_app:req.body.is_allowed_in_app,
        joined_at:req.body.joined_at}
      });
    }
  });
});

app.put('/user',(req,res)=>{
  let values=null
  if(req.body.is_allowed_in_app === 0){
    con.query("update users SET is_allowed_in_app=? WHERE id=?",[1,req.body.id], function (err, result, fields) {
      if (err) {
        res.send(err)
      }
      res.send(result);
    });

  }else if(req.body.is_allowed_in_app === 1){
    con.query("update users SET is_allowed_in_app=? WHERE id=?",[0,req.body.id], function (err, result, fields) {
      if (err) {
        res.send(err)
      }
      res.send(result);
    });
  }
});

app.put('/user/:id',(req,res)=>{
  const values=[req.body.name, req.body.email_address, req.body.password, req.body.phone, req.body.address, req.params.id];
     
    con.query("UPDATE users set name=?, email_address=?, password=?, phone=?, address=? where id=?",values, function (err, result, fields) {
      if (err) {
        res.send(err)
      }else{
        res.send(result); 
      }
    });
});

app.get('/product',(req,res)=>{
  con.query("select * from products", function (err, result, fields) {
    if (err) {
      res.send(err)
    }
    res.send(result);
  });
});

app.get('/product/:title',(req,res)=>{
  const title="'("+req.params.title+")'"
  const sql ="select * from products where title REGEXP " + title;

  con.query(sql,title, function (err, result, fields) {
    if (err) {
      res.send(err)
    }
    res.send(result);
  });
});


app.post('/product',(req,res)=>{
  const values=[	
  [req.body.title,req.body.description,req.body.image_url,req.body.price,req.body.category.toLowerCase(),req.body.last_updated_at]
  ];

  con.query("insert into products(title,description,image_url,price,category,last_updated_at) values ?",[values], function (err, result, fields) {
    if (err) {
      res.send(err)
    }
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


app.get("/order/user/:id",(req,res)=>{
  let order=[]
// const sql="select o.id, u.name, u.phone, u.address, o.price, o.status, o.last_updated_at FROM users as u JOIN orders AS o ON o.user_id = u.id"
  const sql="select * from orders where user_id=?"
	// const sql="select o.id,u.id AS user_id, u.name, u.phone, u.address, o.price, o.status, o.last_updated_at FROM users as u JOIN orders AS o where user_id=?"
	
  con.query(sql,req.params.id,async (err,result,fields)=>{ 
    if (err){
      console.log("ERORR GETTING ALL ORDERS")
    }else if (result.length>0){

      order=result
      let len=result.length
      
      for (let i=0;i<len;i++){
          con.query("select * from order_items WHERE order_id=?",result[i].id,(err,result,fields)=>{
            if (err){
              console.log("ERORR from shopping_cart")
              res.send(err)
            }

            let items=result

            let newlen=result.length

            for(let j=0;j<newlen;j++){
              con.query("select * from products WHERE id=?",result[j].product_id,async (err,result,fields)=>{
                if (err){
                  res.send(err)
                }
                items[j]['products']=result[0]
                order[i]['item']= items

                if(i === len-1 && j===newlen-1){
                  console.log("-------------------")
                  res.send(order)
                }
              })
              }

          })
      }
    } else {
      res.send([])
    }
    
  })
});

app.post("/order",(req,res)=>{
  let price=0
  for (let i=0;i<req.body.cart.length;i++){
    price=price+req.body.cart[i].quantity*req.body.cart[i].product.price
  }
  const values=[[req.body.user_id,price,"In Progress",req.body.date]];

  con.query("insert into orders(user_id,price,status,last_updated_at) values ?",[values],(err,result,fields)=>{
    if (err){
      console.log("ERORR INSERTING INTO ORDERS TABLE")
      res.send(err)
    }
    let order_id=result.insertId  
    for (let i=0;i<req.body.cart.length;i++){
    let values=[[req.body.cart[i].product_id ,order_id ,req.body.cart[i].quantity ,req.body.cart[i].product.price ,req.body.date]];
      // console.log(values)
      con.query("insert into order_items (product_id,order_id,quantity,price,added_at) values ?",[values],(err,result,fields)=>{
        if (err){
          console.log("ERORR INSERTING INTO ORDERS TABLE")
          res.send(err)
        } 
        if(i === req.body.cart.length-1){ 
          res.send(result)
        }
      })  
    }

    for (let i=0;i<req.body.cart.length;i++){
      con.query("delete from shopping_cart where id=?",req.body.cart[i].id,(err,result,fields)=>{
        if (err){
          console.log("ERORR INSERTING INTO ORDERS TABLE")
          res.send(err)
        } 
        res.send(result)
      })
    }

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
  con.query("select * from shopping_cart WHERE user_id=?",req.params.id,(err,result,fields)=>{
    if (err){
      console.log("ERORR GETTING ALL ORDERS")
      res.send(err)
    } 

    if(result.length != 0){
      let obj={}
      let len=result.length-1
      obj=result
  
      for(let i=0;i<=len;i++){
        con.query("select * from products where id=?",result[i].product_id,(err,result,fields)=>{
          console.log(result)
          obj[i].product=result[0]
          if (i == len){
            res.send(obj) 
          } 
        })
      }
    } else  {
      res.send([])
    }
    

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
  let sql=''
  if (req.body.quantity === 0){
    sql= "delete from shopping_cart where user_id=? and product_id=?"
  } else {
    sql= "UPDATE shopping_cart set quantity=? where user_id=? AND product_id=?"
  }

  con.query(sql,[req.body.quantity,req.body.user_id,req.body.product_id],(err,result,fields)=>{
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
