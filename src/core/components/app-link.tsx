import { NavLink, type NavLinkRenderProps, type To } from "react-router";

const linkClassName = ({ isActive }: NavLinkRenderProps) =>
  `${
    isActive
      ? "underline underline-offset-4 text-yellow-500"
      : "hover:text-yellow-500 transition-colors"
  }`;

type AppLinkProps = {
  children: React.ReactNode;
  to: To;
};

export const AppLink = ({ children, to }: AppLinkProps) => {
  return (
    <NavLink className={linkClassName} to={to}>
      {children}
    </NavLink>
  );
};
