export interface Book {
  id: number;
  title: string;
  author: string;
  publishedDate: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface CreateBook {
  title: string;
  author: string;
  publishedDate: string;
  description?: string;
}

export interface UpdateBook {
  title?: string;
  author?: string;
  publishedDate?: string;
  description?: string;
}
