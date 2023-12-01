const express = require("express");
const router = express.Router();
//const database = require('C:\\Users\\Yakesh G\\Downloads\\vaccination\\vaccination\\app.js');
const user = require("../controllers/users");

router.get('/',(req,res) => {
    res.render("home");
});

router.get('/register',(req,res) => {
    console.log("pages.js");
    res.render("register");
});

router.get('/login',(req,res) => {
    res.render("login");
});

router.get('/display',(req,res) => {
    res.render("display");
});

// router.get('/vaccination_detail',(req,res) => {
//     res.render("vaccination_detail");
// });

router.get('/users/vaccination_detail/:id', (req, res) => {
    const id = req.params.id;
    console.log("Application ID is : " + id);
    res.render('vaccination_detail', {id: id});
  });

  router.get("/report", (req, res) => {
    res.render("report")
    // res.send("<h1>About Us</h1><p>Welcome to our website!</p>");
  });



// router.get('/login', (req, res, next) => {
//     console.log(req.body);
//     var query = "SELECT * FROM userdetails WHERE Applicant_id = req.body.applic";
//     database.query(query,(err,data) => {
//         if(err){
//             throw err
//         }
//         else{
//             res.render('display', {title:'Vaccination Details', action:'list',sampleData:data});
//         }
//     })
// })


// router.get('/login', function(req,res){
//     console.debug(req.body.Applicant_id);
//   });

// const sendScheduledMessage = require('./send_sms');
// router.post('/send-scheduled-message', (req, res) => {
//     const sendDatetime = new Date(req.body.sendDatetime);//new Date('2023-04-15 10:00')
//     const body = req.body.body;
//     const toPhoneNumber = req.body.toPhoneNumber;
  
//     sendScheduledMessage(sendDatetime, body, toPhoneNumber);
  
//     res.send('Message scheduled successfully');
//   });


module.exports = router;