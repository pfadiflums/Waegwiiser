/* tslint:disable */
/* eslint-disable */
import { Media } from './media';
import { User } from './user';

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "stufen".
 */
export interface Stufen {
  id: string;
  name: string;
  slogan?: string | null;
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
  image?: (string | null) | Media;
  stammLeiter?: (string | User)[] | null;
  slug: string;
  color?: string | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "stufen_select".
 */
export interface StufenSelect<T extends boolean = true> {
  name?: T;
  slogan?: T;
  beschreibung?: T;
  image?: T;
  stammLeiter?: T;
  slug?: T;
  color?: T;
  updatedAt?: T;
  createdAt?: T;
}
