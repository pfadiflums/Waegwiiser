/* tslint:disable */
/* eslint-disable */
import { User } from '../collections/user';

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "about-us".
 */
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
  abteilungsleitung?: (string | User)[] | null;
  akTeam?: (string | User)[] | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "about-us_select".
 */
export interface AboutUsSelect<T extends boolean = true> {
  geschichte?: T;
  abteilungsleitung?: T;
  akTeam?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
