import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UebungenService } from '../../../../services/uebungen.service';
import { StufenService } from '../../../../services/stufen.service';
import { Uebungen } from '../../../../models/payload-types/collections/uebungen';
import { Stufen } from '../../../../models/payload-types/collections/stufen';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-uebungen-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './uebungen-form.html',
  styleUrl: './uebungen-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UebungenFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private uebungenService = inject(UebungenService);
  private stufenService = inject(StufenService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  uebungForm: FormGroup;
  isEditMode = signal(false);
  uebungId: string | null = null;

  stufen = toSignal(this.stufenService.getStufen(), { initialValue: [] as Stufen[] });

  constructor() {
    this.uebungForm = this.fb.group({
      motto: ['', Validators.required],
      datum: ['', Validators.required],
      antretenZeit: [''],
      antretenOrt: [''],
      abtretenZeit: [''],
      abtretenOrt: [''],
      tenue: [''],
      mitnehmen: [''],
      weiteres: [''],
      stufen: [[], Validators.required],
    });
  }

  ngOnInit() {
    this.uebungId = this.route.snapshot.paramMap.get('id');
    if (this.uebungId) {
      this.isEditMode.set(true);
      this.uebungenService.getUebung(this.uebungId).subscribe((uebung: Uebungen) => {
        // Format date for input[type="date"]
        const date = uebung.datum ? new Date(uebung.datum).toISOString().split('T')[0] : '';

        this.uebungForm.patchValue({
          ...uebung,
          datum: date,
          stufen: uebung.stufen.map((s: string | Stufen) => (s as Stufen).id || s),
        });
      });
    }
  }

  onSubmit() {
    if (this.uebungForm.valid) {
      const formValue = this.uebungForm.value;
      const uebungData: Partial<Uebungen> = {
        ...formValue,
        // Ensure datum is in ISO format if needed, though Payload usually handles YYYY-MM-DD
      };

      if (this.isEditMode() && this.uebungId) {
        this.uebungenService.updateUebung(this.uebungId, uebungData).subscribe(() => {
          this.router.navigate(['/admin/uebungen']);
        });
      } else {
        this.uebungenService.createUebung(uebungData).subscribe(() => {
          this.router.navigate(['/admin/uebungen']);
        });
      }
    }
  }

  onStufeChange(stufeId: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const currentStufen = this.uebungForm.get('stufen')?.value as string[];

    if (checkbox.checked) {
      this.uebungForm.get('stufen')?.setValue([...currentStufen, stufeId]);
    } else {
      this.uebungForm.get('stufen')?.setValue(currentStufen.filter(id => id !== stufeId));
    }
  }

  isStufeSelected(stufeId: string): boolean {
    const currentStufen = this.uebungForm.get('stufen')?.value as string[];
    return currentStufen.includes(stufeId);
  }
}
