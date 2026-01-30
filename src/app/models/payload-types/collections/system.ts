/* eslint-disable */
import { User } from './user';
import { Media } from './media';
import { Download } from './download';
import { Leitende } from './leitende';
import { PhotoAlbum } from './photo-album';
import { ShopArticle } from './shop-article';
import { Stufen } from './stufen';
import { Uebungen } from './uebungen';

export interface PayloadKv {
  id: string;
  key: string;
  data:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
}

export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'media';
        value: string | Media;
      } | null)
    | ({
        relationTo: 'downloads';
        value: string | Download;
      } | null)
    | ({
        relationTo: 'leitende';
        value: string | Leitende;
      } | null)
    | ({
        relationTo: 'photo-albums';
        value: string | PhotoAlbum;
      } | null)
    | ({
        relationTo: 'shop-articles';
        value: string | ShopArticle;
      } | null)
    | ({
        relationTo: 'stufen';
        value: string | Stufen;
      } | null)
    | ({
        relationTo: 'uebungen';
        value: string | Uebungen;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}

export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}

export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}

export interface PayloadKvSelect<T extends boolean = true> {
  key?: T;
  data?: T;
}

export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}

export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}

export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
