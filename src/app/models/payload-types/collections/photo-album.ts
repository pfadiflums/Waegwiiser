/* eslint-disable */
import { Media } from './media';

export interface PhotoAlbum {
  id: string;
  titel: string;
  jahr?: number | null;
  googleFotosLink: string;
  vorschaubild?: (string | null) | Media;
  updatedAt: string;
  createdAt: string;
}

export interface PhotoAlbumsSelect<T extends boolean = true> {
  titel?: T;
  jahr?: T;
  googleFotosLink?: T;
  vorschaubild?: T;
  updatedAt?: T;
  createdAt?: T;
}
