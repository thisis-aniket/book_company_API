// const db = require("./database");
const db = require("./database");
const express = require("express");


let app = express();
app.use(express.json()); 


// http://localhost:3000/
app.get("/", (req, res) => {
  const getAllBooks = db.books;
  return res.json(getAllBooks);
});

// http://localhost:3000/book-isbn/12345Two
app.get("/book-isbn/:isbn", (req, res) => {
  console.log(req.params);
  // const isbn = req.params.isbn;
  const { isbn } = req.params;
  const getSpecificBook = db.books.filter((book) => book.ISBN === isbn);
  if (getSpecificBook.length === 0) {
    return res.json({ error: `No book found with ISBN of ${isbn}` });
  }
  return res.json(getSpecificBook[0]);
});

// http://localhost:3000/book-category/programming
app.get("/book-category/:category", (req, res) => {
  const { category } = req.params;
  const getSpecificBooks = db.books.filter((book) =>
    book.category.includes(category)
  );
  if (getSpecificBooks.length === 0) {
    return res.json({
      error: `No Books found for the category of ${category}`,
    });
  }
  return res.json(getSpecificBooks);
});

// http://localhost:3000/authors
app.get("/authors", (req, res) => {
  const getAllAuthors = db.authors;
  return res.json(getAllAuthors);
});

// http://localhost:3000/author-id/1
app.get("/author-id/:id", (req, res) => {
  const { id } = req.params;
  const getSpecificAuthor = db.authors.filter((author) => id == author.id);
  if (getSpecificAuthor.length === 0) {
    return res.json({ error: `No Author found with id ${id}` });
  }
  return res.json(getSpecificAuthor);
});

// http://localhost:3000/publications
app.get("/publications", (req, res) => {
  const publications = db.publications;
  return res.json(publications);
});

// http://localhost:3000/publication-isbn/12345Two
app.get("/publication-isbn/:isbn", (req, res) => {
  const { isbn } = req.params;
  const getPublication = db.publications.filter((publication) =>
    publication.books.includes(isbn)
  );
  if (getPublication.length === 0) {
    res.json({ error: `No publication found with ISBN of ${isbn}` });
  }
  return res.json(getPublication[0]);
});

//POST
// http://localhost:3000/book
app.post("/book", (req, res) => {
  db.books.push(req.body);
  return res.json(db.books);
});

// http://localhost:3000/author
app.post("/author", (req, res) => {
  db.authors.push(req.body);
  return res.json(db.authors);
});

// PUT
// http://localhost:3000/book-update/12345ONE
app.put("/book-update/:isbn", (req, res) => {
  const { isbn } = req.params;
  db.books.forEach((book) => {
    if (book.ISBN === isbn) {
      // console.log({...book, ...req.body})
      return { ...book, ...req.body };
    }
    return book;
  });
  return res.json(db.books);
});

// http://localhost:3000/author-update/1
app.put("/author-update/:id", (req, res) => {
  const { id } = req.params;
  db.authors.forEach((author) => {
    if (author.id == id) {
      console.log({ ...author, ...req.body });
      return { ...author, ...req.body };
    }
    return author;
  });
  return res.json(db.authors);
});

// http://localhost:3000/publication-update/1
app.put("/publication-update/:id", (req, res) => {
  const { id } = req.params;
  db.publications.forEach((publication) => {
    if (publication.id == id) {
      console.log({ ...publication, ...req.body });
      return { ...publication, ...req.body };
    }
    return publication;
  });
  return res.json(db.publications);
});

// DELETE
// http://localhost:3000/book-delete/12345ONE
app.delete("/book-delete/:isbn", (req, res) => {
  const { isbn } = req.params;
  const filteredBooks = db.books.filter((book) => book.ISBN !== isbn);
  db.books = filteredBooks;
  return res.json(db.books);
});

// http://localhost:3000/book-author-delete/12345ONE/1
app.delete("/book-author-delete/:isbn/:id", (req, res) => {
  // console.log(req.params);
  let { isbn, id } = req.params;
  id = Number(id);
  db.books.forEach((book) => {
    if (book.ISBN === isbn) {
      if (!book.authors.includes(id)) {
        return;
      }
      book.authors = book.authors.filter((author) => author !== id);
      return book;
    }
    return book;
  });
  return res.json(db.books);
});

app.listen(3000, () => {
  console.log("MY EXPRESS APP IS RUNNING.....");
});