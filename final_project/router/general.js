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
  let authors = { "booksbyAuthor": []};
  for (var isbn in books){
      if (books[isbn].author == author){
        authors["booksbyAuthor"].push(books[isbn]);
      }
  }
  return res.send(JSON.stringify(authors,null,'\t'));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const title = req.params.title;
  let titles = {"booksbyTitle": []};
  for (var isbn in books){
      if (books[isbn].title == title){
        titles["booksbyTitle"].push(books[isbn]);
      }
  }
  return res.send(JSON.stringify(titles,null,'\t'));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = parseInt(req.params.isbn);
  return res.send(JSON.stringify(books[isbn].reviews));
});

public_users.get('/books', function(req, res){
    const get_books = new Promise((resolve,reject)=>{
        resolve(res.send(JSON.stringify(books,null,4)));
    })
    get_books.then(function () {
            return console.log("Task 10 get books");
        });
})

public_users.get('/book', async function(req, res){
    const get_books = function() {
        return new Promise((resolve,reject)=>{
        resolve(res.send(JSON.stringify(books,null,4)));
    })
    }
    await get_books();
    console.log("Task 10 get async books");
})

public_users.get('/books/isbn/:isbn', function(req, res){
    const isbn = req.params.isbn; 
    const get_isbn = new Promise((resolve,reject)=>{
        resolve(res.send(JSON.stringify(books[isbn],null,4)));
    })
    get_isbn.then(function () {
            return console.log("Task 11 books on isbn");
        });
})

public_users.get('/book/isbn/:isbn', async function(req, res){
    const isbn = req.params.isbn;
    const get_isbn = function() {
        return new Promise((resolve,reject)=>{
        resolve(res.send(JSON.stringify(books[isbn],null,4)));
    })
    }
    try {
        await get_isbn();
    }catch(err){
        console.log("Task 11 promise rejected")
    }
    console.log("Task 11 get async books on isbn");
})

public_users.get('/books/author/:author', function(req, res){
    const author = req.params.author; 
    for (var isbn in books){
        console.log(JSON.stringify(books[isbn]));
    }

    const get_author = new Promise((resolve,reject)=>{
        const authors = {"booksbyAuthor": []};
        let bookCount = 0;
        for (var isbn in books){
            if (books[isbn].author === author){
                authors['booksbyAuthor'].push(books[isbn]);
                bookCount++;
            }
         
        }
           
        if (bookCount){
            resolve(res.send(JSON.stringify(authors,null,4)));            
        }else{
            reject(res.send(JSON.stringify({"message":"No books for author"},null,4)));
        }
    })
    

    get_author.then(function () {
            return console.log("Task 12 books by author");
        }).catch(function() {
            return console.log("Task 12 books by author - rejected promise");
        })
})

public_users.get('/book/author/:author', async function(req, res){
    const author = req.params.author;
    const get_author = function() {
        return new Promise((resolve,reject)=>{
            const authors = {"booksbyAuthor": []};
            let bookCount = 0;
            for (var isbn in books){
                if (books[isbn].author === author){
                    authors['booksbyAuthor'].push(books[isbn]);
                    bookCount++;
                }
             
            }
               
            if (bookCount){
                resolve(res.send(JSON.stringify(authors,null,4)));            
            }else{
                reject(res.send(JSON.stringify({"message":"No books for author"},null,4)));
            };
    })
    }
    try{
        await get_author();
    }catch(err){
        console.log("Task 12 promise rejected");
    }
    console.log("Task 12 get async book details for author");
})


public_users.get('/books/title/:title', function(req, res){
    const title = req.params.title; 
    for (var isbn in books){
        console.log(JSON.stringify(books[isbn]));
    }

    const get_title = new Promise((resolve,reject)=>{
        const titles = {"booksbyTitle": []};
        let bookCount = 0;
        for (var isbn in books){
            if (books[isbn].title === title){
                titles['booksbyTitle'].push(books[isbn]);
                bookCount++;
            }
         
        }
           
        if (bookCount){
            resolve(res.send(JSON.stringify(titles,null,4)));            
        }else{
            reject(res.send(JSON.stringify({"message":"No books for title"},null,4)));
        }
    })
    

    get_title.then(function () {
            return console.log("Task 13 books by title");
        }).catch(function() {
            return console.log("Task 13 books by title - rejected promise");
        })
})

public_users.get('/book/title/:title', async function(req, res){
    const title = req.params.title;
    const get_title = function() {
        return new Promise((resolve,reject)=>{
            const titles = {"booksbyTitle": []};
            let bookCount = 0;
            for (var isbn in books){
                if (books[isbn].title === title){
                    titles['booksbyTitle'].push(books[isbn]);
                    bookCount++;
                }
             
            }
               
            if (bookCount){
                resolve(res.send(JSON.stringify(titles,null,4)));            
            }else{
                reject(res.send(JSON.stringify({"message":"No books for title"},null,4)));
            }
        })
    }
    try {
        await get_title();
    }catch(err){
        console.log("Task 13 promise rejected");
    }
    console.log("Task 13 get async book details for title");
})
module.exports.general = public_users;
