/* tslint:disable */
/* eslint-disable */
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "downloads-page".
 */
export interface DownloadsPage {
  id: string;
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
  googleDriveRootLink?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "downloads-page_select".
 */
export interface DownloadsPageSelect<T extends boolean = true> {
  intro?: T;
  googleDriveRootLink?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
