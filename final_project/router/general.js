const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  username = req.body.username;
  password = req.body.password;
  console.log("username " + username + "password " + password);
  if (!username || !password){
      res.status(400).json({"message": "username or password not entered"});
  }
  if (doesExist(username)){
    res.status(409).json({"message": "username exists"});
  }
  else{
    users.push({"username":username,"password":password});
    return res.status(200).json({"message": "User successfully added"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    return res.send(JSON.stringify(books));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = parseInt(req.params.isbn);
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const author = req.params.author;
  let authors = [];
  for (var isbn in books){
      if (books[isbn].author == author){
        authors.push(books[isbn]);
      }
  }
  return res.send(JSON.stringify(authors));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const title = req.params.title;
  let titles = [];
  for (var isbn in books){
      if (books[isbn].title == title){
        titles.push(books[isbn]);
      }
  }
  return res.send(JSON.stringify(titles));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = parseInt(req.params.isbn);
  return res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
