import { Component, inject, signal } from '@angular/core';
import {OptimizeService} from '../core/services/optimize.services';

@Component({
  selector: 'app-project',
  imports: [],
  standalone: true,
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project {
  private readonly optimizeService = inject(OptimizeService);

  readonly userText = signal('');
  readonly optimizedText = signal('');
  readonly loading = signal(false);

  optimize(): void {
    const text = this.userText();
    if (!text.trim()) return;

    this.loading.set(true);
    this.optimizeService.optimize(text).subscribe({
      next: (result) => {
        this.optimizedText.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.optimizedText.set('Something went wrong. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
