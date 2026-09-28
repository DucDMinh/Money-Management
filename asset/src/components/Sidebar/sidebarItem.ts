import { SidebarItem } from "@/interfaces/sidebar";
import BaseUrl from "@/consts/baseUrl";
import { LayoutDashboard } from "lucide-react";

const AdminItems: SidebarItem[] = [
    { label: "Trang chủ", href: BaseUrl.Homepage, icon: LayoutDashboard },
];

export default AdminItems;