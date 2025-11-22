namespace ApplicationRouter {
  // Access the generated Pages type from react-router
  type Pages = import("react-router").Register extends { pages: infer P }
    ? P
    : {};

  type RouteDefinition = keyof Pages;

  type ReplaceParams<T extends string> =
    T extends `${infer Start}/:${infer Param}/${infer Rest}`
      ? `${Start}/${string}/${ReplaceParams<Rest>}`
      : T extends `${infer Start}/:${infer Param}`
      ? `${Start}/${string}`
      : T;

  /**
   * Loose type for valid route autocomplete
   */
  export type RoutePath = ReplaceParams<RouteDefinition>;

  type IsParam<S extends string> = S extends `:${string}` ? true : false;

  // Match route segments recursively
  type MatchRouteSegments<
    Pattern extends string[],
    Candidate extends string[]
  > = Pattern["length"] extends Candidate["length"]
    ? Pattern extends [infer PHead, ...infer PTail]
      ? Candidate extends [infer CHead, ...infer CTail]
        ? PHead extends string
          ? CHead extends string
            ? IsParam<PHead> extends true
              ? CHead extends ""
                ? false
                : MatchRouteSegments<
                    PTail extends string[] ? PTail : [],
                    CTail extends string[] ? CTail : []
                  >
              : PHead extends CHead
              ? MatchRouteSegments<
                  PTail extends string[] ? PTail : [],
                  CTail extends string[] ? CTail : []
                >
              : false
            : false
          : false
        : true // Both empty
      : true
    : false;

  // Validate a candidate string against all Pages
  type ValidateRoute<T extends string> = {
    [P in RouteDefinition]: MatchRouteSegments<
      Utilities.Split<P, "/">,
      Utilities.Split<T, "/">
    > extends true
      ? T
      : never;
  }[RouteDefinition];

  /** Strict type validation for strings to match valid routes */
  type Route<T extends string> = T extends ValidateRoute<T> ? T : never;
}
