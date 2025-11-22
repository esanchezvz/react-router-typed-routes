import {
  type RouteConfig,
  index,
  layout,
  route,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("core/layouts/main.tsx", [
    index("home/pages/index.tsx"),
    ...prefix("posts", [
      index("posts/pages/index.tsx"),
      route(":slug", "posts/pages/post-detail.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
