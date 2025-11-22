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

export interface NavLinkProps<T extends ApplicationRouter.RoutePath> extends RRNavLinkProps {
  to: ApplicationRouter.Route<T> | Partial<Path>;
}

export const NavLink = <T extends ApplicationRouter.RoutePath>(props: NavLinkProps<T>) => (
  <RRNavLink className={linkClassName} {...props} />
);

export interface LinkProps<T extends ApplicationRouter.RoutePath> extends RRLinkProps {
  to: ApplicationRouter.Route<T> | Partial<Path>;
}

export const Link = <T extends ApplicationRouter.RoutePath>(props: LinkProps<T>) => (
  <RRLink {...props} />
);
