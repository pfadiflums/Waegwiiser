/* eslint-disable */
export interface Home {
  id: string;
  heroTitle?: string | null;
  heroDescription?: string | null;
  instagramLink?: string | null;
  quickLinks?: {
    mitgliedWerdenText?: string | null;
    stufenUebersichtText?: string | null;
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}

export interface HomeSelect<T extends boolean = true> {
  heroTitle?: T;
  heroDescription?: T;
  instagramLink?: T;
  quickLinks?:
    | T
    | {
        mitgliedWerdenText?: T;
        stufenUebersichtText?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
