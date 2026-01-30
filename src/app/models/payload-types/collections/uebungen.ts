/* eslint-disable */
import { Stufen } from './stufen';
import { Leitende } from './leitende';

export interface Uebungen {
  id: string;
  motto: string;
  datum: string;
  antretenZeit?: string | null;
  antretenOrt?: string | null;
  abtretenZeit?: string | null;
  abtretenOrt?: string | null;
  tenue?: string | null;
  mitnehmen?: string | null;
  weiteres?: string | null;
  stufen: (string | Stufen)[];
  anwesendeLeiter?: (string | Leitende)[] | null;
  updatedAt: string;
  createdAt: string;
}

export interface UebungenSelect<T extends boolean = true> {
  motto?: T;
  datum?: T;
  antretenZeit?: T;
  antretenOrt?: T;
  abtretenZeit?: T;
  abtretenOrt?: T;
  tenue?: T;
  mitnehmen?: T;
  weiteres?: T;
  stufen?: T;
  anwesendeLeiter?: T;
  updatedAt?: T;
  createdAt?: T;
}
