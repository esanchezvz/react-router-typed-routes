import type { Route } from "./+types/post-detail";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { slug } = params;

  const { posts } = await import("../data");

  const post = posts.find((p) => p.slug === slug) ?? null;

  return { post };
}

const PostDetailRoute = ({ loaderData: { post } }: Route.ComponentProps) => {
  if (!post) return null;
  return <h1>{post.title}</h1>;
};

export default PostDetailRoute;
