import { cn } from "@/lib/utils";
import { formatPercent, formatVND } from "@/helpers/format";
import { CategoryTotal } from "@/interfaces/report";
import { TransactionType } from "@/interfaces/transaction";
import CategoryIcon from "./CategoryIcon";

interface CategoryBreakdownProps {
  items: CategoryTotal[];
  type: TransactionType;
  emptyText?: string;
}

const CategoryBreakdown = ({
  items,
  type,
  emptyText = "Chưa có dữ liệu",
}: CategoryBreakdownProps) => {
  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {emptyText}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.category} className="flex items-center gap-3">
          <CategoryIcon category={item.category} className="h-9 w-9" />

          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
              <span className="truncate font-medium">{item.category}</span>
              <span className="shrink-0 tabular-nums">
                {formatVND(item.total)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    type === "income" ? "bg-income" : "bg-expense"
                  )}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {formatPercent(item.percent)}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CategoryBreakdown;
