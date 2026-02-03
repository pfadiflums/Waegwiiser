/* tslint:disable */
/* eslint-disable */
import { User } from '../collections/user';

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "join-us".
 */
export interface JoinUs {
  id: string;
  introText?: {
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
  /**
   * Evtl. neues Video?
   */
  videoUrl?: string | null;
  /**
   * Was braucht man zu Beginn?
   */
  starterListe?: {
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
  kontaktAnsprechpartner?: (string | null) | User;
  updatedAt?: string | null;
  createdAt?: string | null;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "join-us_select".
 */
export interface JoinUsSelect<T extends boolean = true> {
  introText?: T;
  videoUrl?: T;
  starterListe?: T;
  kontaktAnsprechpartner?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
