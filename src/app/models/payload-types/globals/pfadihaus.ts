/* tslint:disable */
/* eslint-disable */
import { Media } from '../collections/media';

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pfadihaus-page".
 */
export interface PfadihausPage {
  id: string;
  beschreibung?: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  fotos?:
    | {
        bild?: (string | null) | Media;
        id?: string | null;
      }[]
    | null;
  adresse?: string | null;
  belegungskalenderLink?: string | null;
  reservationsLink?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pfadihaus-page_select".
 */
export interface PfadihausPageSelect<T extends boolean = true> {
  beschreibung?: T;
  fotos?:
    | T
    | {
        bild?: T;
        id?: T;
      };
  adresse?: T;
  belegungskalenderLink?: T;
  reservationsLink?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
