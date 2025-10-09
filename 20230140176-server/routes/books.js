const express = require('express');
const router = express.Router();

let books = [
  { id: 1, title: 'Book 1', author: 'Author 1' },
  { id: 2, title: 'Book 2', author: 'Author 2' }
];

router.get('/', (req, res) => {
  res.json(books);
});

router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
});

router.post('/', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
  const book = {
    id: books.length + 1,
    title,
    author
  };
  books.push(book);
  res.status(201).json(book);
});


router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = books.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Book not found' });

  const { title, author, year } = req.body || {};
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
  const updated = { id, title: title.trim(), author: author.trim(), ...(year !== undefined ? { year: Number(year) } : {}) };
  books[idx] = updated;
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = books.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Book not found' });
  const removed = books.splice(idx, 1)[0];
  res.json({ message: 'Book deleted', data: removed });
});

module.exports = router;

