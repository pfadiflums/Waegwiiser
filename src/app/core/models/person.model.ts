export type PersonStufeRolle =
  | 'LEITER'
  | 'STUFENLEITER'
  | 'ABTEILUNGSLEITER'
  | 'PRAESIDENT'
  | 'KASSIERERIN'
  | 'AKTUARIN'
  | 'HAUSVERWALTUNG'
  | 'MATERIALWART';

export interface LinkedUserResponse {
  id: string;
  email: string;
  username: string;
  roles: string[];
}

export interface StufeAssignmentInfo {
  id: string;
  stufeId: string;
  rolle: PersonStufeRolle;
  startDate?: string;
  endDate?: string;
  active: boolean;
}

export interface PersonResponse {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  profilePictureUrl?: string;
  bio?: string;
  stufeAssignments: StufeAssignmentInfo[];
  linkedUser?: LinkedUserResponse;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePersonRequest {
  firstName: string;
  lastName: string;
  nickname?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  linkedAccountId?: string;
}

export interface UpdatePersonProfileRequest {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  bio?: string;
}

export interface AssignStufeRequest {
  stufeId: string;
  rolle: PersonStufeRolle;
}

export interface PageResponsePersonResponse {
  items: PersonResponse[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
