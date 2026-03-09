const express = require("express");
const router = express.Router();
const controller = require("../controllers/libraryController");

/* ================= GET DATA ================= */

router.get("/books", controller.getBooks);
router.get("/students", controller.getStudents);

/* ================= BOOK ACTIONS ================= */

router.post("/issue", controller.issueBook);
router.post("/return", controller.returnBook);
router.post("/addbook", controller.addBook);
router.post("/deletebook", controller.deleteBook);

/* ================= EXPORT ================= */

module.exports = router;