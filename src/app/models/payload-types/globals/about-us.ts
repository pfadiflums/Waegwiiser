/* eslint-disable */
import { Leitende } from '../collections/leitende';

export interface AboutUs {
  id: string;
  geschichte?: {
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
  abteilungsleitung?: (string | Leitende)[] | null;
  akTeam?: (string | Leitende)[] | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}

export interface AboutUsSelect<T extends boolean = true> {
  geschichte?: T;
  abteilungsleitung?: T;
  akTeam?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
