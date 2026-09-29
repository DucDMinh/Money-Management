import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryIcons } from "@/consts/categories";

interface CategoryIconProps {
  category: string;
  className?: string;
}

const CategoryIcon = ({ category, className }: CategoryIconProps) => {
  const Icon = categoryIcons[category] ?? MoreHorizontal;

  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground/80",
        className
      )}
    >
      <Icon className="h-[18px] w-[18px]" />
    </span>
  );
};

export default CategoryIcon;
