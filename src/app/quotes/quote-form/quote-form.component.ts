import { Component, inject } from '@angular/core';
import { QuoteService } from '../../services/quote.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateQuote, UpdateQuote } from '../../models/quote.model';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './quote-form.component.html',
  styleUrl: './quote-form.component.css',
})
export class QuoteFormComponent {
  private readonly quoteService: QuoteService = inject(QuoteService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  protected quoteForm: FormGroup = inject(FormBuilder).group({
    text: ['', Validators.required],
    author: ['', Validators.required]
  });
  protected quoteId: number | null = null;
  protected isSaving: boolean = false;
  protected isLoading: boolean = false;

  constructor() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.quoteId = +idParam;
        this.loadQuote();
      }
    });
  }

  onSubmit() {
    if (this.quoteForm.invalid) {
      return;
    }

    this.isSaving = true;
    if (this.quoteId !== null) {
      const updatedQuote: UpdateQuote = this.quoteForm.value;
      this.quoteService.updateQuote(this.quoteId, updatedQuote).subscribe({
        next: () => {
          this.router.navigate(['quotes'])
        },
        error: (error) => {
          console.error('Kunde inte uppdatera citatet:', error);
          alert('Ett fel uppstod vid uppdatering av citatet. Försök igen senare.');
        }
      });
    } else {
      const createdQuote: CreateQuote = this.quoteForm.value;
      this.quoteService.createQuote(createdQuote).subscribe({
        next: () => {
          this.router.navigate(['quotes'])
        },
        error: (error) => {
          console.log('Kunde inte skapa citatet:', error);
          alert('Ett fel uppstod vid skapande av citatet. Försök igen senare.');
        }
      });
    }
  }

  private loadQuote() {
    this.isLoading = true;
    if (this.quoteId !== null) {
      this.quoteService.getQuote(this.quoteId).subscribe({
        next: (quote) => {
          this.quoteForm.patchValue({
            text: quote.text || '',
            author: quote.author || ''
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.log('Error loading quote:', error);
          this.isLoading = false;
          alert('Ett fel uppstod vid hämtning av citatet. Försök igen senare.');
        }
      });
    }
  }
}
