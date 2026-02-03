/* tslint:disable */
/* eslint-disable */
import { Stufen } from './stufen';
import { User } from './user';

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "uebungen".
 */
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
  anwesendeLeiter?: (string | User)[] | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "uebungen_select".
 */
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
