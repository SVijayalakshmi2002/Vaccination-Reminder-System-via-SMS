const mysql = require("mysql");
const { sendScheduledMessage } = require('../routes/send_sms');
var num;

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

exports.register = (req, res) => {
  console.log(res);
  console.log(req.body);
  console.log(req.body.name);
  let arr = [];
  arr.push(req.body.name);
  arr.push(req.body.gender);
  arr.push(req.body.FatherName);
  arr.push(req.body.MotherName);
  arr.push(req.body.phone);
  arr.push(req.body.email);
  console.log(arr);
  var sql =
    "Insert into userdetails (Name,Gender,Father_Name,Mother_Name,Phone_Number,Email) Values (?)";
  db.query(sql, [arr], function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result.affectedRows + " record(s) inserted");
    
  });
  var query = "SELECT Applicant_id FROM userdetails ORDER BY Applicant_id DESC LIMIT 1" ;
  db.query(query, req.body.APPLICATIONID, (err, data) => {
    if (err) {
      throw err;
    }
    else{
      console.log(data);
      // data.push("You are successfully registered");
      // console.log(data);
      var appId = data[0].Applicant_id;
      res.render("thanku",{
                  title: "Thank You 😉",
                  id: appId + 1,
                  msg:"You are successfully registered",
          });
    }
  });


};
exports.login = async (req, res) => {
  //   console.log(res);
  console.log(req.body);
  console.log(req.body.APPLICATIONID);
  console.log("INSIDE CONTROL>JS INSIDE LOGIN");

  var query1 = "SELECT * FROM userdetails WHERE Applicant_id = ? OR Phone_Number = ?";
  db.query(query1, [req.body.APPLICATIONID, req.body.MobileNumber], (err, data1) => {
    if (err) {
      throw err;
    }
    else if (data1.length === 0){
      console.log('There is no Apllicant id');
      console.log(data1);
      res.render("thanku",{
        title: "Thank You 😉",
        id: req.body.APPLICATIONID,
        msg:"Your Apllication id is " + req.body.APPLICATIONID + " not valid",
      });
    }
    else{
      var query = "SELECT userdetails.Applicant_id, userdetails.Name, userdetails.Father_Name, userdetails.Mother_Name, DATE_FORMAT(vaccinedetails.date_of_vaccination, '%d/%m/%Y') AS formatted_date, vaccinedetails.vaccine, vaccinationname.vaccine_names AS Name_of_Vaccination FROM userdetails INNER JOIN vaccinedetails ON userdetails.Applicant_id = vaccinedetails.Applicant_id INNER JOIN vaccinationname ON vaccinedetails.vaccine = vaccinationname.vaccine WHERE userdetails.Applicant_id = ? OR userdetails.Phone_Number=?";
      console.log(query);

      db.query(query, [req.body.APPLICATIONID, req.body.MobileNumber], (err, data) => {
        if (err) {
          throw err;
        } 
        else if (data.length === 0){
          res.render("display", {
            title: "Vaccination Details",
            action: "list",
            sampleData: data1,//data1[0],
            appId: req.body.APPLICATIONID,
          });
        }
        else {
          console.log('data',data);

          res.render("display", {
            title: "Vaccination Details",
            action: "list",
            sampleData: data,//data[0],
            appId: req.body.APPLICATIONID,
          });
        }
      });
    };
  });
}

exports.vaccination_detail = (req, res) => {
  console.log(req.body.date);
  console.log(req.body.vaccine);
  let text = req.body.vaccine;
  let ar = text.split("@");
  console.log(ar[0]); //vaccine
  console.log("INSIDE CONTROL>JS INSIDE VACCINATION_DETAIL");
  let arr = [];
  arr.push(ar[1]); 
  arr.push(req.body.date);
  arr.push(ar[0]);
//arr looks like arr = [Id,date,vaccine];

  var numQuery = "SELECT Phone_Number FROM userdetails WHERE Applicant_id = ?";
  db.query(numQuery, arr[0], (err, data) => {
    if (err) {
      throw err;
    } else{
      console.log(data);
      num = '+91' + String(data[0].Phone_Number);
      console.log(num);
    }
  });

  var appId = ar[1];
  var query = "SELECT * FROM vaccinedetails WHERE Applicant_id = ?";
  db.query(query, appId, (err, data) => {
    if (err) {
      throw err;
    } else if (data.length === 0) {
      var sql =
        "Insert into vaccinedetails (Applicant_id,date_of_vaccination,vaccine) Values (?)";
      db.query(sql, [arr], function (err, result) {
        if (err) {
          throw err;
        }
        console.log(result.affectedRows + " record(s) inserted");
        console.log(result);

        console.log('Before sending scheduled message');
        // sendScheduledMessage(arr[0],arr[2],num,arr[1],false);
        sendScheduledMessage(arr[0],arr[2],num,arr[1],true);
        console.log(arr[0],arr[2],num);
        // sendScheduledMessage("2023-04-17 08:30", "நீங்கள் வெற்றிகரமாக தடுப்பூசி போட்டீர்கள்", "+918056480212");
        console.log('After sending scheduled message');

        res.render("thanku",{
          title: "Thank You 😉",
          id:arr[0],
          msg:"Updated Successfully",
        });
      });
    } else {
      var query = "SELECT * FROM vaccinedetails WHERE Applicant_id = ? AND vaccine = ?";
      db.query(query, [arr[0], arr[2]], (err, result) => {
        if (err) {
          throw err;
        } else if (result.length === 0) {
          var sql =
            "Insert into vaccinedetails (Applicant_id,date_of_vaccination,vaccine) Values (?)";
          db.query(sql, [arr], function (err, result) {
            if (err) {
              throw err;
            }
            console.log(result.affectedRows + " record(s) inserted");
            console.log(result);
            
            console.log('Before sending scheduled message');
            // sendScheduledMessage(arr[0],arr[2],num,arr[1],false);
            sendScheduledMessage(arr[0],arr[2],num,arr[1],true);
            console.log(arr[0],arr[2],num);
            // sendScheduledMessage("2023-04-17 08:30", "நீங்கள் வெற்றிகரமாக தடுப்பூசி போட்டீர்கள்", "+918056480212");
            console.log('After sending scheduled message');

            res.render("thanku",{
              title: "Thank You 😉",
              id:arr[0],
              msg:"Updated Successfully",
            });
          });
        } else {
          console.log(result.affectedRows + " already Exist");
          res.render("thanku",{
            title: "Thank You 😉",
            id:arr[0],
            msg:"Already Exist",
          });
        }
      });

      // var query =
      //   "UPDATE vaccinedetails SET date_of_vaccination = ?, vaccine = ? WHERE Applicant_id = ?";
      // console.log(arr);

      // db.query(query, [arr[1], arr[2], arr[0]], (err, result) => {
      //   if (err) {
      //     throw err;
      //   } else {
      //     console.log(result.affectedRows + " row(s) updated");
      //     res.render("thanku",{
      //       title: "Thank You 😉",
      //       id:arr[0],
      //       msg:"Updated Successfully",
      //     });
      //   }
      // });
    }
  });
};

exports.report = (req, res) => {
  const reportData = req.body;
  console.log(reportData);
  const size = Object.keys(reportData).length;
  console.log(`Size of report data: ${size}`);

  // if(size == 1){ 
  //  var query = "SELECT userdetails.Applicant_id, userdetails.Name, userdetails.Gender, userdetails.Father_Name, userdetails.Mother_Name, DATE_FORMAT(vaccinedetails.date_of_vaccination, '%d/%m/%Y') AS formatted_date,vaccinedetails.vaccine FROM userdetails INNER JOIN vaccinedetails ON userdetails.Applicant_id = vaccinedetails.Applicant_id WHERE vaccinedetails.date_of_vaccination = ?";
  //   db.query(query, req.body.date, (err, data) => {
  //     if (err) {
  //       throw err;
  //     } 
  //     else{
  //       console.log(data.length);
  //       console.log(data);
  //       res.render("display", {
  //         title: "Report",
  //         action: "list",
  //         sampleData: data,
  //         //appId: req.body.APPLICATIONID,
  //       });
  //     }
  //   });
  // } else{
    var month = req.body.month;
    var year = req.body.year;
    var vaccine = req.body.vaccine;
    var date = req.body.date;
    console.log(year);
    if(month!='' && year!='' && vaccine!='' && date==''){
      var query = "SELECT userdetails.Applicant_id, userdetails.Name, userdetails.Gender, userdetails.Father_Name, userdetails.Mother_Name, DATE_FORMAT(vaccinedetails.date_of_vaccination, '%d/%m/%Y') AS formatted_date, vaccinedetails.vaccine FROM userdetails INNER JOIN vaccinedetails ON userdetails.Applicant_id = vaccinedetails.Applicant_id WHERE MONTH(vaccinedetails.date_of_vaccination) = ? AND YEAR(vaccinedetails.date_of_vaccination) = ? AND vaccinedetails.vaccine = ?";    
      db.query(query, [month, year,vaccine], (err, data) => {
        if (err) {
          throw err;
        } 
        else{
          console.log(data.length);
          console.log(data);
          res.render("table", {
            title: "Report",
            action: "list",
            sampleData: data,
          });
        }
      });
    } else if(month!='' && year!='' && vaccine=='' && date==''){
      var query = "SELECT userdetails.Applicant_id, userdetails.Name, userdetails.Gender, userdetails.Father_Name, userdetails.Mother_Name, DATE_FORMAT(vaccinedetails.date_of_vaccination, '%d/%m/%Y') AS formatted_date, vaccinedetails.vaccine FROM userdetails INNER JOIN vaccinedetails ON userdetails.Applicant_id = vaccinedetails.Applicant_id WHERE MONTH(vaccinedetails.date_of_vaccination) = ? AND YEAR(vaccinedetails.date_of_vaccination) = ?";    
      db.query(query, [month, year], (err, data) => {
        if (err) {
          throw err;
        } 
        else{
          console.log(data.length);
          console.log(data);
          res.render("table", {
            title: "Report",
            action: "list",
            sampleData: data,
          });
        }
      });
    }else if(year!='' && vaccine!='' && month=='' && date==''){
      var query = "SELECT userdetails.Applicant_id, userdetails.Name, userdetails.Gender, userdetails.Father_Name, userdetails.Mother_Name, DATE_FORMAT(vaccinedetails.date_of_vaccination, '%d/%m/%Y') AS formatted_date, vaccinedetails.vaccine FROM userdetails INNER JOIN vaccinedetails ON userdetails.Applicant_id = vaccinedetails.Applicant_id WHERE YEAR(vaccinedetails.date_of_vaccination) = ? AND vaccinedetails.vaccine = ?";    
      db.query(query, [year,vaccine], (err, data) => {
        if (err) {
          throw err;
        } 
        else{
          console.log(data.length);
          console.log(data);
          res.render("table", {
            title: "Report",
            action: "list",
            sampleData: data,
          });
        }
      });
    } else if(date!='' && vaccine!='' && month=='' && year==''){
      var query = "SELECT userdetails.Applicant_id, userdetails.Name, userdetails.Gender, userdetails.Father_Name, userdetails.Mother_Name, DATE_FORMAT(vaccinedetails.date_of_vaccination, '%d/%m/%Y') AS formatted_date, vaccinedetails.vaccine FROM userdetails INNER JOIN vaccinedetails ON userdetails.Applicant_id = vaccinedetails.Applicant_id WHERE vaccinedetails.date_of_vaccination = ? AND vaccinedetails.vaccine = ?";    
      db.query(query, [date,vaccine], (err, data) => {
        if (err) {
          throw err;
        } 
        else{
          console.log(data.length);
          console.log(data);
          res.render("table", {
            title: "Report",
            action: "list",
            sampleData: data,
          });
        }
      });
    } else if(year!='' && vaccine=='' && month=='' && date==''){
      var query = "SELECT userdetails.Applicant_id, userdetails.Name, userdetails.Gender, userdetails.Father_Name, userdetails.Mother_Name, DATE_FORMAT(vaccinedetails.date_of_vaccination, '%d/%m/%Y') AS formatted_date, vaccinedetails.vaccine FROM userdetails INNER JOIN vaccinedetails ON userdetails.Applicant_id = vaccinedetails.Applicant_id WHERE YEAR(vaccinedetails.date_of_vaccination) = ?";    
      db.query(query, year, (err, data) => {
        if (err) {
          throw err;
        } 
        else{
          console.log(data.length);
          console.log(data);
          res.render("table", {
            title: "Report",
            action: "list",
            sampleData: data,
          });
        }
      });
    } else if(date!='' && vaccine=='' && month=='' && year==''){
      var query = "SELECT userdetails.Applicant_id, userdetails.Name, userdetails.Gender, userdetails.Father_Name, userdetails.Mother_Name, DATE_FORMAT(vaccinedetails.date_of_vaccination, '%d/%m/%Y') AS formatted_date,vaccinedetails.vaccine FROM userdetails INNER JOIN vaccinedetails ON userdetails.Applicant_id = vaccinedetails.Applicant_id WHERE vaccinedetails.date_of_vaccination = ?";
      db.query(query, date, (err, data) => {
        if (err) {
          throw err;
        } 
        else{
          console.log(data.length);
          console.log(data);
          res.render("table", {
            title: "Report",
            action: "list",
            sampleData: data,
          });
        }
      });
    } else if(vaccine!='' && year=='' && month=='' && date==''){
      var query = "SELECT userdetails.Applicant_id, userdetails.Name, userdetails.Gender, userdetails.Father_Name, userdetails.Mother_Name, DATE_FORMAT(vaccinedetails.date_of_vaccination, '%d/%m/%Y') AS formatted_date, vaccinedetails.vaccine FROM userdetails INNER JOIN vaccinedetails ON userdetails.Applicant_id = vaccinedetails.Applicant_id WHERE vaccinedetails.vaccine = ?";    
      db.query(query, vaccine, (err, data) => {
        if (err) {
          throw err;
        } 
        else{
          console.log(data.length);
          console.log(data);
          res.render("table", {
            title: "Report",
            action: "list",
            sampleData: data,
          });
        }
      });
    } else if(year=='' && vaccine=='' && month=='' && date==''){
      var query = "SELECT userdetails.Applicant_id, userdetails.Name, userdetails.Gender, userdetails.Father_Name, userdetails.Mother_Name, DATE_FORMAT(vaccinedetails.date_of_vaccination, '%d/%m/%Y') AS formatted_date, vaccinedetails.vaccine FROM userdetails INNER JOIN vaccinedetails ON userdetails.Applicant_id = vaccinedetails.Applicant_id ";    
      db.query(query, [year,vaccine], (err, data) => {
        if (err) {
          throw err;
        } 
        else{
          console.log(data.length);
          console.log(data);
          res.render("table", {
            title: "Report",
            action: "list",
            sampleData: data,
          });
        }
      });
    }
    else{
      res.render("thanku",{
        title: "Report",
        //id:arr[0],
        msg:"Filter condition is not valid",
      });
    }
    
  }
    
// }

