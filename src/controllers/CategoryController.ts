import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category.model';
import { successResponse, errorResponse } from '../utilts/responseHandler';
import AppError from '../utilts/AppError';

// Create a new category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, image, appropriate } = req.body;
    const category = await Category.create({ name, image, appropriate });
    res.status(201).json(successResponse('Category created successfully', category, 201));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Failed to create category', 400));
  }
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find();
    res.status(200).json(successResponse('Categories retrieved successfully', categories, 200));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Failed to retrieve categories', 400));
  }
};

// Get a single category by ID
export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    res.status(200).json(successResponse('Category retrieved successfully', category, 200));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Failed to retrieve category', 400));
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, image, appropriate } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image, appropriate },
      { new: true, runValidators: true }
    );
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    res.status(200).json(successResponse('Category updated successfully', category, 200));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Failed to update category', 400));
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
    res.status(200).json(successResponse('Category deleted successfully', null, 200));
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Failed to delete category', 400));
  }
};