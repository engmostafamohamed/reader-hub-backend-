import mongoose from 'mongoose';

export interface IBook {
  id?: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  discount: number;
  publishing_date: Date;
  author_id: mongoose.Types.ObjectId;
  publisher_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  status: 'available' | 'out of stock' | 'unpublished';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBookResponse {
  success: boolean;
  data?: IBook | IBook[];
  message?: string;
  statusCode: number;
}