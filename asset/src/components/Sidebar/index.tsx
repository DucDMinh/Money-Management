import { Wallet } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useOverviewReport } from "@/api/report";
import { cn } from "@/lib/utils";
import { todayISO } from "@/helpers/date";
import { getSpentRatio } from "@/helpers/finance";
import { formatPercent, formatVND } from "@/helpers/format";
import { SidebarItem } from "@/interfaces/sidebar";
import { useSidebarHandler } from "@/providers/SidebarProvider";
import AdminItems, { AccountItems } from "./sidebarItem";

const Sidebar = ({ forMobile }: { forMobile?: boolean }) => {
  const location = useLocation();
  const { isOpen } = useSidebarHandler();
  const { data } = useOverviewReport(todayISO());
  const month = data?.month;
  const spentRatio = month ? getSpentRatio(month.totals) : null;

  const renderGroup = (title: string, items: SidebarItem[]) => (
    <div>
      <h6 className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h6>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "side-bar__menu__item flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground",
              location.pathname === item.href && "is-active text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );

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
      <div className="flex h-full w-full flex-col rounded-xl border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-none">Money Manager</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Quản lý chi tiêu
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          {renderGroup("Quản lý", AdminItems)}
          {renderGroup("Tài khoản", AccountItems)}
        </div>

        {month && (
          <div className="mt-auto rounded-lg bg-muted/60 p-3">
            <p className="text-xs text-muted-foreground">{month.label}</p>
            <p className="mt-1 text-sm font-semibold">
              Đã chi {formatVND(month.totals.expense)}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-expense/20">
              <div
                className="h-full rounded-full bg-expense"
                style={{ width: `${Math.min(spentRatio ?? 0, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {spentRatio === null
                ? "Chưa có khoản thu trong tháng"
                : `${formatPercent(spentRatio)} tổng thu nhập tháng`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
