import {
  Car,
  Clapperboard,
  Coins,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  LucideIcon,
  MoreHorizontal,
  Receipt,
  ShoppingBag,
  TrendingUp,
  Utensils,
  Wallet,
} from "lucide-react";
import { CategoryResponse } from "@/interfaces/category";

export const categoryIcons: Record<string, LucideIcon> = {
  "Ăn uống": Utensils,
  "Di chuyển": Car,
  "Mua sắm": ShoppingBag,
  "Hóa đơn": Receipt,
  "Nhà ở": Home,
  "Giải trí": Clapperboard,
  "Sức khỏe": HeartPulse,
  "Giáo dục": GraduationCap,
  Lương: Wallet,
  Thưởng: Gift,
  "Đầu tư": TrendingUp,
  "Được tặng": Coins,
  Khác: MoreHorizontal,
};

export const defaultCategories: CategoryResponse = {
  expense: [
    "Ăn uống",
    "Di chuyển",
    "Mua sắm",
    "Hóa đơn",
    "Nhà ở",
    "Giải trí",
    "Sức khỏe",
    "Giáo dục",
    "Khác",
  ],
  income: ["Lương", "Thưởng", "Đầu tư", "Được tặng", "Khác"],
};
