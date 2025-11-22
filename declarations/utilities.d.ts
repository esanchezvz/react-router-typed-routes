namespace Utilities {
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
