import { computed, inject, Injectable, signal } from '@angular/core';
import { Api } from '../../api/api';
import { create1 } from '../../api/fn/uebungen/create-1';
import { delete$ } from '../../api/fn/uebungen/delete';
import { setStatus } from '../../api/fn/uebungen/set-status';
import { update } from '../../api/fn/uebungen/update';
import { listUebungen } from '../../api/fn/stufen/list-uebungen';
import { UebungCreateRequest } from '../../api/models/uebung-create-request';
import { UebungDto } from '../../api/models/uebung-dto';

interface UebungState {
  uebungen: UebungDto[];
  isLoading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class UebungStore {
  private readonly api = inject(Api);

  private readonly _state = signal<UebungState>({
    uebungen: [],
    isLoading: false,
    error: null,
  });

  readonly uebungen = computed(() => this._state().uebungen);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);

  async loadForStufen(slugs: string[]): Promise<void> {
    if (!slugs.length) return;
    this._state.update(s => ({ ...s, isLoading: true, error: null }));
    try {
      const results = await Promise.all(
        slugs.map(slug => this.api.invoke$Response(listUebungen, { slug })),
      );
      this._state.update(s => ({
        ...s,
        uebungen: results.flatMap(r => r.body ?? []),
        isLoading: false,
      }));
    } catch {
      this._state.update(s => ({
        ...s,
        isLoading: false,
        error: 'Fehler beim Laden der Übungen.',
      }));
    }
  }

  async create(stufeSlug: string, req: UebungCreateRequest): Promise<void> {
    const r = await this.api.invoke$Response(create1, { slug: stufeSlug, body: req });
    if (r.body) {
      this._state.update(s => ({ ...s, uebungen: [...s.uebungen, r.body!] }));
    }
  }

  async update(id: number, req: UebungCreateRequest): Promise<void> {
    const r = await this.api.invoke$Response(update, { id, body: req });
    if (r.body) {
      this._state.update(s => ({
        ...s,
        uebungen: s.uebungen.map(u => (u.id === id ? r.body! : u)),
      }));
    }
  }

  async delete(id: number): Promise<void> {
    await this.api.invoke$Response(delete$, { id });
    this._state.update(s => ({ ...s, uebungen: s.uebungen.filter(u => u.id !== id) }));
  }

  async setStatus(id: number, status: 'DRAFT' | 'PUBLISHED'): Promise<void> {
    const r = await this.api.invoke$Response(setStatus, { id, body: { status } });
    if (r.body) {
      this._state.update(s => ({
        ...s,
        uebungen: s.uebungen.map(u => (u.id === id ? r.body! : u)),
      }));
    }
  }
}
