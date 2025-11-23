declare global {
  namespace Utils {
    type DefaultRecursionLimit = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    /**
     * Utiliy type to test if a string mathes a specified pattern.
     *
     * @example
     * ```typescript
     * type Match = MatchPattern<'/some-string/', `/${string}/`> // -> true
     * type Match = MatchPattern<'some-string', `/${string}/`> // -> false
     * ```
     */
    type MatchPattern<S extends string, P> = S extends P ? true : false;

    /**
     * Utility type to create a tuple of strings by  splitting a string `S` by delimiter `D` into a tuple of strings.
     *
     * @example
     * ```typescript
     * type Parts = Split<'/users/some-id/edit', '/'>  // -> ["", "users", "some-id", "edit"]
     * type Parts = Split<'dot.concatenated.string', '.'> //  -> ["dot", "concatenated", "string"]
     * ```
     */
    type Split<
      S extends string,
      D extends string
    > = S extends `${infer Head}${D}${infer Tail}`
      ? [Head, ...Split<Tail, D>]
      : [S];
  }
}

// Ensures file is treated as module
export {};
