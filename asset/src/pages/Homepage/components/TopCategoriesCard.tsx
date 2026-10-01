import { Skeleton } from "@/components/ui/skeleton";
import { formatPercent, formatVND } from "@/helpers/format";
import { CategoryTotal, SummaryResponse } from "@/interfaces/report";
import { getMonthName } from "../utils";
import SectionError from "./SectionError";

interface TopCategoriesCardProps {
  thisMonth?: SummaryResponse;
  lastMonth?: SummaryResponse;
  isError: boolean;
  onRetry: () => void;
}

const MAX_ROWS = 5;

/** Giữ 5 danh mục lớn nhất, gộp phần còn lại thành một dòng */
const foldCategories = (items: CategoryTotal[]) => {
  if (items.length <= MAX_ROWS + 1) return items;
  const rest = items.slice(MAX_ROWS);
  return [
    ...items.slice(0, MAX_ROWS),
    {
      category: `${rest.length} danh mục còn lại`,
      total: rest.reduce((sum, item) => sum + item.total, 0),
      count: rest.reduce((sum, item) => sum + item.count, 0),
      percent: rest.reduce((sum, item) => sum + item.percent, 0),
    },
  ];
};

const TopCategoriesCard = ({ thisMonth, lastMonth, isError, onRetry }: TopCategoriesCardProps) => {
  const renderContent = () => {
    if (isError) return <SectionError onRetry={onRetry} />;
    if (!thisMonth || !lastMonth) {
      return (
        <div className="mt-5 flex flex-col gap-5">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-9" />
          ))}
        </div>
      );
    }

    // Đầu tháng chưa có khoản chi thì xem tạm tháng trước
    const isFallback = thisMonth.totals.expense === 0 && lastMonth.totals.expense > 0;
    const report = isFallback ? lastMonth : thisMonth;
    const items = foldCategories(report.byCategory.expense);

    if (items.length === 0) {
      return (
        <p className="py-8 text-sm text-muted-foreground">
          Chưa có khoản chi nào. Các danh mục sẽ hiện ở đây khi bạn thêm khoản chi.
        </p>
      );
    }

    return (
      <>
        <p className="mt-1 text-sm text-muted-foreground">
          {isFallback
            ? `Số liệu ${getMonthName(report.start).toLowerCase()}, vì ${getMonthName(
                thisMonth.start
              ).toLowerCase()} chưa có khoản chi`
            : `${getMonthName(report.start)}, tổng chi ${formatVND(report.totals.expense)}`}
        </p>
        <ul className="mt-5 flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.category}>
              <div className="flex items-baseline gap-2 text-sm">
                <span className="truncate">{item.category}</span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {formatPercent(item.percent)}
                </span>
                <span className="ml-auto shrink-0 pl-2 font-narrow font-medium tabular-nums">
                  {formatVND(item.total)}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                <div
                  className="h-full rounded-full bg-expense"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <section className="rounded-lg border bg-card p-5 sm:p-6">
      <h2 className="text-base font-semibold">Tiền đi đâu</h2>
      {renderContent()}
    </section>
  );
};

export default TopCategoriesCard;
