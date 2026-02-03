/* tslint:disable */
/* eslint-disable */
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "roles".
 */
export interface Role {
  id: string;
  name: string;
  /**
   * z.B. admin, al, stulei, leiter, praesident
   */
  slug: string;
  description?: string | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "roles_select".
 */
export interface RolesSelect<T extends boolean = true> {
  name?: T;
  slug?: T;
  description?: T;
  updatedAt?: T;
  createdAt?: T;
}
