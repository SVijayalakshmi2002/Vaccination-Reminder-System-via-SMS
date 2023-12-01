const express = require("express");
const exphbs = require("express-handlebars");
const bodyparser = require("body-parser");
const router = express.Router();


const doenv = require("dotenv");

 require('dotenv').config();
const mysql = require("mysql");

const app = express();
const port = process.env.port || 3000;


app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(express.static("public")); 

//templete engine


const handlebars = exphbs.create({extname:".hbs"});
app.engine('hbs',handlebars.engine);
app.set("view engine","hbs");

//mysql
doenv.config({
    path:"./.env",
});

var connection  = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password:  "password",
    database: "vaccine_db",
    port: "3306"
  })

connection.connect((err) =>{
    if(err){
        throw err
    } else{
        console.log("connected")
    }
});


// connection.query('CREATE TABLE userdetails(Applicant_id INT AUTO_INCREMENT PRIMARY KEY, Name VARCHAR(255) NOT NULL, Gender VARCHAR(20), Father_Name VARCHAR(255) NOT NULL, Mother_Name VARCHAR(255), Phone_Number VARCHAR(20) NOT NULL, Email VARCHAR(50))',(err,rows) =>{
//     if(err){
//         throw err
//     } else{
//         console.log("Data Sent")
//         console.log(rows)
//     }
// })

// To create vaccinedetails

// 1. use vaccine_db;

// 2. CREATE TABLE vaccinedetails (
//   Applicant_id INT ,
//   date_of_vaccination DATE,
//   vaccine INT,
//   FOREIGN KEY (Applicant_id) REFERENCES userdetails(Applicant_id)
// );




app.get('/name_of_vaccines', function(req, res) {
  res.render('name_of_vaccines');
});









app.use("/",require("./server/routes/pages"));
app.use("/users", require("./server/controllers/users"));


//listen port
app.listen(port,() => {
    console.log('Listening Port: http://localhost:'+port)
});

module.exports = connection;