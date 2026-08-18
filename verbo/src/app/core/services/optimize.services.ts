import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OptimizeService {
  private readonly http = inject(HttpClient);

  optimize(text: string): Observable<string> {
    return this.http
      .post<{ optimized_text: string }>('http://localhost:8000/optimize', { text })
      .pipe(map((res) => res.optimized_text));
  }
}