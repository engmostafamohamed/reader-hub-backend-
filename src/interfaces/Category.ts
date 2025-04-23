export interface ICategory {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  appropriate?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryResponse extends ICategory {
  success: boolean;
  data?: ICategory[];
  message?: string;
}

