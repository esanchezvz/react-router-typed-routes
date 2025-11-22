import { NavLink } from "react-router";
import type { Route } from "./+types/index";

export async function clientLoader(_args: Route.LoaderArgs) {
  const { posts } = await import("../data");

  return { posts };
}

const PostsIndexRoute = ({ loaderData: { posts } }: Route.ComponentProps) => {
  return (
    <div className="flex flex-col gap-6">
      <h1>Posts</h1>

      <div className="flex flex-col gap-2">
        {posts.map(({ slug, title }) => {
          return (
            <NavLink
              key={slug}
              className="text-yellow-500 underline underline-offset-4"
              to={`/posts/${slug}`}
            >
              {title}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default PostsIndexRoute;
