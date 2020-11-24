const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const exphbs = require('express-handlebars')
const nodemailer = require('nodemailer')
app.use(express.static("public"))

//viewEngine setup
app.set("view engine", "ejs")
// app.engine('handlebars', exphbs())
// app.set("view engine", "handlebars")

//body-parser middleware
app.use(bodyparser.urlencoded({extended : false}))
app.use(bodyparser.json())

//static folder
app.use(express.static(__dirname + 'public'))

const sendmsg = 'Send message here'
const msgsent = 'Your message has been sent!'
app.get("/", (req, res)=>{
    res.render("home" ,{msg : sendmsg});
})
app.get("/send", (req, res)=>{
  res.render("home" ,{msg : sendmsg});
})

app.post('/send', (req, res) => {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'anuragpreetam.contact@gmail.com', // generated ethereal user
          pass: 'eycevxhxaberbfoj'  // generated ethereal password(app password)
      },
      tls:{
        rejectUnauthorized:false
      }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"My Portfolio Website" <anuragpreetam.contact@gmail.com>', // sender address
        to: 'ponnadaanurag@gmail.com', // list of receivers
        subject: 'Contact Request from' + ' ' + req.body.name + ' ' + 'of' + ' ' + req.body.company, // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('home' , {msg : msgsent});
    });
    });

//port number on which server runs
const port = 5000;
app.listen(port, (req, res)=>{
    console.log("Server has started...");
})
