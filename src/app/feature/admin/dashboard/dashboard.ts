import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { UebungenService } from '../../../services/uebungen.service';
import { UserService } from '../../../services/user.service';
import { DownloadsService } from '../../../services/downloads.service';
import { AuthService } from '../../../services/auth.service';
import { Uebungen } from '../../../models/payload-types/collections/uebungen';
import { Stufen } from '../../../models/payload-types/collections/stufen';
import { forkJoin, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private uebungenService = inject(UebungenService);
  private userService = inject(UserService);
  private downloadsService = inject(DownloadsService);
  private authService = inject(AuthService);

  upcomingUebungen = signal<Uebungen[]>([]);
  stats = signal({
    uebungenCount: 0,
    usersCount: 0,
    downloadsCount: 0
  });

  inviteEmail = '';
  isInviting = signal(false);
  inviteStatus = signal<'idle' | 'success' | 'error'>('idle');
  inviteErrorMessage = signal<string>('');
  isAdmin = this.authService.isAdmin;

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    forkJoin({
      upcoming: this.uebungenService.getUpcomingUebungen(5),
      allUebungen: this.uebungenService.getUebungen(),
      users: this.userService.getUsers(),
      downloads: this.downloadsService.getDownloads()
    }).subscribe(({ upcoming, allUebungen, users, downloads }) => {
      this.upcomingUebungen.set(upcoming);

      const now = new Date().toISOString().split('T')[0];
      const upcomingCount = allUebungen.filter(u => u.datum >= now).length;

      this.stats.set({
        uebungenCount: upcomingCount,
        usersCount: users.length,
        downloadsCount: downloads.length
      });
    });
  }

  formatDate(dateString: string): { day: string, month: string } {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('de-CH', { month: 'short' }).toUpperCase();
    return { day, month };
  }

  getStufenNames(uebung: Uebungen): string {
    return uebung.stufen
      .map(s => (typeof s === 'object' ? s.name : ''))
      .filter(name => !!name)
      .join(', ');
  }

  getStufeName(stufe: string | Stufen): string {
    if (typeof stufe === 'object' && stufe !== null) {
      return stufe.name || '';
    }
    return stufe as string;
  }

  onInviteUser() {
    if (!this.inviteEmail || !this.inviteEmail.includes('@')) return;

    this.isInviting.set(true);
    this.inviteErrorMessage.set('');

    this.authService.inviteUser(this.inviteEmail).subscribe({
      next: () => {
        this.isInviting.set(false);
        this.inviteStatus.set('success');
        this.inviteEmail = '';
        setTimeout(() => this.inviteStatus.set('idle'), 5000);
      },
      error: (err) => {
        this.isInviting.set(false);
        this.inviteStatus.set('error');
        this.inviteErrorMessage.set(err.error?.errors?.[0]?.message || 'Fehler beim Senden der Einladung.');
        setTimeout(() => this.inviteStatus.set('idle'), 5000);
      }
    });
  }
}
