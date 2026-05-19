import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateQuote, Quote, UpdateQuote } from '../models/quote.model';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_URL = this.apiService.getUrl('/quotes');

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.API_URL);
  }

  getQuote(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.API_URL}/${id}`)
  }

  createQuote(quote: CreateQuote): Observable<Quote> {
    return this.http.post<Quote>(this.API_URL, quote);
  }

  updateQuote(id: number, quote: UpdateQuote): Observable<Quote> {
    return this.http.put<Quote>(`${this.API_URL}/${id}`, quote);
  }

  deleteQuote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
