/* eslint-disable */
import { Leitende } from '../collections/leitende';

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
  kontaktAnsprechpartner?: (string | null) | Leitende;
  updatedAt?: string | null;
  createdAt?: string | null;
}

export interface JoinUsSelect<T extends boolean = true> {
  introText?: T;
  videoUrl?: T;
  starterListe?: T;
  kontaktAnsprechpartner?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
