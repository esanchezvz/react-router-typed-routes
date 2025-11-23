declare global {
  namespace Utils {
    type DefaultRecursionLimit = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    /**
     * Utility type that matches static segments of a pattern against a candidate.
     * It consumes matching static segments and returns the remaining parts of both
     * the pattern and the candidate.
     *
     * @example
     * ```typescript
     * // Exact match
     * type T1 = ConsumeMatchingSegments<["users", "settings"], ["users", "settings"]>
     * // -> { RemainingPattern: [], RemainingCandidate: [] }
     *
     * // Partial match
     * type T2 = ConsumeMatchingSegments<["users", ":id"], ["users", "123"]>
     * // -> { RemainingPattern: [":id"], RemainingCandidate: ["123"] }
     *
     * // Mismatch
     * type T3 = ConsumeMatchingSegments<["users", "settings"], ["users", "profile"]>
     * // -> { RemainingPattern: ["settings"], RemainingCandidate: ["profile"] }
     * ```
     */
    type ConsumeMatchingSegments<
      Pattern extends string[],
      Candidate extends string[]
    > = Pattern extends [infer PHead, ...infer PTail extends string[]]
      ? Candidate extends [infer CHead, ...infer CTail extends string[]]
        ? PHead extends CHead
          ? ConsumeMatchingSegments<PTail, CTail>
          : { RemainingPattern: Pattern; RemainingCandidate: Candidate }
        : { RemainingPattern: Pattern; RemainingCandidate: Candidate }
      : { RemainingPattern: Pattern; RemainingCandidate: Candidate };

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
