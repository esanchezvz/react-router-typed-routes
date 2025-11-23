import { route } from "./src/core/router/utils";
import { Link } from "./src/core/router/components";
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
};

// ❌ Invalid useNavigate
const InvalidComponent = () => {
  const navigate = useNavigate();
  // @ts-expect-error - Invalid path
  navigate("/invalid");
};

// ❌ Recursion Depth Limit Example
// This path exceeds the 10-level recursion limit
type DepthLimitExceeded = ApplicationRouter.MatchRouteSegments<
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
>;
type DepthLimitMet = ApplicationRouter.MatchRouteSegments<
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
>;
