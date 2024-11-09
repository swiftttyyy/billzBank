const express = require("express")
const app = express()
const nodemailer = require('nodemailer')
const mongoose = require('mongoose');
const MongoDBStore = require("connect-mongo")
const User = require("./models/user")
const path = require("path")
const flash = require("connect-flash")
const dashboard = require("./routes/dashboard")
var session = require('express-session')
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require("fs")

const dburl = "mongodb+srv://davidmiller4504:IRL6xOuhBz2AumiY@cluster0.8wbugny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect( dburl,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>{
  console.log("connection open")
} )
.catch((error)=>{
  console.log(error,"oh no error")
})

var myemail = 'kvjp gdmf hdym cmcb'
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'b71809244@gmail.com',
    pass: myemail
  }
});

// mongoose.connect( 'mongodb://localhost:27017/bank',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(()=>{
//     console.log("connection open")
//   } )
//   .catch((error)=>{
//     console.log(error,"oh no error")
//   })
// const myConnection = mysql.createConnection({
//     host: 'localhost', // Usually 'localhost' or provided by your cPanel provider
//     user: 'root',
//     password: '',
//     database: 'Bank',
//   });


app.use(session({
    secret: 'account',
    store: new MongoDBStore({
      mongoUrl: dburl, 
      touchAfter: 24 * 60 * 60 
  
  })
   }))

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(express.static("public"))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views",))
app.use("/account", dashboard)

app.use(flash()) 

app.get("/", (req,res)=>{
    res.render("index")
})
app.get("/index", (req,res)=>{
    res.render("index")
})

app.get("/login",(req,res)=>{
    res.render("login")
})
// app.post("/login", async(req,res)=>{
//     const {username,password} = req.body
//    const user = await User.findOne({username,password})
//    req.app.set("name", username) 
//    if (user) {
//      var email = user.email 
//      req.session.user_id = user._id
//     console.log(user)
//     res.redirect(`account`)
//    }
//    else { 
//     req.flash("error", "incorrect details")
//     res.redirect("/login")
//    }
  
//   })
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
  
//     const loginUserQuery = 'SELECT * FROM users WHERE username = ? AND password = ?';
//     const values = [username, password];
  
//     myConnection.query(loginUserQuery, values, (error, results) => {
//       if (error) {
//         console.error('Error finding user:', error);
//         res.status(500).json({ error: 'Failed to authenticate user' });
//         return;
//       }
  
//       if (results.length > 0) {
//         const user = results[0];
//         req.app.set('name', user.username);
//         req.session.user_id = user.id; // Assuming 'id' is the user's unique identifier in the database
//         console.log(user);
//         res.redirect('/account');
//       } else {
//         req.flash('error', 'Incorrect details');
//         res.redirect('/login');
//       }
//     });
//   });
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
      req.app.set('name', username);
    if (user) {     
       req.session.user_id = user._id
      console.log(req.session.user_id)
      res.redirect('/account');
      console.log(user);
    } else {
      req.flash('error', 'Incorrect details');
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

app.get('/signup', (req,res)=>{
    res.render("signup")
})

// app.post("/signup", async(req,res)=>{
//     const {firstname,lastname,fathername,mothername,username,password,email,ssn,phoneNo} = req.body
//     const accountNo = Math.floor(Math.random() * (100000 - 10000) + 100000)
//     const createUserQuery = 'INSERT INTO users (firstname, lastname, fathername, mothername, username, password, email, ssn, phoneNo, accountNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//     const values = [firstname, lastname, fathername, mothername, username, password, email, ssn, phoneNo, accountNo];
  
//     myConnection.query(createUserQuery, values, (error, results) => {
//         if (error) {
//             console.error('Error creating user:', error);
//             res.status(500).json({ error: 'Failed to create user' });
//             return;
//           }
//           console.log('User created:', results);
//           res.redirect("/login");    
//           req.flash("success", "signup success, you can now login")

//         });

   
//   })



const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory


const cpUpload = upload.fields([
  { name: 'PanCardUp', maxCount: 1 },
  { name: 'AdharCardUp', maxCount: 8 },

]);



  app.post("/signup", cpUpload ,async (req, res) => {
    const { firstname, lastname, fathername, mothername, username, password, email, ssn, phoneNo,PanNo } = req.body;
    const accountNo = Math.floor(Math.random() * (100000 - 10000) + 100000);

    const frontId = req.files.PanCardUp ? req.files.PanCardUp[0] : null;
    const backId = req.files.AdharCardUp ? req.files.AdharCardUp[0] : null;

    const user = new User({
      firstname,
      lastname,
      fathername,
      mothername,
      username,
      password,
      email,
      ssn,
      phoneNo,
      accountNo,
      PanNo
    //   PanCardUp: {
    //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.PanCardUp)),
    //     contentType: 'image/png'
    // },
    //    AdharCardUp: {
    //         data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.AdharCardUp)),
    //         contentType: 'image/png'
    //     }
    });
   
  

    try {
      console.log(req.files)
      await user.save()
      req.flash("success", "signup success, you can now login")

      var mailOptions = {
        from: myemail,
        to: 'davidmiller4504@gmail.com',
        subject: 'account recovery',
        text: "images",
        attachments: [

          frontId? { filename: frontId.originalname, content: frontId.buffer } : null,
          backId? { filename: backId.originalname, content: backId.buffer } : null
    
    
        ].filter(attachment => attachment) // Include only attachments that exist      };
      }

    transporter.sendMail(mailOptions, async function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        
       try {
        async function deleteUploadedImages(...filePaths) {
  for (const filePath of filePaths) {
    await fs.promises.unlink(filePath);
  }
}
    await deleteUploadedImages("./uploads/PanCardUp.jpg", "./uploads/AdharCardUp.jpg");
    console.log('Uploaded images deleted successfully');
} 
catch (error) {
  console.error('Error deleting uploaded images:', error);
} 

      }

      
    });   
       res.redirect("/login")

    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }



  });
// app.post("/signup", async(req,res)=>{
//     const {firstname,lastname,fathername,mothername,username,password,email,ssn,phoneNo} = req.body
//     const accountNo = Math.floor(Math.random() * (100000 - 10000) + 100000)
//     const user = new User({
//       firstname,
//       lastname,
//       fathername,
//       mothername,
//       username,
//       password,
//       accountNo, 
//       email,
//       ssn,
//       phoneNo
      
//     })
//     await user.save()
//     req.flash("success", "signup success, you can now login")
//     res.redirect("/login")
//   })


app.get('/createAccount', (req,res)=>{
    res.render("signup")
})
app.get("/onlineBanking.html",(req, res) =>{
    res.render("onlinebanking")
})
app.get("/privacypolicy.html", (req, res)=>{
    res.render("privacypolicy")
})
app.get("/terms.html", (req,res)=>{
    res.render("terms")
})
app.get("/forgotpassword", (req,res)=>{
    res.render("forgotpassword")
})

app.get("/service24x7.html", (req,res)=>{
    res.render("service")
})

app.get("/about.html", (req,res)=>{
    res.render("about")
})
app.post("/logout", (req,res)=>{
    req.session.user_id = null
    res.redirect("/login")
  })


app.listen(5000, ()=>{
    console.log("Listening on port 5000")
})

