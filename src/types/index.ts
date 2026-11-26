export type NavLink = {
  label: string;
  href: string;
  /** Optional one-line description (used in nav dropdowns). */
  description?: string;
};

export type NavItem = NavLink & {
  children?: NavLink[];
};
