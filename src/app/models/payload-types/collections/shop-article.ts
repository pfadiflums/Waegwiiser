/* eslint-disable */
import { Media } from './media';

export interface ShopArticle {
  id: string;
  name: string;
  preis?: string | null;
  beschreibung?: string | null;
  bild?: (string | null) | Media;
  /**
   * Link zum Formular
   */
  bestellLink?: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface ShopArticlesSelect<T extends boolean = true> {
  name?: T;
  preis?: T;
  beschreibung?: T;
  bild?: T;
  bestellLink?: T;
  updatedAt?: T;
  createdAt?: T;
}
