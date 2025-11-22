import type { Route } from "./+types/edit-user";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { id } = params;

  const { users } = await import("../data");

  const user = users.find((u) => String(u.id) === id) ?? null;

  return { user };
}

const PostDetailPage = ({ loaderData: { user } }: Route.ComponentProps) => {
  if (!user) return null;

  return (
    <div className="flex flex-col gap-2">
      <h1 className="tex-2xl">
        {user.firstName} {user.lastName}
      </h1>
      <span>{user.email}</span>
    </div>
  );
};

export default PostDetailPage;
