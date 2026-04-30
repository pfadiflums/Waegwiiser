import { Uebung } from './uebung.model';

export interface LeaderResponse {
  id: string;
  pfadiname: string;
  vorname: string;
  nachname: string;
  bildId?: string;
}

export interface Stufe {
  id: string;
  name: string;
  slug: string;
  slogan: string | null;
  beschreibung: string | null;
  color: string;
  calendarUrl?: string;
  imageId: string | null;
  sortOrder: number;
  isActive: boolean;
  stammLeiter: LeaderResponse[];
  nextUebung: Uebung | null;
}

export interface CreateStufeRequest {
  name: string;
  slug: string;
  slogan?: string;
  beschreibung?: string;
  color?: string;
  calendarUrl?: string;
  imageId?: string;
  stammLeiter?: string[];
  sortOrder: number;
}

export interface UpdateStufeRequest {
  name?: string;
  slug?: string;
  slogan?: string;
  beschreibung?: string;
  color?: string;
  calendarUrl?: string;
  imageId?: string;
  stammLeiter?: string[];
  sortOrder?: number;
  isActive?: boolean;
}
