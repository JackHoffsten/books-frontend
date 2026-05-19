import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe, SlicePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe, SlicePipe, RouterLink],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent {
  private readonly bookService: BookService = inject(BookService);
  private readonly router: Router = inject(Router);

  protected books$: Observable<Book[]> = this.bookService.getBooks(); 

  editBook(id: number, event: Event) {
    event.stopPropagation();

    this.router.navigate(['/books', id]);
  }

  deleteBook(id: number, event: Event) {
    event.stopPropagation();

    if (confirm("Är du säker på att du vill ta bort boken?")) {
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
