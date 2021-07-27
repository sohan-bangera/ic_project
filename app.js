const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const mysql = require('mysql');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + "/public"));
app.set('views', path.join(__dirname +"/public"));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+"/PUBLIC/aa.html"))
})

app.get("/signup",(req,res) => {
res.sendFile(path.join(__dirname+"/PUBLIC/signup.html"))
})

app.post('/signup', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    
    let data = {}
  if (password === confirmpassword) {
    data = {
      name: name,
      phonenumber: phonenumber,
      email: email,
      password: password
    }
    console.log(data);
    // connect to database
    let connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "ic"
    });

    connection.connect();
    console.warn("db connected")

    connection.query("INSERT INTO users SET ? ", data,
      function (error, result, fields) {
        if (error) throw error;
        console.warn("insertion successful");
        res.sendFile(path.join(__dirname+"/PUBLIC/login.html"))
      });

    connection.end();
    res.sendFile(path.join(__dirname+"/PUBLIC/login.html"))

  } else {
    res.sendFile(path.join(__dirname+"/PUBLIC/signup.html"))
    console.log('Error');
  }
})
    
   
      
  app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname+"/PUBLIC/login.html"))  
  })
  app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "ic"
    });
    connection.connect();
    console.log("db connected");
  
    connection.query("SELECT email, password FROM users where email=?", email,
      function (error, result) {
        if (error) {
          throw error;
        } else {
          if (result.length == 0) {
  
            console.log('name not available');
            res.sendFile(path.join(__dirname+"/PUBLIC/signup.html"))
          } else if (result[0].password == password) {
            console.log("loging succesful");
            res.sendFile(path.join(__dirname+"/PUBLIC/aa.html"))
          } else {
            console.log('invalid email and password');
            res.sendFile(path.join(__dirname+"/PUBLIC/login.html"))
          }
        }
      });
    connection.end();
  })


  app.get("/apply",(req,res)=>{
    res.sendFile(path.join(__dirname+"/PUBLIC/apply.html"))  
  })
  app.post("/apply", (req, res) => {
    const name = req.body.name;
    const course = req.body.course; 
    const email = req.body.email;
    const age = req.body.age;
    let userData = {
      name:name,
      course:course,
      email:email,
      age:age
    }
    var connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "ic"
      });
      connection.connect();
      console.log("db connected");
      connection.query("INSERT INTO application SET ? ", userData,
      function (error, result, fields) {
        if (error) throw error;
        res.sendFile(path.join(__dirname+"/PUBLIC/Applisuccess.html"))
        console.warn("insertion successful");
      });

    connection.end();
    // res.sendFile(path.join(__dirname+"/PUBLIC/.html"))
    res.sendFile(path.join(__dirname+"/PUBLIC/Applisuccess.html"))

})
      
app.get("/admin", function (req, res) {
  //   res.sendFile(path.join(__dirname + "/admin.html"));
  // var mysql = require("mysql"); // npm i msql
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ic",
  });
  connection.connect();
  console.log("connected to db");
  //2
  connection.query("SELECT * FROM application", function (err, result) {
    if (err) throw err;
    res.render("admin", { bdata: result });
  });
  connection.end();
});


// delete start
app.get("/users/delete/(:id)", function (req, res) {
  var did = req.params.id; // id read from the front end

  var mysql = require("mysql"); //connect to database
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ic",
  });
  connection.connect();
  var sql = "DELETE FROM application WHERE id=?";
  connection.query(sql, did, function (err, result) {
    console.log("deleted record");
  });
  connection.end();
  res.redirect(req.get("referer"));
});
// delete end

//accept or reject
app.get("/users/edit/(:id)/(:s)", function (req, res) {
  var id = req.params.id; // get the id from FE
  var sel = req.params.s;

  if (sel == 0) {
    sel = 1;
  } else {
    sel = 0;
  }
  // connect to db
  // var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ic",
  });
  connection.connect();
  // query to accept or reject

  let udata = [sel, id];
  connection.query(
    "UPDATE application SET Status=? WHERE id=?",
    udata,
    function (err, res) {
      if (err) throw err;
      console.log("updated");
    }
  );
  connection.end();
  res.redirect(req.get("referer"));
});

app.get("/Status", function (req, res) {
  //   res.sendFile(path.join(__dirname + "/admin.html"));
   
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "ic",
    });
    connection.connect();
    console.log("connected to db");
    //2
    connection.query("SELECT * FROM application", function (err, result) {
      if (err) throw err;
      res.render("Status", { bdata: result });
    });
    connection.end();
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})