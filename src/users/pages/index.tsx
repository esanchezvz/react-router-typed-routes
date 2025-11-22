import { NavLink } from "react-router";
import type { Route } from "./+types/index";

export async function clientLoader(_args: Route.LoaderArgs) {
  const { users } = await import("../data");

  return { users };
}

const UsersIndexPage = ({ loaderData: { users } }: Route.ComponentProps) => {
  return (
    <div className="flex flex-col gap-6">
      <h1>Posts</h1>

      <div className="flex flex-col gap-2">
        {users.map(({ id, firstName, lastName }) => {
          return (
            <NavLink
              key={id}
              className="text-yellow-500 underline underline-offset-4"
              to={`/users/${id}/edit`}
            >
              {firstName} {lastName}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default UsersIndexPage;
