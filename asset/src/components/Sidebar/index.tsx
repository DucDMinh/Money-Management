import { cn } from "@/lib/utils";
import { useSidebarHandler } from "@/providers/SidebarProvider";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ forMobile }: { forMobile?: boolean }) => {
  const location = useLocation();
  const { isOpen } = useSidebarHandler();

  return (
    <div
      className={cn(
        "component:Sidebar",
        forMobile
          ? isOpen
            ? "block h-[100vh] w-[100vw] overflow-auto"
            : "hidden h-[100vh] w-[100vw] overflow-auto"
          : "sticky top-0 hidden h-[100vh] max-h-[100vh] w-[--sidebar-width] p-2 md:block"
      )}
    >
      <div className="flex h-full w-full flex-col rounded-md border bg-card p-1 shadow-md">
        <div className="side-bar__logo px-2 pt-2">
          <h3 className="text-xl">Logo comany here</h3>
        </div>

        <div className="side-bar__menu mt-8">
          <h6 className="mb-2 px-3 text-sm text-muted-foreground">General</h6>
          {[
            {
              label: "Dashboard",
              href: "/",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1"></path>
                  <path d="M5 16h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1"></path>
                  <path d="M15 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1"></path>
                  <path d="M15 4h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1"></path>
                </svg>
              ),
            }
          ].map((el) => {
            return (
              <Link
                key={el.label}
                to={el.href}
                className={cn(
                  "side-bar__menu__item flex items-center gap-2 px-3 py-2 text-sm",
                  location.pathname === el.href && "is-active"
                )}
              >
                {el.icon} {el.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
