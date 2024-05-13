const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

//Get all books using Async callbacks
public_users.get("/server/asynbooks", async function (req, res) {
    try {
        let response = await axios.get("http://localhost:5000/");
        console.log(response.data);
        return res.status(200).json(response.data);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting book list" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn])
});

//Get book details by ISBN using Promises
public_users.get("/server/asynbooks/isbn/:isbn", function (req, res) {
    let { isbn } = req.params;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(function (response) {
            console.log(response.data);
            return res.status(200).json(response.data);
        })
        .catch(function (error) {
            console.log(error);
            return res.status(500).json({ message: "Error while fetching book details." })
        })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    // Find books by author
    const authorBooks = [];
    for (const bookId in books) {
        if (books[bookId].author.toLowerCase() === author.toLowerCase()) {
            authorBooks.push(books[bookId]);
        }
    }

    // Check if any books found
    if (authorBooks.length > 0) {
        res.json(authorBooks);
    } else {
        res.status(404).send(`No books found by author: ${author}`);
    }
});

//Get book details by author using promises
public_users.get("/server/asynbooks/author/:author", function (req, res) {
    let { author } = req.params;
    axios.get(`http://localhost:5000/author/${author}`)
        .then(function (response) {
            console.log(response.data);
            return res.status(200).json(response.data);
        })
        .catch(function (error) {
            console.log(error);
            return res.status(500).json({ message: "Error while fetching book details." })
        })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    // Find books by author
    const titleBooks = [];
    for (const bookId in books) {
        if (books[bookId].title.toLowerCase() === title.toLowerCase()) {
            titleBooks.push(books[bookId]);
        }
    }

    // Check if any books found
    if (titleBooks.length > 0) {
        res.json(titleBooks);
    } else {
        res.status(404).send(`No books found by the title: ${title}`);
    }
});

//Get all books based on title using promises
public_users.get("/server/asynbooks/title/:title", function (req, res) {
    let { title } = req.params;
    axios.get(`http://localhost:5000/title/${title}`)
        .then(function (response) {
            console.log(response.data);
            return res.status(200).json(response.data);
        })
        .catch(function (error) {
            console.log(error);
            return res.status(500).json({ message: "Error while fetching book details." })
        })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews)
});

module.exports.general = public_users;
