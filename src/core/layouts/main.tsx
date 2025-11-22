import { Outlet } from "react-router";
import { NavLink } from "~/core/router/components";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <header className="px-2 py-4 bg-black border-b border-white">
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/posts">Posts</NavLink>
            </li>
            <li>
              <NavLink to="/users">Users</NavLink>
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

export default MainLayout;
