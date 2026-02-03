/* tslint:disable */
/* eslint-disable */
import { User } from './user';
import { Role } from './role';
import { Media } from './media';
import { Download } from './download';
import { PhotoAlbum } from './photo-album';
import { ShopArticle } from './shop-article';
import { Stufen } from './stufen';
import { Uebungen } from './uebungen';

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-kv".
 */
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

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'roles';
        value: string | Role;
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

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
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

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-kv_select".
 */
export interface PayloadKvSelect<T extends boolean = true> {
  key?: T;
  data?: T;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
