/* eslint-disable */
export interface User {
  id: string;
  midataId?: string | null;
  role: 'admin' | 'leader' | 'member';
  oauthLinks?:
    | {
        strategy?: string | null;
        sub?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  sessions?:
    | {
        id: string;
        createdAt?: string | null;
        expiresAt: string;
      }[]
    | null;
  password?: string | null;
}

export interface UsersSelect<T extends boolean = true> {
  midataId?: T;
  role?: T;
  oauthLinks?:
    | T
    | {
        strategy?: T;
        sub?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
  sessions?:
    | T
    | {
        id?: T;
        createdAt?: T;
        expiresAt?: T;
      };
}
