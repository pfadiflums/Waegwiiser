import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  status = signal<'verifying' | 'success' | 'error'>('verifying');

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.status.set('error');
      return;
    }

    this.authService.verifyEmail(token).pipe(
      catchError(() => {
        this.status.set('error');
        return of(null);
      })
    ).subscribe((res) => {
      if (res) {
        this.status.set('success');
      } else {
        this.status.set('error');
      }
    });
  }
}
