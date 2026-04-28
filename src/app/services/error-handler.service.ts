import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  handle(error: HttpErrorResponse): void {
    let message: string;

    if (error.error?.message) {
      message = error.error.message;
    } else if (error.status === 0) {
      message = 'Keine Verbindung zum Server';
    } else {
      message = `Fehler ${error.status}: ${error.statusText}`;
    }

    console.error('API Error:', message);
    // For now, we just log to console.
    // In a real app, you would show a toast or snackbar.
  }
}
