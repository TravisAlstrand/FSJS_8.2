var express = require('express');
var router = express.Router();
// IMPORT BOOK MODEL
const { Book } = require('../models');


const asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      // FORWARD ERROR TO GLOBAL HANDLER
      next(error);
    }
  };
};

// HOME PAGE REDIRECT
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}))

// GET HOME PAGE - ALL BOOKS
router.get('/books', asyncHandler(async (req, res) => {
  const allBooks = await Book.findAll();
  res.render('index', {books: allBooks});
}));

// GET CREATE NEW BOOK FORM
router.get('/new', asyncHandler(async (req, res) => {

}));

// POST NEW BOOK
router.post('/new', asyncHandler(async (req, res) => {

}));

// GET BOOK DETAIL
router.get('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book });
  } else {
    const err = new Error('That book does not exist');
    err.status = 404;
    next(err);
  };
}));

// POST BOOK UPDATE
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/');
    } else {
      const err = new Error('That book does not exist');
      err.status = 404;
      next(err);
    };
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', { book, errors: err.errors });
    } else {
      throw err;
    }
  }
}));

// POST DELETE BOOK
router.post('/:id/delete', asyncHandler(async (req, res) => {

}));

module.exports = router;
