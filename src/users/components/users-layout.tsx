import { Outlet } from "react-router";
import { AppLink } from "~/core/components/app-link";

const USersLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <header className="px-2 py-4 bg-black border-r border-white">
        <nav>
          <ul className="flex flex-col items-center justify-center gap-4 w-30">
            <li>
              <AppLink to="/">Home</AppLink>
            </li>
            <li>
              <AppLink to="/posts">Posts</AppLink>
            </li>
            <li>
              <AppLink to="/users">Users</AppLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className="grow overflow-y-auto overflow-hidden p-2 flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
};

export default USersLayout;
