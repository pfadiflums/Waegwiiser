/* eslint-disable */
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

export interface DownloadsPageSelect<T extends boolean = true> {
  intro?: T;
  googleDriveRootLink?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
