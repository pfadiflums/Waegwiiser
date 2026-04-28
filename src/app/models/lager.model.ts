export type LagerType = 'SOLA' | 'WOLA' | 'PFILA' | 'KALA' | 'WEEKEND' | 'OTHER';
export type LagerStatus = 'DRAFT' | 'PUBLISHED' | 'REGISTRATION_OPEN' |
                          'REGISTRATION_CLOSED' | 'COMPLETED' | 'CANCELLED';

export interface Lager {
  id: string;
  name: string;
  slug: string;
  lagerType: LagerType;
  beschreibung?: string;
  startDatum: string;
  endDatum: string;
  location: string;
  maxTeilnehmer?: number;
  kosten?: number;
  anmeldungStart?: string;
  anmeldungEnde?: string;
  anmeldungUrl?: string;
  coverImageId?: string;
  status: LagerStatus;
  registrationOpen: boolean;
  stufeIds: string[];
  galleryImageIds: string[];
  createdAt: string;
}

export interface CreateLagerRequest {
  name: string;
  slug: string;
  lagerType: LagerType;
  beschreibung?: string;
  startDatum: string;
  endDatum: string;
  location?: string;
  maxTeilnehmer?: number;
  kosten?: number;
  anmeldungStart?: string;
  anmeldungEnde?: string;
  anmeldungUrl?: string;
  coverImageId?: string;
  stufeIds?: string[];
}

export interface UpdateLagerRequest {
  name?: string;
  lagerType?: LagerType;
  beschreibung?: string;
  startDatum?: string;
  endDatum?: string;
  location?: string;
  maxTeilnehmer?: number;
  kosten?: number;
  anmeldungStart?: string;
  anmeldungEnde?: string;
  anmeldungUrl?: string;
  coverImageId?: string;
  status?: LagerStatus;
  stufeIds?: string[];
}
