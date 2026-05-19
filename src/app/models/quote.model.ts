export interface Quote {
  id: number;
  text: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface CreateQuote {
  text: string;
  author: string;
}

export interface UpdateQuote {
  text?: string;
  author?: string;
}