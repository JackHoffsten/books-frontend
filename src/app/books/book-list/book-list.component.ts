import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-book-list',
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent {
  private readonly bookService: BookService = inject(BookService);
  protected books$: Observable<Book[]> = this.bookService.getBooks(); 

  deleteBook(id: number) {
    if (confirm('Är du säker på att du vill ta bort den här boken?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.books$ = this.bookService.getBooks();
        },
        error: (error) => {
          console.error('Kunde inte ta bort boken:', error);
          alert('Ett fel uppstod vid borttagning av boken. Försök igen senare.');
        }
      });
    }
  }
}
