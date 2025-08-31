import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private http = inject(HttpClient);

  checkHealth() {
    return this.http.get('/health');
  }
}