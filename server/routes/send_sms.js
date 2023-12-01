//giripadma7@gmail.com - +12706067853
// const accountSid = 'ACe5c938b3deb6e1452de514b4efc5df82';
// const authToken = '87e8c347b942fb6c756d0c73f3a0b188';

//yakeshgpry6@gmail.com - +12706067853
const accountSid = 'AC5cba7cc19fdb188143bcf106e285ecc5';
const authToken = 'da46d77d2bc5ba7be33c852f51e45224';


const client = require('twilio')(accountSid, authToken);
         
function sendScheduledMessage(ApplicantId,vaccine, toPhoneNumber, date,schedule) { //(ApplicantId,vaccine,toPhoneNumber)
  //(sendDatetimex, body, toPhoneNumber) 
  console.log(ApplicantId,vaccine,toPhoneNumber);
  var sec;
  var body = "Application ID : " + ApplicantId +" நீங்கள் வெற்றிகரமாக தடுப்பூசி போட்டுவிட்டீர்கள். உங்களது அடுத்த தடுப்பூசிக்கான தேதி - ";

  const currentDate = date;//new Date();
  const futureDate = new Date(currentDate);

  if(vaccine == 1){
    sec = 6 * 7 * 24 * 60 * 60;
    futureDate.setDate(futureDate.getDate() + (6 * 7));
  }
  else if(vaccine == 2){
    sec = 4 * 7 * 24 * 60 * 60;
    futureDate.setDate(futureDate.getDate() + (4 * 7));
  }
  else if(vaccine == 3){
    sec = 4 * 7 * 24 * 60 * 60;
    futureDate.setDate(futureDate.getDate() + (4 * 7));
  }
  else if(vaccine == 4){
    sec = 22 * 7 * 24 * 60 * 60;
    futureDate.setDate(futureDate.getDate() + (26 * 7));
  }
  else if(vaccine == 5){
    sec = 16 * 7 * 24 * 60 * 60;
    futureDate.setMonth(futureDate.getMonth() + 4);
  }
  else if(vaccine == 6){
    sec = 144 * 7 * 24 * 60 * 60;
    futureDate.setMonth(futureDate.getMonth() + 36);
  }
  else if(vaccine == 7){
    sec = 192 * 7 * 24 * 60 * 60;
    futureDate.setMonth(futureDate.getMonth() + 48);
  }
  else if(vaccine == 7){
    sec = 288 * 7 * 24 * 60 * 60;
    futureDate.setMonth(futureDate.getMonth() + 72);
  }
  else{
    sec = 120;
  }

  console.log(futureDate);
  const year = futureDate.getFullYear();
  const month = futureDate.getMonth() + 1; // Note that month starts at 0
  const day = futureDate.getDate();
  const formattedDate = `${day}/${month}/${year}`;
  console.log(formattedDate);
  body = body + formattedDate + ". நன்றி!";
  console.log(body);

  if(schedule){
    body = "Application ID : " + ApplicantId + " உங்களது அடுத்த தடுப்பூசிக்கு 2 நாட்கள் மட்டுமே உள்ளன." + formattedDate + ". நன்றி!";
    sec = 120;
  }
  else{
    sec = 5;
  }
  // // Set the date and time to send the message (in YYYY-MM-DD HH:MM format)
  // var sendDatetime = new Date("2023-04-21 14:30");
  // const sendDatetimeStr = sendDatetime.toISOString().slice(0, 16).replace('T', ' ');

  // // Calculate the number of seconds until the sendDatetime
  // const secondsUntilSend = (sendDatetime - new Date()) / 1000;
  // console.log(secondsUntilSend);
  
  
  // Wait until the sendDatetime 
  setTimeout(() => {
    client.messages.create({
      body:body, 
      from: '+12706067853',
      to: toPhoneNumber,
    }).then((message) => console.log(`Message sent: ${message.sid}`));
  }, sec * 1000);
  
}

module.exports = {
  sendScheduledMessage: sendScheduledMessage
};
                
