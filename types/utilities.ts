declare global {
  namespace Utils {
    type DefaultRecursionLimit = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
