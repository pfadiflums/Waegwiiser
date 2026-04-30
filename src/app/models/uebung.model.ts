export interface Uebung {
  id: string;
  stufeIds: string[];
  datum: string;
  antretenZeit?: string;
  antretenOrt?: string;
  abtretenZeit?: string;
  abtretenOrt?: string;
  motto?: string;
  tenue?: string;
  mitnehmen?: string;
  weiteres?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUebungRequest {
  stufeIds: string[];
  datum: string;
  antretenZeit?: string;
  antretenOrt?: string;
  abtretenZeit?: string;
  abtretenOrt?: string;
  motto?: string;
  tenue?: string;
  mitnehmen?: string;
  weiteres?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
}

export interface UebungenListResponse {
  items: Uebung[];
  nextUebungId: string | null;
}

export interface UpdateUebungRequest {
  stufeIds?: string[];
  datum?: string;
  antretenZeit?: string;
  antretenOrt?: string;
  abtretenZeit?: string;
  abtretenOrt?: string;
  motto?: string;
  tenue?: string;
  mitnehmen?: string;
  weiteres?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
}
