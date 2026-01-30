import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { UebungenService } from '../../../services/uebungen.service';
import { LeitendeService } from '../../../services/leitende.service';
import { DownloadsService } from '../../../services/downloads.service';
import { Uebungen } from '../../../models/payload-types/collections/uebungen';
import { Stufen } from '../../../models/payload-types/collections/stufen';
import { forkJoin, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private uebungenService = inject(UebungenService);
  private leitendeService = inject(LeitendeService);
  private downloadsService = inject(DownloadsService);

  upcomingUebungen = signal<Uebungen[]>([]);
  stats = signal({
    uebungenCount: 0,
    leitendeCount: 0,
    downloadsCount: 0
  });

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    forkJoin({
      upcoming: this.uebungenService.getUpcomingUebungen(5),
      allUebungen: this.uebungenService.getUebungen(),
      leitende: this.leitendeService.getLeitende(),
      downloads: this.downloadsService.getDownloads()
    }).subscribe(({ upcoming, allUebungen, leitende, downloads }) => {
      this.upcomingUebungen.set(upcoming);

      const now = new Date().toISOString().split('T')[0];
      const upcomingCount = allUebungen.filter(u => u.datum >= now).length;

      this.stats.set({
        uebungenCount: upcomingCount,
        leitendeCount: leitende.length,
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
}
