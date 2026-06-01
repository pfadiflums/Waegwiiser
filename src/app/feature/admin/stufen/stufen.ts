import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  tablerEdit,
  tablerLoader2,
  tablerPlus,
  tablerTrash,
  tablerUserPlus,
  tablerUsers,
} from '@ng-icons/tabler-icons';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { StufeOverviewDto } from '../../../api/models/stufe-overview-dto';
import { StufeStore } from '../../../core/store/stufe.store';
import { HlmDialog } from '../../../shared/ui/dialog/src/lib/hlm-dialog';

@Component({
  selector: 'app-stufen',
  imports: [
    ReactiveFormsModule,
    NgIcon,
    HlmTableImports,
    HlmButtonImports,
    HlmBadgeImports,
    HlmDialogImports,
    HlmIconImports,
    HlmInputImports,
    HlmLabelImports,
  ],
  providers: [
    provideIcons({ tablerPlus, tablerEdit, tablerTrash, tablerLoader2, tablerUsers, tablerUserPlus }),
  ],
  templateUrl: './stufen.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StufenComponent {
  protected readonly stufeStore = inject(StufeStore);

  @ViewChild('stufeDialog') private stufeDialog!: HlmDialog;
  @ViewChild('leiterDialog') private leiterDialog!: HlmDialog;

  protected readonly dialogMode = signal<'create' | 'edit'>('create');
  protected readonly saving = signal(false);
  protected readonly addingLeiter = signal(false);
  protected readonly removingLeiterId = signal<number | null>(null);

  protected readonly activeSlug = signal<string | null>(null);
  protected readonly activeDetail = computed(() => {
    const slug = this.activeSlug();
    return slug ? this.stufeStore.details()[slug] : null;
  });

  protected readonly stufeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    slug: new FormControl('', Validators.required),
    tagline: new FormControl(''),
    description: new FormControl(''),
    primaryColor: new FormControl('#000000'),
    groupPhotoUrl: new FormControl(''),
    googleCalendarIframeUrl: new FormControl(''),
  });

  protected readonly leiterForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    sortOrder: new FormControl(0),
  });

  private editingSlug: string | null = null;

  constructor() {
    this.stufeStore.loadAll();
  }

  protected openCreate(): void {
    this.editingSlug = null;
    this.dialogMode.set('create');
    this.stufeForm.reset({ primaryColor: '#000000' });
    this.stufeDialog.open();
  }

  protected openEdit(stufe: StufeOverviewDto): void {
    this.editingSlug = stufe.slug ?? null;
    this.dialogMode.set('edit');
    this.stufeForm.patchValue({
      name: stufe.name ?? '',
      slug: stufe.slug ?? '',
      tagline: stufe.tagline ?? '',
      description: '',
      primaryColor: stufe.primaryColor ?? '#000000',
      groupPhotoUrl: stufe.groupPhotoUrl ?? '',
      googleCalendarIframeUrl: '',
    });
    this.stufeDialog.open();
  }

  protected async save(): Promise<void> {
    if (this.stufeForm.invalid || this.saving()) return;
    this.saving.set(true);
    const v = this.stufeForm.getRawValue();
    const req = {
      name: v.name!,
      slug: v.slug!,
      tagline: v.tagline || undefined,
      description: v.description || undefined,
      primaryColor: v.primaryColor || undefined,
      groupPhotoUrl: v.groupPhotoUrl || undefined,
      googleCalendarIframeUrl: v.googleCalendarIframeUrl || undefined,
    };
    try {
      if (this.dialogMode() === 'create') {
        await this.stufeStore.create(req);
      } else if (this.editingSlug) {
        await this.stufeStore.update(this.editingSlug, req);
      }
      this.stufeDialog.close();
    } finally {
      this.saving.set(false);
    }
  }

  protected async openLeiter(stufe: StufeOverviewDto): Promise<void> {
    this.activeSlug.set(stufe.slug ?? null);
    this.leiterForm.reset({ sortOrder: 0 });
    if (stufe.slug) {
      await this.stufeStore.loadDetail(stufe.slug);
    }
    this.leiterDialog.open();
  }

  protected async addLeiter(): Promise<void> {
    const slug = this.activeSlug();
    if (!slug || this.leiterForm.invalid || this.addingLeiter()) return;
    this.addingLeiter.set(true);
    const v = this.leiterForm.getRawValue();
    try {
      await this.stufeStore.assignLeiter(slug, {
        email: v.email!,
        sortOrder: v.sortOrder ?? 0,
      });
      this.leiterForm.reset({ sortOrder: 0 });
    } finally {
      this.addingLeiter.set(false);
    }
  }

  protected async removeLeiter(leiterId: number): Promise<void> {
    const slug = this.activeSlug();
    if (!slug || this.removingLeiterId() !== null) return;
    this.removingLeiterId.set(leiterId);
    try {
      await this.stufeStore.removeLeiter(slug, leiterId);
    } finally {
      this.removingLeiterId.set(null);
    }
  }
}
