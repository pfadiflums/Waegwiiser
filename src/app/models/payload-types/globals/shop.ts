/* tslint:disable */
/* eslint-disable */
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "shop-page".
 */
export interface ShopPage {
  id: string;
  einleitung?: {
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
   * z.B. Info zur 1. Krawatte / Technix
   */
  infoText?: string | null;
  bestellformularLink?: string | null;
  kontaktDaten?: {
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

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "shop-page_select".
 */
export interface ShopPageSelect<T extends boolean = true> {
  einleitung?: T;
  infoText?: T;
  bestellformularLink?: T;
  kontaktDaten?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
