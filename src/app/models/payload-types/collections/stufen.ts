/* eslint-disable */
import { Media } from './media';
import { Leitende } from './leitende';

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
  stammLeiter?: (string | Leitende)[] | null;
  slug: string;
  updatedAt: string;
  createdAt: string;
  color?: string | null;
}

export interface StufenSelect<T extends boolean = true> {
  name?: T;
  slogan?: T;
  beschreibung?: T;
  image?: T;
  stammLeiter?: T;
  slug?: T;
  updatedAt?: T;
  createdAt?: T;
}
