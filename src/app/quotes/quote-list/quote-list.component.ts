import { Component, inject } from '@angular/core';
import { QuoteService } from '../../services/quote.service';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Quote } from '../../models/quote.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-quote-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './quote-list.component.html',
  styleUrl: './quote-list.component.css',
})
export class QuoteListComponent {
  private readonly quoteService: QuoteService = inject(QuoteService);
  private readonly router: Router = inject(Router);

  protected quotes$: Observable<Quote[]> = this.quoteService.getQuotes();

  editQuote(id: number, event: Event) {
    event.stopPropagation();

    this.router.navigate(['/quotes', id]);
  }

  deleteQuote(id: number, event: Event) {
    event.stopPropagation();

    if (confirm("Är du säker på att du vill ta bort citatet?")) {
      this.quoteService.deleteQuote(id).subscribe({
        next: () => {
          this.quotes$ = this.quoteService.getQuotes();
        },
        error: (error) => {
          console.error('Kunde inte ta bort citatet:', error);
          alert('Ett fel uppstod vid borttagning av citatet. Försök igen senare.');
        }
      });
    }
  }
}
