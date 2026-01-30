import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DownloadsService } from '../../../../services/downloads.service';
import { Download } from '../../../../models/payload-types/collections/download';

@Component({
  selector: 'app-downloads-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './downloads-form.html',
  styleUrl: './downloads-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadsFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private downloadsService = inject(DownloadsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  downloadForm: FormGroup;
  isEditMode = signal(false);
  downloadId: string | null = null;

  categories = ['Statuten', 'Jahresprogramm', 'Beitrittserklärung', 'Jüsti', 'Zeitungen', 'Sonstiges'];

  constructor() {
    this.downloadForm = this.fb.group({
      titel: ['', Validators.required],
      kategorie: ['Sonstiges'],
      typ: ['file', Validators.required],
      url: [''],
      // datei handling would require media selector
    });
  }

  ngOnInit() {
    this.downloadId = this.route.snapshot.paramMap.get('id');
    if (this.downloadId) {
      this.isEditMode.set(true);
      this.downloadsService.getDownload(this.downloadId).subscribe((download: Download) => {
        this.downloadForm.patchValue(download);
      });
    }
  }

  onSubmit() {
    if (this.downloadForm.valid) {
      const downloadData = this.downloadForm.value;

      if (this.isEditMode() && this.downloadId) {
        this.downloadsService.updateDownload(this.downloadId, downloadData).subscribe(() => {
          this.router.navigate(['/admin/downloads']);
        });
      } else {
        this.downloadsService.createDownload(downloadData).subscribe(() => {
          this.router.navigate(['/admin/downloads']);
        });
      }
    }
  }
}
