const express = require('express');
const router = express.Router();
const bookList = [];

function makeBook(title, author, releaseYear) {
    return {
        title: title,
        author: author,
        releaseYear: releaseYear,
        id: bookList.length
    };
}

bookList.push(makeBook("Catcher in the Rye", "J. D. Salinger", 1951));
bookList.push(makeBook("1984", "George Orwell", 1949));
bookList.push(makeBook("Psion", "Joan D. Vinge", 1982));
bookList.push(makeBook("American Gods", "Neil Gaiman", 2001));
bookList.push(makeBook("Harry Potter and the Philosopher's Stone", "J.K. Rowling", 2001));

router.get("/", (req, res) => {
    res.json(bookList);
});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    let book = bookList.filter(x => x.id === id)[0];

    if (!book) {
        res.sendStatus(404);
    } else {
        res.json(book);
    }
});


router.post("/", (req, res) => {
});

// Capture any other uncoded routes and 404 them
router.use("*", (req, res) => {
    res.sendStatus(404);
});

module.exports = router;