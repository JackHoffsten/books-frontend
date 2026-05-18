import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, CreateBook, UpdateBook } from '../models/book.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly API_URL = `${environment.apiUrl}/books`;
  private readonly http: HttpClient = inject(HttpClient);

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.API_URL);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.API_URL}/${id}`);
  }

  createBook(book: CreateBook): Observable<Book> {
    return this.http.post<Book>(this.API_URL, book);
  }

  updateBook(id: number, book: UpdateBook): Observable<Book> {
    return this.http.put<Book>(`${this.API_URL}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
