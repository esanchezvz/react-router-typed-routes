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
  layout("users/components/users-layout.tsx", [
    ...prefix("users", [
      index("users/pages/index.tsx"),
      ...prefix(":id", [route("edit", "users/pages/edit-user.tsx")]),
    ]),
  ]),
] satisfies RouteConfig;
