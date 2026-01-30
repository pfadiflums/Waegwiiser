/* eslint-disable */
import { Media } from './media';

export interface Download {
  id: string;
  titel: string;
  kategorie?: ('Statuten' | 'Jahresprogramm' | 'Beitrittserklärung' | 'Jüsti' | 'Zeitungen' | 'Sonstiges') | null;
  typ?: ('file' | 'link') | null;
  datei?: (string | null) | Media;
  url?: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface DownloadsSelect<T extends boolean = true> {
  titel?: T;
  kategorie?: T;
  typ?: T;
  datei?: T;
  url?: T;
  updatedAt?: T;
  createdAt?: T;
}
