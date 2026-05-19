import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateBook, UpdateBook } from '../../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css',
})
export class BookFormComponent {
  private readonly bookService: BookService = inject(BookService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  protected bookForm: FormGroup = inject(FormBuilder).group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    publishedDate: ['', Validators.required],
    description: ['']
  });
  protected bookId: number | null = null;
  protected isSaving: boolean = false;
  protected isLoading: boolean = false;

  constructor() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.bookId = +idParam;
        this.loadBook();
      }
    });
  }

  onSubmit() {
    if (this.bookForm.invalid) {
      return;
    }

    this.isSaving = true;
    if (this.bookId !== null) {
      const updatedBook: UpdateBook = this.bookForm.value;
      this.bookService.updateBook(this.bookId, updatedBook).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['books'])
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Kunde inte uppdatera boken:', error);
          alert('Ett fel uppstod vid uppdatering av boken. Försök igen senare.');
        }
      });
    } else {
      const createdBook: CreateBook = this.bookForm.value;
      this.bookService.createBook(createdBook).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['books'])
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Kunde inte skapa boken:', error);
          alert('Ett fel uppstod vid skapande av boken. Försök igen senare.');
        }
      });
    }
  }

  private loadBook() {
    this.isLoading = true;

    if (this.bookId !== null) {
      this.bookService.getBook(this.bookId).subscribe({
        next: (book) => {
          const formattedDate = book.publishedDate ? new Date(book.publishedDate).toISOString().slice(0, 10) : ''
          this.bookForm.patchValue({
            title: book.title || '',
            author: book.author || '',
            publishedDate: formattedDate, 
            description: book.description || ''
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.log('Error loading book:', error);
          this.isLoading = false;
          alert('Ett fel uppstod vid hämtning av boken. Försök igen senare.');
        }
      });
    }
  }
}
