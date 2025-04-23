import express from 'express';
import { createBook, getAllBooks, getBookById, updateBook, deleteBook } from '../controllers/BookController';

const router = express.Router();

router.route('/')
  .post(createBook)
  .get(getAllBooks);

router.route('/:id')
  .get(getBookById)
  .put(updateBook)
  .delete(deleteBook);

export default router;
