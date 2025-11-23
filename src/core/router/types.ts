import type { Register } from "react-router";

// Access the generated Pages type from react-router
type Pages = Register extends { pages: infer P } ? P : {};

type ReplaceParams<T extends string> =
  T extends `${infer Start}/:${infer Param}/${infer Rest}`
    ? `${Start}/${string}/${ReplaceParams<Rest>}`
    : T extends `${infer Start}/:${infer Param}`
    ? `${Start}/${string}`
    : T;

type IsParam<S extends string> = S extends `:${string}` ? true : false;

// Match route segments recursively
export type MatchRouteSegments<
  Pattern extends string[],
  Candidate extends string[],
  Depth extends any[] = Utils.DefaultRecursionLimit
> = Pattern extends []
  ? Candidate extends []
    ? true
    : false
  : Depth["length"] extends 0
  ? false // Recursion limit reached
  : Pattern["length"] extends Candidate["length"]
  ? Pattern extends [infer PHead, ...infer PTail]
    ? Candidate extends [infer CHead, ...infer CTail]
      ? PHead extends string
        ? CHead extends string
          ? IsParam<PHead> extends true
            ? CHead extends ""
              ? false
              : MatchRouteSegments<
                  PTail extends string[] ? PTail : [],
                  CTail extends string[] ? CTail : [],
                  Depth extends [any, ...infer Rest] ? Rest : []
                >
            : PHead extends CHead
            ? MatchRouteSegments<
                PTail extends string[] ? PTail : [],
                CTail extends string[] ? CTail : [],
                Depth extends [any, ...infer Rest] ? Rest : []
              >
            : false
          : false
        : false
      : never
    : never
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
  /**
   * Loose type for valid route autocomplete
   */
  type AppRoutePath = ReplaceParams<RouteDefinition>;

  /** Strict type validation for strings to match valid routes */
  type AppRoute<T extends string> = T extends ValidateRoute<T> ? T : never;

  type RouteDefinition = keyof Pages;
}
