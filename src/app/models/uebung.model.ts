export interface Uebung {
  id: string;
  stufeId: string;
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
  stufeId: string;
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
