import { Injectable, computed, inject, signal } from '@angular/core';
import { Stufe } from '../models/stufe.model';
import { StufeService } from '../services/stufe.service';

interface StufeState {
  stufen: Stufe[];
  isLoading: boolean;
  loaded: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class StufeStore {
  private readonly stufeService = inject(StufeService);

  private readonly _state = signal<StufeState>({
    stufen: [],
    isLoading: false,
    loaded: false,
    error: null,
  });

  readonly stufen = computed(() => this._state().stufen);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly loaded = computed(() => this._state().loaded);
  readonly error = computed(() => this._state().error);

  readonly stufeBySlug = computed<Record<string, Stufe>>(() =>
    Object.fromEntries(this._state().stufen.map(s => [s.slug, s]))
  );

  loadAll(): void {
    const { loaded, isLoading } = this._state();
    if (loaded || isLoading) return;

    this._state.update(s => ({ ...s, isLoading: true, error: null }));
    this.stufeService.getAll().subscribe({
      next: stufen => this._state.update(s => ({ ...s, stufen, isLoading: false, loaded: true })),
      error: () => this._state.update(s => ({
        ...s,
        isLoading: false,
        error: 'Fehler beim Laden der Stufen.',
      })),
    });
  }
}
