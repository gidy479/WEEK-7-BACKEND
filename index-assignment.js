const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

//  Connect to MongoDB
mongoose.connect('mongodb+srv://gideontetteh792:CjkLE3grbCxUCWGL@cluster0.tzlhh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error(' MongoDB connection error:', err);
});

//  Author Schema
const authorSchema = new mongoose.Schema({
  name: String,
  email: String,
  country: String
});
const Author = mongoose.model('Author', authorSchema);

// Book Schema
const bookSchema = new mongoose.Schema({
  title: String,
  genre: String,
  year: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
});
const Book = mongoose.model('Book', bookSchema);


//  ROUTES

//  Create new Author
app.post('/authors', async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    const savedAuthor = await newAuthor.save();
    res.status(201).json(savedAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//  Add new Book
app.post('/books', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//  Link Author to Book (or update)
app.put('/books/:id/link-author', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { author: req.body.authorId },
      { new: true }
    ).populate('author');
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//  Get all books (with populated authors)
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find().populate('author');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update book
app.put('/books/:id', async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Book not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete book
app.delete('/books/:id', async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Get single book by author's name
app.get('/books/author/:name', async (req, res) => {
  try {
    const author = await Author.findOne({ name: req.params.name });
    if (!author) return res.status(404).json({ message: 'Author not found' });

    const book = await Book.findOne({ author: author._id }).populate('author');
    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
