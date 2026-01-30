/* eslint-disable */
import { Media } from './media';

export interface Leitende {
  id: string;
  pfadiname: string;
  vorname?: string | null;
  nachname?: string | null;
  /**
   * z.B. Stufenleiter, Materialwart
   */
  funktion?: string | null;
  bild?: (string | null) | Media;
  email?: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface LeitendeSelect<T extends boolean = true> {
  pfadiname?: T;
  vorname?: T;
  nachname?: T;
  funktion?: T;
  bild?: T;
  email?: T;
  updatedAt?: T;
  createdAt?: T;
}
