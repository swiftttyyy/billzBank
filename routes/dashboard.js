const express = require("express")
const router = express.Router()
const User = require("../models/user")

// const myConnection = mysql.createConnection({
//     host: 'localhost', // Usually 'localhost' or provided by your cPanel provider
//     user: 'root',
//     password: '',
//     database: 'Bank',
//   });
router.use(async (req, res, next) => {
  const userId = req.session.user_id;

  if (!userId) {
    // If user is not authenticated, redirect to the root
    res.redirect("/");
  }
  else {
    // Proceed to the next middleware
    next();
  }

});

router.get("/", async(req,res)=>{
    let name = res.app.get("name") 
    const user = await User.findOne({username:name}) 
    res.render("dashboard",{useraccount : user})
})
// router.get("/", (req, res) => {
//     const username = res.app.get("name"); // Assuming 'name' stores the username
  
//     const getUserQuery = 'SELECT * FROM users WHERE username = ?';
//     const values = [username];
  
//     myConnection.query(getUserQuery, values, (error, results) => {
//       if (error) {
//         console.error('Error finding user:', error);
//         res.status(500).json({ error: 'Failed to retrieve user details' });
//         return;
//       }
  
//       if (results.length > 0) {
//         const user = results[0];
//         res.render('dashboard', { useraccount: user });
//       } else {
//         // Handle case where user is not found
//         res.status(404).send('User not found');
//       }
//     });
//   });

router.get("/Transfer", async (req,res)=>{
    let name = res.app.get("name") 
    const user = await User.findOne({username:name})
    res.render("transfer",{useraccount : user})
})
router.get("/domestic", (req,res)=>{
    res.render("domestic")
})
router.get("/international", (req,res)=>{
    res.render("international")
})
router.get("/saving", (req,res)=>{
    res.render("saving")
})
router.get("/profile", async(req,res)=>{
      let name = res.app.get("name") 
    const user = await User.findOne({username:name})
    res.render("profile",{useraccount : user})
})



// router.get("/profile", (req, res) => {
//     const username = res.app.get("name"); // Assuming 'name' stores the username
  
//     const getUserQuery = 'SELECT * FROM users WHERE username = ?';
//     const values = [username];
  
//     myConnection.query(getUserQuery, values, (error, results) => {
//       if (error) {
//         console.error('Error finding user:', error);
//         res.status(500).json({ error: 'Failed to retrieve user details' });
//         return;
//       }
  
//       if (results.length > 0) {
//         const user = results[0];
//         res.render('profile', { useraccount: user });
//       } else {
//         // Handle case where user is not found
//         res.status(404).send('User not found');
//       }
//     });
//   });

router.get("/cards", async (req,res)=>{
    let name = res.app.get("name") 
    const user = await User.findOne({username:name})
    res.render("cards", {useraccount : user})
})
router.get("/T_history",async (req,res)=>{
    let name = res.app.get("name") 
    const user = await User.findOne({username:name})
    res.render("history",{useraccount : user})
})
router.get("/secureAccount", (req,res)=>{
    res.render("secureaccount")
})

module.exports = router