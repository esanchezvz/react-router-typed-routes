import { route } from "~/core/router/utils";
import { Link } from "~/core/router/components";
import { useNavigate } from "~/core/router/hooks";

// ✅ Valid Routes
const home = route("/");
const posts = route("/posts");
const postDetail = route("/posts/my-slug");
const users = route("/users");
const editUser = route("/users/123/edit");

// ❌ Invalid Routes (Uncomment to see errors)

// @ts-expect-error - Extra segment
route("/posts/my-slug/extra");

// @ts-expect-error - Missing parameter
route("/users/edit");

// @ts-expect-error - Typo
route("/postss");

// ✅ Link Component Usage
Link({ to: "/" });
Link({ to: "/posts/123" });

// ❌ Invalid Link
// @ts-expect-error - Invalid path
Link({ to: "/invalid" });

// ✅ useNavigate Usage
const Component = () => {
  const navigate = useNavigate();
  navigate("/");
  navigate("/posts/123");

  return null;
};

// ❌ Invalid useNavigate
const InvalidComponent = () => {
  const navigate = useNavigate();
  // @ts-expect-error - Invalid path
  navigate("/invalid");

  return null;
};

// ⚠️ Limitation: Greedy Matching with AppRoutePath
const invalid = "/users/43";
const valid = "/users/43/edit";

route(valid);
// @ts-expect-error
route(invalid);
// @ts-expect-error
route(<string>valid); // string type is to broad to do route validation - template literal types are required

// AppRoutePath alone is loose. It allows extra segments because ${string} matches slashes.
// Example: "/posts/:slug" -> "/posts/${string}"
const greedyPath: AppRoutePath = "/posts/my-slug/extra/segments"; // ✅ Valid AppRoutePath (unfortunately)
route(greedyPath);
// But AppRoute (used by route()) catches it:
// @ts-expect-error - AppRoute is strict and rejects the extra segments
route("/posts/my-slug/extra/segments");
