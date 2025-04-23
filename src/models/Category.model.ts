import mongoose, { Schema, Document , Model, ObjectId} from 'mongoose';
import { ICategory } from "../interfaces/Category";

export interface ICategoryDocument extends Omit<ICategory, "id">, Document {
  _id: ObjectId; // Mongoose default _id type
}

const categorySchema: Schema<ICategoryDocument> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  image: {
    type: String,
    required: [true, 'Category image is required']
  },
  appropriate: {
    type: Boolean,
    default: true
  }
});
const Category: Model<ICategoryDocument> = mongoose.model<ICategoryDocument>("Category", categorySchema);
export default Category;