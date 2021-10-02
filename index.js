const BookModel = require("./database/books");
const AuthorModel = require("./database/authors");
const PublicationModel = require("./database/publication");
require("dotenv").config();

var mongoose = require("mongoose");
const express = require("express");

let app = express();
app.use(express.json());

var mongoDB = process.env.Mongo_URI;
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("CONNECTION ESTABLISHED"));

// http://localhost:3000/
app.get("/", (req, res) => {
  return res.json({ WELCOME: `to my Backend Software for the Book Company` });
});

// http://localhost:3000/books
app.get("/books", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

// http://localhost:3000/book-isbn/12345Two
app.get("/book-isbn/:isbn", async (req, res) => {
  const { isbn } = req.params;
  const getSpecificBook = await BookModel.findOne({ ISBN: isbn });
  if (getSpecificBook === null) {
    return res.json({ error: `No Book found with ISBN ${isbn}` });
  }
  return res.json(getSpecificBook);
});

// http://localhost:3000/book-category/programming
app.get("/book-category/:category", async (req, res) => {
  const { category } = req.params;
  const getSpecificBook = await BookModel.findOne({ category: category });
  if (getSpecificBook === null) {
    return res.json({ error: `No book found with category ${category}` });
  }
  return res.json(getSpecificBook);
});

// http://localhost:3000/authors
app.get("/authors", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});

// http://localhost:3000/author-id/1
app.get("/author-id/:id", async (req, res) => {
  const { id } = req.params;
  const getSpecificAuthor = await AuthorModel.findOne({ id: id });
  if (getSpecificAuthor === null) {
    return res.json({ error: `No Author found with id ${id}` });
  }
  return res.json(getSpecificAuthor);
});

// http://localhost:3000/publications
app.get("/publications", async (req, res) => {
  const publications = await PublicationModel.find();
  return res.json(publications);
});

// http://localhost:3000/publication-isbn/12345Two
app.get("/publication-isbn/:isbn", async (req, res) => {
  const { isbn } = req.params;
  const getPublication = await PublicationModel.findOne({ books: isbn });
  if (getPublication === null) {
    res.json({ error: `No publication found with ISBN of ${isbn}` });
  }
  return res.json(getPublication);
});

//POST
// http://localhost:3000/book
app.post("/book", async (req, res) => {
  const addNewBook = await BookModel.create(req.body);
  return res.json({ bookAdded: addNewBook, message: "Book was Added !!!" });
});

// http://localhost:3000/author
app.post("/author", async (req, res) => {
  const addNewAuthor = await AuthorModel.create(req.body);
  return res.json({
    authorAdded: addNewAuthor,
    message: "Author was Added!!!",
  });
});

// http://localhost:3000/publication
app.post("/publication", async (req, res) => {
  const addNewPublication = await PublicationModel.create(req.body);
  return res.json({
    publicationAdded: addNewPublication,
    message: "Publication was Added!!!",
  });
});

// PUT
// http://localhost:3000/book-update/12345ONE
app.put("/book-update/:isbn", async (req, res) => {
  const { isbn } = req.params;
  // const updatedBook = await BookModel.updateOne({ISBN: isbn}, {$set: req.body});
  const updatedBook = await BookModel.findOneAndUpdate(
    { ISBN: isbn },
    req.body,
    { new: true }
  );
  return res.json({ updatedBook: updatedBook, message: "Book was updated!!!" });
});

// http://localhost:3000/author-update/1
app.put("/author-update/:id", async (req, res) => {
  const { id } = req.params;
  const updateAuthor = await AuthorModel.findOneAndUpdate(
    { id: id },
    req.body,
    { new: true }
  );
  return res.json({
    updatedAuthor: updateAuthor,
    message: "Author was Updated!!!",
  });
});

// http://localhost:3000/publication-update/1
app.put("/publication-update/:id", async (req, res) => {
  const { id } = req.params;
  const updatePublication = await PublicationModel.findOneAndUpdate(
    { id: id },
    req.body,
    { new: true }
  );
  return res.json({
    updatedPublicarion: updatePublication,
    message: "publication was updated!!!",
  });
});

// DELETE
// http://localhost:3000/book-delete/12345ONE
app.delete("/book-delete/:isbn", async (req, res) => {
  const { isbn } = req.params;
  const deleteBook = await BookModel.deleteOne({ ISBN: isbn });
  return res.json({ deletedBook: deleteBook, message: "Book was deleted!!!!" });
});

// http://localhost:3000/book-author-delete/12345ONE/1
app.delete("/book-author-delete/:isbn/:id", async (req, res) => {
  // console.log(req.params);
  let { isbn, id } = req.params;
  id = Number(id);
  const getSpecificBook = await BookModel.findOne({ ISBN: isbn });
  if (getSpecificBook == null) {
    return res.json({ message: `Book not found with ISBN ${isbn}` });
  } else {
    getSpecificBook.authors.remove(id);
    const updateBook = await BookModel.findOneAndUpdate(
      { ISBN: isbn },
      getSpecificBook,
      { new: true }
    );
    return res.json({
      updatedBook: updateBook,
      message: `${id} was deleted!!!`,
    });
  }
});

// http://localhost:3000/author-book-delete/1/12345ONE
app.delete("/author-book-delete/:id/:isbn", async (req, res) => {
  const { id, isbn } = req.params;
  const getSpecificAuthor = await AuthorModel.findOne({ id: id });
  if (getSpecificAuthor == null) {
    return res.json({ message: `Author not found with ID ${id}` });
  } else {
    getSpecificAuthor.books.remove(isbn);
    const updateAuthor = await AuthorModel.findOneAndUpdate(
      { id: id },
      getSpecificAuthor,
      { new: true }
    );
    return res.json({
      updatedAuthor: updateAuthor,
      message: `Book with ${isbn} was deleted form ${id}!!!`,
    });
  }
});

// http://localhost:3000/author-delete/1
app.delete("/author-delete/:id", async (req, res) => {
  const { id } = req.params;
  const deleteAuthor = await AuthorModel.deleteOne({ id: id });
  return res.json({
    deletedAuthor: deleteAuthor,
    message: `Author deleted with ${id}`,
  });
});

// http://localhost:3000/publication-delete/1
app.delete("/publication-delete/:id", async (req, res) => {
  const { id } = req.params;
  const deletePublication = await PublicationModel.deleteOne({ id: id });
  return res.json({
    deletedPublication: deletePublication,
    message: `Publication deleted with ${id}`,
  });
});

app.listen(3000, () => {
  console.log("MY EXPRESS APP IS RUNNING.....");
});
