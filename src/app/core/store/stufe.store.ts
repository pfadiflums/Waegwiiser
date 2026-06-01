import { computed, inject, Injectable, signal } from '@angular/core';
import { Api } from '../../api/api';
import { assignLeiter } from '../../api/fn/stufen/assign-leiter';
import { create } from '../../api/fn/stufen/create';
import { getBySlug } from '../../api/fn/stufen/get-by-slug';
import { listAll } from '../../api/fn/stufen/list-all';
import { removeLeiter } from '../../api/fn/stufen/remove-leiter';
import { update1 } from '../../api/fn/stufen/update-1';
import { AssignLeiterRequest } from '../../api/models/assign-leiter-request';
import { StufeDetailDto } from '../../api/models/stufe-detail-dto';
import { StufeOverviewDto } from '../../api/models/stufe-overview-dto';
import { StufeRequest } from '../../api/models/stufe-request';

interface StufeState {
  stufen: StufeOverviewDto[];
  details: Record<string, StufeDetailDto>;
  isLoading: boolean;
  loaded: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class StufeStore {
  private readonly api = inject(Api);

  private readonly _state = signal<StufeState>({
    stufen: [],
    details: {},
    isLoading: false,
    loaded: false,
    error: null,
  });

  readonly stufen = computed(() => this._state().stufen);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly loaded = computed(() => this._state().loaded);
  readonly error = computed(() => this._state().error);
  readonly details = computed(() => this._state().details);

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

  async loadDetail(slug: string): Promise<void> {
    const r = await this.api.invoke$Response(getBySlug, { slug });
    if (r.body) {
      this._state.update(s => ({
        ...s,
        details: { ...s.details, [slug]: r.body! },
      }));
    }
  }

  async create(req: StufeRequest): Promise<void> {
    const r = await this.api.invoke$Response(create, { body: req });
    if (r.body) {
      this._state.update(s => ({ ...s, stufen: [...s.stufen, r.body!] }));
    }
  }

  async update(slug: string, req: StufeRequest): Promise<void> {
    const r = await this.api.invoke$Response(update1, { slug, body: req });
    if (r.body) {
      this._state.update(s => ({
        ...s,
        stufen: s.stufen.map(st => (st.slug === slug ? r.body! : st)),
      }));
    }
  }

  async assignLeiter(slug: string, req: AssignLeiterRequest): Promise<void> {
    await this.api.invoke$Response(assignLeiter, { slug, body: req });
    await this.loadDetail(slug);
  }

  async removeLeiter(slug: string, leiterId: number): Promise<void> {
    await this.api.invoke$Response(removeLeiter, { slug, id: leiterId });
    this._state.update(s => {
      const detail = s.details[slug];
      if (!detail) return s;
      return {
        ...s,
        details: {
          ...s.details,
          [slug]: {
            ...detail,
            leitungsteam: (detail.leitungsteam ?? []).filter(l => l.id !== leiterId),
          },
        },
      };
    });
  }
}
