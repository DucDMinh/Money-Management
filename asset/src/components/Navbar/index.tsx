import { KeyRound, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import BaseUrl from "@/consts/baseUrl";
import { mockUser } from "@/mocks/mockData";
import { useAuth } from "@/providers/AuthenticationProvider";
import { useSidebarHandler } from "@/providers/SidebarProvider";
import Sidebar from "../Sidebar";
import ThemeToggle from "../ThemeToggle";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function Navbar() {
  const { logout } = useAuth();
  const { isOpen, toggle } = useSidebarHandler();

  const [openPopover, setPopover] = useState(false);

  return (
    <nav className="flex w-full items-center justify-between p-2 md:justify-end">
      <Popover open={isOpen} onOpenChange={toggle}>
        <PopoverTrigger asChild>
          {isOpen ? (
            <X className="hover:cursor-pointer md:hidden" />
          ) : (
            <Menu className="hover:cursor-pointer md:hidden" />
          )}
        </PopoverTrigger>
        <PopoverContent className="mt-[10px] w-auto border-0 p-0">
          <Sidebar forMobile />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <Popover open={openPopover} onOpenChange={setPopover}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-accent">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                  {mockUser.initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium leading-none">
                  {mockUser.name}
                </p>
                <p className="mt-1 text-xs leading-none text-muted-foreground">
                  @{mockUser.username}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="mt-2 w-52 p-1">
            <Link
              to={BaseUrl.ChangePassword}
              onClick={() => setPopover(false)}
              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
            >
              <KeyRound className="h-4 w-4" />
              Đổi mật khẩu
            </Link>
            <button
              onClick={() => {
                setPopover(false);
                logout();
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-red-600 hover:bg-accent dark:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
