import { Request, Response, NextFunction } from 'express';
import Book from '../models/Book.model';
import { successResponse, errorResponse } from '../utilts/responseHandler';
import AppError from '../utilts/AppError';

// Create a new book
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookData = {
      title: req.body.title,
      description: req.body.description,
      images: req.body.images,
      price: req.body.price,
      discount: req.body.discount,
      publishing_date: req.body.publishing_date,
      author_id: req.body.author_id,
      publisher_id: req.body.publisher_id,
      category_id: req.body.category_id,
      status: req.body.status || 'unpublished'
    };

    const book = await Book.create(bookData);
    res.status(201).json(successResponse('Book created successfully', book, 201));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Failed to create book', 400));
  }
};

// Get all books with optional filters
export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = { ...req.query };
    delete query['page'];
    delete query['limit'];

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find(query)
      .populate('author_id', 'firstName lastName')
      .populate('publisher_id', 'firstName lastName')
      .populate('category_id', 'name')
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(query);

    res.status(200).json(successResponse('Books retrieved successfully', {
      books,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    }, 200));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Failed to retrieve books', 400));
  }
};

// Get a single book by ID
export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('author_id', 'firstName lastName')
      .populate('publisher_id', 'firstName lastName')
      .populate('category_id', 'name');

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    res.status(200).json(successResponse('Book retrieved successfully', book, 200));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Failed to retrieve book', 400));
  }
};

// Update a book
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author_id publisher_id category_id');

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    res.status(200).json(successResponse('Book updated successfully', book, 200));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Failed to update book', 400));
  }
};

// Delete a book
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return next(new AppError('Book not found', 404));
    }

    res.status(200).json(successResponse('Book deleted successfully', null, 200));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Failed to delete book', 400));
  }
};