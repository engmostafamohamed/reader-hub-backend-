import mongoose, { Schema } from 'mongoose';
import User from './User.model';
import Category from './Category.model';
import { IBook } from '../interfaces/Book';

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Book description is required'],
    },
    images: [
      {
        type: String,
        required: [true, 'At least one image is required'],
      },
    ],
    price: {
      type: Number,
      required: [true, 'Book price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    publishing_date: {
      type: Date,
      required: [true, 'Publishing date is required'],
    },
    author_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author ID is required'],
      validate: {
        validator: async function(value: mongoose.Types.ObjectId) {
          const user = await User.findOne({ _id: value, role: 'author' });
          return user !== null;
        },
        message: 'Invalid author ID or user is not an author',
      },
    },
    publisher_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Publisher ID is required'],
      validate: {
        validator: async function(value: mongoose.Types.ObjectId) {
          const user = await User.findOne({ _id: value, role: 'publisher' });
          return user !== null;
        },
        message: 'Invalid publisher ID or user is not a publisher',
      },
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
      validate: {
        validator: async function(value: mongoose.Types.ObjectId) {
          const category = await Category.findById(value);
          return category !== null;
        },
        message: 'Invalid category ID',
      },
    },
    status: {
      type: String,
      enum: ['available', 'out of stock', 'unpublished'],
      default: 'unpublished',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for discounted price
bookSchema.virtual('discounted_price').get(function() {
  return this.price * (1 - this.discount / 100);
});

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;