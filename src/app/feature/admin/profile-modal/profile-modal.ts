import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/payload-types/collections/user';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-modal.html',
  styleUrl: './profile-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileModalComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  close = output<void>();

  user = this.authService.user;

  profileForm = this.fb.group({
    pfadiname: [this.user()?.pfadiname || ''],
    vorname: [this.user()?.vorname || '', [Validators.required]],
    nachname: [this.user()?.nachname || '', [Validators.required]],
    email: [this.user()?.email || '', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(6)]],
  });

  isSaving = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isSaving.set(true);
    this.error.set(null);
    this.success.set(false);

    const val = this.profileForm.value;
    const updateData: Partial<User> = {
      pfadiname: val.pfadiname,
      vorname: val.vorname!,
      nachname: val.nachname!,
      email: val.email!,
    };

    if (val.password) {
      updateData.password = val.password;
    }

    this.authService.update(updateData).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.success.set(true);
        this.profileForm.get('password')?.reset();
        setTimeout(() => this.success.set(false), 3000);
      },
      error: (err: any) => {
        this.isSaving.set(false);
        this.error.set('Fehler beim Speichern des Profils.');
        console.error(err);
      }
    });
  }
}
