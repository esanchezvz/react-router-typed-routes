import {
  NavLink as RRNavLink,
  Link as RRLink,
  type NavLinkRenderProps,
  type NavLinkProps as RRNavLinkProps,
  type LinkProps as RRLinkProps,
  type Path,
} from "react-router";

const linkClassName = ({ isActive }: NavLinkRenderProps) =>
  `${
    isActive
      ? "underline underline-offset-4 text-yellow-500"
      : "hover:text-yellow-500 transition-colors"
  }`;

export interface NavLinkProps<T extends AppRoutePath> extends RRNavLinkProps {
  to: AppRoute<T> | Partial<Path>;
}

export const NavLink = <T extends AppRoutePath>(props: NavLinkProps<T>) => (
  <RRNavLink className={linkClassName} {...props} />
);

export interface LinkProps<T extends AppRoutePath> extends RRLinkProps {
  to: AppRoute<T> | Partial<Path>;
}

export const Link = <T extends AppRoutePath>(props: LinkProps<T>) => (
  <RRLink {...props} />
);
