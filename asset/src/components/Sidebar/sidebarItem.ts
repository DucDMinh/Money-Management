import { SidebarItem } from "@/interfaces/sidebar";
import BaseUrl from "@/consts/baseUrl";
import { ArrowLeftRight, BarChart3, KeyRound, LayoutDashboard } from "lucide-react";

const AdminItems: SidebarItem[] = [
  { label: "Tổng quan", href: BaseUrl.Homepage, icon: LayoutDashboard },
  { label: "Giao dịch", href: BaseUrl.Transactions, icon: ArrowLeftRight },
  { label: "Báo cáo", href: BaseUrl.Reports, icon: BarChart3 },
];

export const AccountItems: SidebarItem[] = [
  { label: "Đổi mật khẩu", href: BaseUrl.ChangePassword, icon: KeyRound },
];

export default AdminItems;
