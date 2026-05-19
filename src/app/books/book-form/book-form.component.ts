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
          this.router.navigate(['books'])
        },
        error: (error) => {
          console.error('Kunde inte uppdatera boken:', error);
          alert('Ett fel uppstod vid uppdatering av boken. Försök igen senare.');
        }
      });
    } else {
      const createdBook: CreateBook = this.bookForm.value;
      this.bookService.createBook(createdBook).subscribe({
        next: () => {
          this.router.navigate(['books'])
        },
        error: (error) => {
          console.error('Kunde inte skapa boken:', error);
          alert('Ett fel uppstod vid skapande av boken. Försök igen senare.');
        }
      });
    }

    this.isSaving = false;
  }

  private loadBook() {
    if (this.bookId !== null) {
      this.bookService.getBook(this.bookId).subscribe({
        next: (book) => {
          this.bookForm.patchValue({
            title: book.title || '',
            author: book.author || '',
            publishedDate: book.publishedDate || '',
            description: book.description || ''
          });
        }
      });
    }
  }
}
