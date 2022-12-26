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
router.get('/:id', asyncHandler(async (req, res) => {

}));

// POST BOOK UPDATE
router.post('/:id', asyncHandler(async (req, res) => {

}));

// POST DELETE BOOK
router.post('/:id/delete', asyncHandler(async (req, res) => {

}));

module.exports = router;
