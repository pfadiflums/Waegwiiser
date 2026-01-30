import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LeitendeService } from '../../../../services/leitende.service';
import { Leitende } from '../../../../models/payload-types/collections/leitende';

@Component({
  selector: 'app-leitende-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './leitende-form.html',
  styleUrl: './leitende-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeitendeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leitendeService = inject(LeitendeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  leaderForm: FormGroup;
  isEditMode = signal(false);
  leaderId: string | null = null;

  constructor() {
    this.leaderForm = this.fb.group({
      pfadiname: ['', Validators.required],
      vorname: [''],
      nachname: [''],
      funktion: [''],
      email: ['', Validators.email],
      // bild handling would require a media selector, but for now we might just use the ID or skip it
    });
  }

  ngOnInit() {
    this.leaderId = this.route.snapshot.paramMap.get('id');
    if (this.leaderId) {
      this.isEditMode.set(true);
      this.leitendeService.getLeader(this.leaderId).subscribe((leader: Leitende) => {
        this.leaderForm.patchValue(leader);
      });
    }
  }

  onSubmit() {
    if (this.leaderForm.valid) {
      const leaderData = this.leaderForm.value;

      if (this.isEditMode() && this.leaderId) {
        this.leitendeService.updateLeitende(this.leaderId, leaderData).subscribe(() => {
          this.router.navigate(['/admin/leitende']);
        });
      } else {
        this.leitendeService.createLeitende(leaderData).subscribe(() => {
          this.router.navigate(['/admin/leitende']);
        });
      }
    }
  }
}
