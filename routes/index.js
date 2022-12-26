var express = require('express');
var router = express.Router();
// IMPORT BOOK MODEL
const books = require('../models/book').Book;


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

// GET HOME PAGE - ALL BOOKS
router.get('/', asyncHandler(async (req, res) => {
  const allBooks = await books.findAll({});
  console.log(allBooks);
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
