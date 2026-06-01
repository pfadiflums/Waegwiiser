import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  tablerCheck,
  tablerEdit,
  tablerLoader2,
  tablerPlus,
  tablerTrash,
} from '@ng-icons/tabler-icons';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { LocalTime } from '../../../api/models/local-time';
import { UebungDto } from '../../../api/models/uebung-dto';
import { StufeStore } from '../../../core/store/stufe.store';
import { UebungStore } from '../../../core/store/uebung.store';
import { HlmDialog } from '../../../shared/ui/dialog/src/lib/hlm-dialog';

function timeToString(t?: LocalTime): string {
  if (!t) return '';
  return `${String(t.hour ?? 0).padStart(2, '0')}:${String(t.minute ?? 0).padStart(2, '0')}`;
}

function stringToTime(s: string): LocalTime | undefined {
  if (!s) return undefined;
  const [h, m] = s.split(':').map(Number);
  return { hour: h, minute: m, second: 0, nano: 0 };
}

@Component({
  selector: 'app-uebungen',
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
    provideIcons({ tablerPlus, tablerEdit, tablerTrash, tablerCheck, tablerLoader2 }),
  ],
  templateUrl: './uebungen.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UebungenComponent {
  protected readonly stufeStore = inject(StufeStore);
  protected readonly uebungStore = inject(UebungStore);

  @ViewChild('uebungDialog') private uebungDialog!: HlmDialog;
  @ViewChild('deleteDialog') private deleteDialog!: HlmDialog;

  protected readonly selectedStufeSlug = signal<string>('all');
  protected readonly dialogMode = signal<'create' | 'edit'>('create');
  protected readonly saving = signal(false);
  protected readonly deleteTargetId = signal<number | null>(null);
  protected readonly deleting = signal(false);

  protected readonly filteredUebungen = computed(() => {
    const slug = this.selectedStufeSlug();
    const all = this.uebungStore.uebungen();
    return slug === 'all' ? all : all.filter(u => u.stufeSlug === slug);
  });

  protected readonly form = new FormGroup({
    stufeSlug: new FormControl('', Validators.required),
    date: new FormControl(''),
    motto: new FormControl(''),
    tenue: new FormControl(''),
    antretenTime: new FormControl(''),
    antretenLocation: new FormControl(''),
    abtretenTime: new FormControl(''),
    abtretenLocation: new FormControl(''),
    mitnehmen: new FormControl(''),
    weiteres: new FormControl(''),
  });

  private editingId: number | null = null;

  constructor() {
    this.stufeStore.loadAll();
    effect(() => {
      const slugs = this.stufeStore.stufen().map(s => s.slug!).filter(Boolean);
      if (slugs.length) {
        this.uebungStore.loadForStufen(slugs);
      }
    });
  }

  protected stufeName(slug?: string): string {
    return this.stufeStore.stufen().find(s => s.slug === slug)?.name ?? slug ?? '—';
  }

  protected formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  protected formatTime(t?: LocalTime): string {
    return timeToString(t) || '—';
  }

  protected openCreate(): void {
    this.editingId = null;
    this.dialogMode.set('create');
    this.form.reset();
    this.uebungDialog.open();
  }

  protected openEdit(u: UebungDto): void {
    this.editingId = u.id ?? null;
    this.dialogMode.set('edit');
    this.form.patchValue({
      stufeSlug: u.stufeSlug ?? '',
      date: u.date ?? '',
      motto: u.motto ?? '',
      tenue: u.tenue ?? '',
      antretenTime: timeToString(u.antretenTime),
      antretenLocation: u.antretenLocation ?? '',
      abtretenTime: timeToString(u.abtretenTime),
      abtretenLocation: u.abtretenLocation ?? '',
      mitnehmen: u.mitnehmen ?? '',
      weiteres: u.weiteres ?? '',
    });
    this.uebungDialog.open();
  }

  protected async save(): Promise<void> {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    const v = this.form.getRawValue();
    const req = {
      date: v.date || undefined,
      motto: v.motto || undefined,
      tenue: v.tenue || undefined,
      antretenTime: stringToTime(v.antretenTime ?? ''),
      antretenLocation: v.antretenLocation || undefined,
      abtretenTime: stringToTime(v.abtretenTime ?? ''),
      abtretenLocation: v.abtretenLocation || undefined,
      mitnehmen: v.mitnehmen || undefined,
      weiteres: v.weiteres || undefined,
    };
    try {
      if (this.dialogMode() === 'create') {
        await this.uebungStore.create(v.stufeSlug!, req);
      } else if (this.editingId !== null) {
        await this.uebungStore.update(this.editingId, req);
      }
      this.uebungDialog.close();
    } finally {
      this.saving.set(false);
    }
  }

  protected confirmDelete(id: number): void {
    this.deleteTargetId.set(id);
    this.deleteDialog.open();
  }

  protected async doDelete(): Promise<void> {
    const id = this.deleteTargetId();
    if (id === null || this.deleting()) return;
    this.deleting.set(true);
    try {
      await this.uebungStore.delete(id);
      this.deleteDialog.close();
    } finally {
      this.deleting.set(false);
      this.deleteTargetId.set(null);
    }
  }

  protected async toggleStatus(u: UebungDto): Promise<void> {
    if (!u.id) return;
    const next = u.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    await this.uebungStore.setStatus(u.id, next);
  }
}
