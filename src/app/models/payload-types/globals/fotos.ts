/* eslint-disable */
export interface FotosPage {
  id: string;
  /**
   * Info zur Sortierung nach Jahren/Lagern
   */
  intro?: {
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
  updatedAt?: string | null;
  createdAt?: string | null;
}

export interface FotosPageSelect<T extends boolean = true> {
  intro?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
