export interface AbteilungMember {
  pfadiName: string;
  roles: string[];
  imageUrl?: string;
}

export interface AbteilungPageContent {
  titleLines: string[];
  description: string;
  aufgaben?: string[];
  members: AbteilungMember[];
}
