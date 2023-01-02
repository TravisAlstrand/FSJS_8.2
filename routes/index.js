var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
// IMPORT BOOK MODEL
const { Book } = require("../models");

const asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // FORWARD ERROR TO GLOBAL HANDLER
      next(error);
    }
  };
};

// HOME PAGE REDIRECT
router.get(
  "/",
  asyncHandler(async (req, res) => {
    res.redirect("/books");
  })
);

// GET HOME PAGE - ALL BOOKS
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    // variables parsed to INTs from url query page & size
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    // variables to determine limit & offset default values
    let page = 0;
    let size = 10;

    // check if page value from query is a number & not negative
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }

    // check if size value from query is a number & not negative & not larger than 10
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
      size = sizeAsNumber;
    }

    const books = await Book.findAndCountAll({
      // how many objects to show per page
      limit: size,
      // how many objects to skip (ex. page 0(1st) * 10perpage = skip 0, page 1(2nd) * 10perpage = skip 10)
      offset: page * size,
    });
    res.render("index", {
      books: books.rows,
      currentPage: page,
      totalPages: Math.ceil(books.count / size),
    });
  })
);

// GET CREATE NEW BOOK FORM
router.get(
  "/books/new",
  asyncHandler(async (req, res) => {
    res.render("new-book");
  })
);

// POST NEW BOOK
router.post(
  "/books/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/");
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", { book, errors: err.errors });
      } else {
        throw err;
      }
    }
  })
);

// SEARCH RESULTS
router.get(
  "/books/search",
  asyncHandler(async (req, res) => {
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    let page = 0;
    let size = 10;

    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }

    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
      size = sizeAsNumber;
    }

    const userSearch = req.query.searchTerm;
    const filteredBooks = await Book.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${userSearch}%` } },
          { author: { [Op.like]: `%${userSearch}%` } },
          { genre: { [Op.like]: `%${userSearch}%` } },
          { year: { [Op.like]: `%${userSearch}%` } },
        ],
      },
      limit: size,
      offset: page * size,
    });
    res.render("index", {
      books: filteredBooks.rows,
      query: userSearch,
      currentPage: page,
      totalPages: Math.ceil(filteredBooks.count / size),
    });
  })
);

// GET BOOK DETAIL
router.get(
  "/books/:id",
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book });
    } else {
      const err = new Error("That book does not exist");
      err.status = 404;
      next(err);
    }
  })
);

// POST BOOK UPDATE
router.post(
  "/books/:id",
  asyncHandler(async (req, res, next) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/");
      } else {
        const err = new Error("That book does not exist");
        err.status = 404;
        next(err);
      }
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", { book, errors: err.errors });
      } else {
        throw err;
      }
    }
  })
);

// POST DELETE BOOK
router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/");
    } else {
      const err = new Error("That book does not exist");
      err.status = 404;
      next(err);
    }
  })
);

module.exports = router;
