# React Router v7 Type Safety Explanation

This document explains the type safety implementation for React Router v7, specifically how `src/types/route-paths.d.ts` works and why helper functions are necessary for strict validation.

## 1. High-Level Overview

### `Pages` Type

```typescript
type Pages = import("react-router").Register extends { pages: infer P }
  ? P
  : {};
```

We extract the `Pages` type from React Router's global `Register` interface. This type contains all your declared routes (e.g., `"/posts/:slug"`).

### `RoutePath` (The "Loose" Type)

```typescript
type RoutePath = ReplaceParams<keyof Pages & string>;
```

This type transforms route keys into template literal types.

- **Input**: `"/posts/:slug"`
- **Output**: `"/posts/${string}"`

**Purpose**: It provides excellent **autocomplete** in your IDE.
**Limitation**: TypeScript's template literal types are "greedy". `"/posts/${string}"` matches `"/posts/my-slug"`, but it _also_ matches `"/posts/my-slug/extra/segments"`. This is why `RoutePath` alone isn't strictly type-safe.

### `Route<T>` (The "Strict" Validator)

```typescript
type Route<T extends string> = T extends ValidateRoute<T> ? T : never;
```

This is a conditional type that strictly validates a specific string literal `T`. If valid, it returns `T`. If invalid, it returns `never`.

---

## 2. Technical Implementation Details

This section breaks down the specific TypeScript utility types used to achieve strict validation.

### `ReplaceParams<T>`

**Goal**: Convert a route pattern with parameters (e.g., `"/users/:id"`) into a generic template literal (e.g., `"/users/${string}"`).

```typescript
type ReplaceParams<T extends string> =
  T extends `${infer Start}/:${infer Param}/${infer Rest}`
    ? `${Start}/${string}/${ReplaceParams<Rest>}`
    : T extends `${infer Start}/:${infer Param}`
    ? `${Start}/${string}`
    : T;
```

**Logic**:

1.  **Middle Param**: Checks if there is a parameter in the middle of the string (`/:Param/`). If so, replaces it with `/${string}/` and recurses on the `Rest`.
2.  **End Param**: Checks if the string ends with a parameter (`/:Param`). If so, replaces it with `/${string}`.
3.  **Base Case**: If no parameters are found, returns `T` as is.

### `IsParam<S>`

**Goal**: Check if a string segment is a dynamic parameter (starts with `:`).

```typescript
type IsParam<S extends string> = S extends `:${string}` ? true : false;
```

### `MatchRouteSegments<Pattern, Candidate>`

**Goal**: Compare two tuples of path segments to see if they match. This is the core of the strict validation.

```typescript
type MatchRouteSegments<
  Pattern extends string[],
  Candidate extends string[]
> = Pattern["length"] extends Candidate["length"]
  ? Pattern extends [infer PHead, ...infer PTail]
    ? Candidate extends [infer CHead, ...infer CTail]
      ? PHead extends string
        ? CHead extends string
          ? IsParam<PHead> extends true
            ? // 1. Param Match
              CHead extends ""
              ? false
              : MatchRouteSegments<PTail, CTail>
            : // 2. Static Match
            PHead extends CHead
            ? MatchRouteSegments<PTail, CTail>
            : false
          : false
        : false
      : true // Both empty (success)
    : true
  : false; // Length mismatch
```

**Logic**:

1.  **Length Check**: First, ensures both arrays have the same length. This immediately rejects paths with extra segments (e.g., `/posts/1/extra` vs `/posts/:id`).
2.  **Recursive Head Matching**:
    - **If Pattern Head is a Param** (`:id`): Checks if Candidate Head is a non-empty string. Crucially, because we split by `/`, the Candidate Head **cannot** contain a slash. This prevents greedy matching.
    - **If Pattern Head is Static** (`posts`): Checks if Candidate Head matches exactly (`PHead extends CHead`).
3.  **Recursion**: If the heads match, it recurses on the tails (`PTail`, `CTail`).

### `ValidateRoute<T>`

**Goal**: Check if a candidate string `T` matches **any** of the valid routes defined in `Pages`.

```typescript
type ValidateRoute<T extends string> = {
  [P in keyof Pages & string]: MatchRouteSegments<
    Split<P, "/">,
    Split<T, "/">
  > extends true
    ? T
    : never;
}[keyof Pages & string];
```

**Logic**:

- Iterates over every key `P` in `Pages`.
- Splits both `P` (the pattern) and `T` (the candidate) by `/`.
- Runs `MatchRouteSegments`.
- If it matches, returns `T`. If not, returns `never`.
- The final result is a union of all results. If `T` matches at least one route, the result is `T`. If it matches none, the result is `never`.

---

## 3. Why Helper Functions?

You might wonder why we can't just use the type directly:

```typescript
// ❌ Why this is annoying
const route: Route<"/posts/123"> = "/posts/123";
```

### The Inference Problem

`Route<T>` is a **generic type**. It needs to know what `T` is to validate it.

- If you write `const r: Route<string>`, `T` is `string`, which is too broad to validate.
- If you write `const r: Route<"/posts/123">`, you are manually typing the string twice (once in the type, once in the value).

### The Solution: Inference via Functions

Helper functions like `route` and wrapper components like `NavLink` allow TypeScript to **infer** `T` from the value you pass in.

```typescript
// ✅ route infers T = "/posts/123"
route("/posts/123");
// Route<"/posts/123"> resolves to "/posts/123". All good.

// ❌ route infers T = "/posts/123/extra"
route("/posts/123/extra");
// Route<"/posts/123/extra"> resolves to NEVER.
// Error: Argument of type string is not assignable to parameter of type never.
```

By using these wrappers and helper functions, we get the best of both worlds:

1. **Strict Validation**: Invalid paths are rejected.
2. **Great DX**: You don't have to manually type generic parameters.

## Summary

| Component     | Purpose                                                            |
| ------------- | ------------------------------------------------------------------ |
| `RoutePath`   | Global type for autocomplete. Loose matching.                      |
| `Route<T>`    | Logic to strictly validate a specific string literal.              |
| `route`.      | Helper to infer `T` and enforce `Route`.                           |
| `NavLink`.    | Wrapper for `<ReactRouter.NavLink>` that enforces `Route` on `to`. |
| `useNavigate` | Wrapper for `ReactRouter.useNavigate` that enforces `Route`.       |
# React Router v7 Type Safety Explanation

This document explains the type safety implementation for React Router v7, specifically how `src/types/route-paths.d.ts` works and why helper functions are necessary for strict validation.

## 1. High-Level Overview

### `Pages` Type

```typescript
type Pages = import("react-router").Register extends { pages: infer P }
  ? P
  : {};
```

We extract the `Pages` type from React Router's global `Register` interface. This type contains all your declared routes (e.g., `"/posts/:slug"`).

### `RoutePath` (The "Loose" Type)

```typescript
type RoutePath = ReplaceParams<keyof Pages & string>;
```

This type transforms route keys into template literal types.

- **Input**: `"/posts/:slug"`
- **Output**: `"/posts/${string}"`

**Purpose**: It provides excellent **autocomplete** in your IDE.
**Limitation**: TypeScript's template literal types are "greedy". `"/posts/${string}"` matches `"/posts/my-slug"`, but it _also_ matches `"/posts/my-slug/extra/segments"`. This is why `RoutePath` alone isn't strictly type-safe.

### `Route<T>` (The "Strict" Validator)

```typescript
type Route<T extends string> = T extends ValidateRoute<T> ? T : never;
```

This is a conditional type that strictly validates a specific string literal `T`. If valid, it returns `T`. If invalid, it returns `never`.

---

## 2. Technical Implementation Details

This section breaks down the specific TypeScript utility types used to achieve strict validation.

### `ReplaceParams<T>`

**Goal**: Convert a route pattern with parameters (e.g., `"/users/:id"`) into a generic template literal (e.g., `"/users/${string}"`).

```typescript
type ReplaceParams<T extends string> =
  T extends `${infer Start}/:${infer Param}/${infer Rest}`
    ? `${Start}/${string}/${ReplaceParams<Rest>}`
    : T extends `${infer Start}/:${infer Param}`
    ? `${Start}/${string}`
    : T;
```

**Logic**:

1.  **Middle Param**: Checks if there is a parameter in the middle of the string (`/:Param/`). If so, replaces it with `/${string}/` and recurses on the `Rest`.
2.  **End Param**: Checks if the string ends with a parameter (`/:Param`). If so, replaces it with `/${string}`.
3.  **Base Case**: If no parameters are found, returns `T` as is.

### `IsParam<S>`

**Goal**: Check if a string segment is a dynamic parameter (starts with `:`).

```typescript
type IsParam<S extends string> = S extends `:${string}` ? true : false;
```

### `MatchRouteSegments<Pattern, Candidate>`

**Goal**: Compare two tuples of path segments to see if they match. This is the core of the strict validation.

```typescript
type MatchRouteSegments<
  Pattern extends string[],
  Candidate extends string[]
> = Pattern["length"] extends Candidate["length"]
  ? Pattern extends [infer PHead, ...infer PTail]
    ? Candidate extends [infer CHead, ...infer CTail]
      ? PHead extends string
        ? CHead extends string
          ? IsParam<PHead> extends true
            ? // 1. Param Match
              CHead extends ""
              ? false
              : MatchRouteSegments<PTail, CTail>
            : // 2. Static Match
            PHead extends CHead
            ? MatchRouteSegments<PTail, CTail>
            : false
          : false
        : false
      : true // Both empty (success)
    : true
  : false; // Length mismatch
```

**Logic**:

1.  **Length Check**: First, ensures both arrays have the same length. This immediately rejects paths with extra segments (e.g., `/posts/1/extra` vs `/posts/:id`).
2.  **Recursive Head Matching**:
    - **If Pattern Head is a Param** (`:id`): Checks if Candidate Head is a non-empty string. Crucially, because we split by `/`, the Candidate Head **cannot** contain a slash. This prevents greedy matching.
    - **If Pattern Head is Static** (`posts`): Checks if Candidate Head matches exactly (`PHead extends CHead`).
3.  **Recursion**: If the heads match, it recurses on the tails (`PTail`, `CTail`).

### `ValidateRoute<T>`

**Goal**: Check if a candidate string `T` matches **any** of the valid routes defined in `Pages`.

```typescript
type ValidateRoute<T extends string> = {
  [P in keyof Pages & string]: MatchRouteSegments<
    Split<P, "/">,
    Split<T, "/">
  > extends true
    ? T
    : never;
}[keyof Pages & string];
```

**Logic**:

- Iterates over every key `P` in `Pages`.
- Splits both `P` (the pattern) and `T` (the candidate) by `/`.
- Runs `MatchRouteSegments`.
- If it matches, returns `T`. If not, returns `never`.
- The final result is a union of all results. If `T` matches at least one route, the result is `T`. If it matches none, the result is `never`.

---

## 3. Why Helper Functions?

You might wonder why we can't just use the type directly:

```typescript
// ❌ Why this is annoying
const route: Route<"/posts/123"> = "/posts/123";
```

### The Inference Problem

`Route<T>` is a **generic type**. It needs to know what `T` is to validate it.

- If you write `const r: Route<string>`, `T` is `string`, which is too broad to validate.
- If you write `const r: Route<"/posts/123">`, you are manually typing the string twice (once in the type, once in the value).

### The Solution: Inference via Functions

Helper functions like `route` and wrapper components like `NavLink` allow TypeScript to **infer** `T` from the value you pass in.

```typescript
// ✅ route infers T = "/posts/123"
route("/posts/123");
// Route<"/posts/123"> resolves to "/posts/123". All good.

// ❌ route infers T = "/posts/123/extra"
route("/posts/123/extra");
// Route<"/posts/123/extra"> resolves to NEVER.
// Error: Argument of type string is not assignable to parameter of type never.
```

By using these wrappers and helper functions, we get the best of both worlds:

1. **Strict Validation**: Invalid paths are rejected.
2. **Great DX**: You don't have to manually type generic parameters.

## Summary

| Component     | Purpose                                                            |
| ------------- | ------------------------------------------------------------------ |
| `RoutePath`   | Global type for autocomplete. Loose matching.                      |
| `Route<T>`    | Logic to strictly validate a specific string literal.              |
| `route`.      | Helper to infer `T` and enforce `Route`.                           |
| `NavLink`.    | Wrapper for `<ReactRouter.NavLink>` that enforces `Route` on `to`. |
| `useNavigate` | Wrapper for `ReactRouter.useNavigate` that enforces `Route`.       |
