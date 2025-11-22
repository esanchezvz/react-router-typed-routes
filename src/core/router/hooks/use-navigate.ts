import { useNavigate, type NavigateOptions } from "react-router";

export function useSafeNavigate() {
  const navigate = useNavigate();

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
