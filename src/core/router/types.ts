import type { Register } from "react-router";

// Access the generated Pages type from react-router
type Pages = Register extends { pages: infer P } ? P : {};

type ReplaceParams<T extends string> =
  T extends `${infer Start}/:${string}/${infer Rest}`
    ? `${Start}/${string}/${ReplaceParams<Rest>}`
    : T extends `${infer Start}/:${string}`
    ? `${Start}/${string}`
    : T;

type IsParam<S extends string> = Utils.MatchPattern<S, `:${string}`>;

// Match route segments recursively
type MatchRouteSegments<
  Pattern extends string[],
  Candidate extends string[],
  Depth extends any[] = Utils.DefaultRecursionLimit
> = Depth["length"] extends 0
  ? false // Recursion limit reached
  : Utils.ConsumeMatchingSegments<Pattern, Candidate> extends {
      RemainingPattern: infer RemPattern extends string[];
      RemainingCandidate: infer RemCandidate extends string[];
    }
  ? RemPattern extends []
    ? RemCandidate extends []
      ? true
      : false
    : RemPattern extends [
        infer PHead extends string,
        ...infer PTail extends string[]
      ]
    ? IsParam<PHead> extends true
      ? RemCandidate extends [infer CHead, ...infer CTail extends string[]]
        ? CHead extends ""
          ? false
          : MatchRouteSegments<
              PTail,
              CTail,
              Depth extends [any, ...infer Rest] ? Rest : []
            >
        : false
      : false
    : false
  : false;

// Validate a candidate string against all Pages
type ValidateRoute<T extends string> = {
  [P in RouteDefinition]: MatchRouteSegments<
    Utils.Split<P, "/">,
    Utils.Split<T, "/">
  > extends true
    ? T
    : never;
}[RouteDefinition];

declare global {
  type RouteDefinition = keyof Pages;

  /**
   * Loose type for valid route autocomplete
   */
  type AppRoutePath = ReplaceParams<RouteDefinition>;

  /** Strict type validation for strings to match valid routes */
  type AppRoute<T extends string> = T extends ValidateRoute<T> ? T : never;
}
