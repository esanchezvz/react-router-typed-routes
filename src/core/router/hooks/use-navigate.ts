import { useNavigate as useRouterNavigate, type NavigateOptions } from "react-router";

export const useNavigate = () => {
  const navigate = useRouterNavigate();

  return <T extends ApplicationRouter.RoutePath>(
    to: ApplicationRouter.Route<T> | number,
    options?: NavigateOptions
  ) => {
    if (typeof to === "number") {
      return navigate(to);
    }
    return navigate(to, options);
  };
}
