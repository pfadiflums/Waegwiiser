import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StufeService } from '../../services/stufe.service';
import { Stufe } from '../../models/stufe.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private stufeService = inject(StufeService);
  scoutGroups = signal<Stufe[]>([]);

  instagramPosts = signal<any[]>(Array(9).fill(null));

  ngOnInit(): void {
    this.stufeService.getAll().subscribe({
      next: (stufen) => {
        this.scoutGroups.set(stufen);
      },
      error: (err) => {
        console.error('Error loading stufen', err);
      }
    });
  }
}
