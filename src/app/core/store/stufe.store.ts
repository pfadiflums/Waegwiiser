import { Injectable, computed, inject, signal } from '@angular/core';
import { Api } from '../../api/api';
import { listAll } from '../../api/fn/stufen/list-all';
import { StufeOverviewDto } from '../../api/models/stufe-overview-dto';

interface StufeState {
  stufen: StufeOverviewDto[];
  isLoading: boolean;
  loaded: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class StufeStore {
  private readonly api = inject(Api);

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

  loadAll(): void {
    const { loaded, isLoading } = this._state();
    if (loaded || isLoading) return;

    this._state.update(s => ({ ...s, isLoading: true, error: null }));
    this.api.invoke$Response(listAll).then(
      response => this._state.update(s => ({
        ...s,
        stufen: response.body ?? [],
        isLoading: false,
        loaded: true,
      })),
      () => this._state.update(s => ({
        ...s,
        isLoading: false,
        error: 'Fehler beim Laden der Stufen.',
      })),
    );
  }
}
