const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}


const authenticatedUser = (username,password)=>{
    console.log("user:: " + username + " pass:: " + password);
    let validusers = users.filter((user)=>{
      console.log("user: " + user.username + "pass: " + user.password);
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }
  

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;
  console.log("login username " + username + " password " + password);

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    console.log('accessToken: ' + accessToken + ' user: ' + username);
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
const isbn = req.params.isbn;
const custReview = req.query.review;
console.log('isbn ' + isbn + ' custReviw ' + custReview);
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            req.user = user;
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
 const revUsername = req.session.authorization["username"];
 if (books[isbn].reviews[revUsername]){
    console.log('Existing name, modify review')
    books[isbn].reviews[revUsername] = custReview;
    return res.status(201).json({"message": "Review for ISBN "+isbn + "updated", "Updated details": books[isbn] })

 }
 else{
    console.log('Add new')
    books[isbn].reviews[revUsername] = custReview;
    return res.status(201).json({"message": "Review for ISBN "+isbn + "added", "Updated details": books[isbn] })
 
}
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if(req.session.authorization) {
        token = req.session.authorization['accessToken'];
        jwt.verify(token, "access",(err,user)=>{
            if(!err){
                req.user = user;
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }
     const revUsername = req.session.authorization["username"];
     if (books[isbn].reviews[revUsername]){
        delete(books[isbn].reviews[revUsername]);
        return res.status(200).json({message: "Deleted Review "});
     }
     else{
        return res.status(200).json({message: "No review exists" });
     }
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;




