import { Outlet, NavLink, type NavLinkRenderProps } from "react-router";

const linkClassName = ({ isActive }: NavLinkRenderProps) =>
  `${
    isActive
      ? "underline underline-offset-4 text-yellow-500"
      : "hover:text-yellow-500 transition-colors"
  }`;

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <header className="px-2 py-4 bg-black border-b border-white">
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <NavLink to="/" className={linkClassName}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/posts" className={linkClassName}>
                Posts
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className="grow overflow-y-auto overflow-hidden p-2">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
