# React Router v7 Type Safety Explanation

## 1. High-Level Overview

### `Pages` Type

```typescript
import type { Register } from "react-router";

type Pages = Register extends { pages: infer P } ? P : {};
```

We get the `Pages` type from React Router's global `Register` interface. This type contains all your declared routes (e.g., `"/posts/:slug"`).

### `AppRoutePath` (The "Loose" Type)

```typescript
type RouteDefinition = keyof Pages;

type AppRoutePath = ReplaceParams<RouteDefinition>;
```

This type transforms route keys into template literal types.

- **Input**: `"/posts/:slug"`
- **Output**: `"/posts/${string}"`

**Purpose**: It provides excellent **autocomplete** in your IDE.
**Limitation**: TypeScript's template literal types are **greedy**.

- `ReplaceParams` converts `"/posts/:slug"` to `"/posts/${string}"`.
- The type `${string}` matches **anything**, including slashes (`/`).
- Therefore, `"/posts/${string}"` matches `"/posts/my-slug"`, but it _also_ matches `"/posts/my-slug/extra/segments"`.

This is why `AppRoutePath` alone provides autocomplete but **not** strict validation. We need `AppRoute<T>` to enforce the structure segment-by-segment.

### `AppRoute<T>` (The "Strict" Validator)

```typescript
type AppRoute<T extends AppRoutePath> = T extends ValidateRoute<T> ? T : never;
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
type IsParam<S extends string> = Utils.MatchPattern<S, `:${string}`>;
```

### `MatchRouteSegments<Pattern, Candidate>`

**Goal**: Compare two tuples of path segments to see if they match. This is the core of the strict validation.

```typescript
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
```

**Logic**:

1.  **Recursion Limit**: Checks if `Depth` has reached 0.
2.  **Static Matching (`Utils.ConsumeMatchingSegments`)**: Delegates to `Utils.ConsumeMatchingSegments` to consume all matching **static** segments (e.g., matching `users` against `users`).
3.  **Result Check**:
    - If both `RemainingPattern` and `RemainingCandidate` are empty, it's a full match (`true`).
    - If `RemainingPattern` is not empty, it checks if the next segment is a **parameter** (`:id`).
4.  **Parameter Matching**:
    - If it is a parameter, it consumes one segment from the candidate (as long as it's not empty) and recurses.
    - If it's not a parameter (and static matching failed), it returns `false`.

### `ValidateRoute<T>`

**Goal**: Check if a candidate string `T` matches **any** of the valid routes defined in `RouteDefinition` which is a template literal union fo the declared routes from react-router.

```typescript
type ValidateRoute<T extends string> = {
  [P in RouteDefinition]: MatchRouteSegments<
    Utils.Split<P, "/">,
    Utils.Split<T, "/">
  > extends true
    ? T
    : never;
}[RouteDefinition];
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
const route: AppRoute<"/posts/123"> = "/posts/123";
```

### The Inference Problem

`AppRoute<T>` is a **generic type**. It needs to know what `T` is to validate it.

- If you write `const r: AppRoute<string>`, `T` is `string`, which is too broad to validate.
- If you write `const r: AppRoute<"/posts/123">`, you are manually typing the string twice (once in the type, once in the value).

### The Solution: Inference via Functions

Helper functions like `route` and wrapper components like `NavLink` allow TypeScript to **infer** `T` from the value you pass in.

```typescript
// ✅ route infers T = "/posts/123"
route("/posts/123");
// AppRoute<"/posts/123"> resolves to "/posts/123". All good.

// ❌ route infers T = "/posts/123/extra"
route("/posts/123/extra");
// AppRoute<"/posts/123/extra"> resolves to NEVER.
// Error: Argument of type string is not assignable to parameter of type never.
```

By using these wrappers and helper functions, we get the best of both worlds:

1. **Strict Validation**: Invalid paths are rejected.
2. **Great DX**: You don't have to manually type generic parameters.

## Summary

| Component      | Purpose                                                               |
| -------------- | --------------------------------------------------------------------- |
| `AppRoutePath` | Global type for autocomplete. Loose matching.                         |
| `AppRoute<T>`  | Logic to strictly validate a specific string literal.                 |
| `route`.       | Helper to infer `T` and enforce `AppRoute`.                           |
| `NavLink`.     | Wrapper for `<ReactRouter.NavLink>` that enforces `AppRoute` on `to`. |
| `useNavigate`  | Wrapper for `ReactRouter.useNavigate` that enforces `AppRoute`.       |
