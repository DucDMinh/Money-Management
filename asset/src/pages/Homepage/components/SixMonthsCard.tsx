import { useSeriesReport } from "@/api/report";
import { ChartLegend } from "@/components/charts/ColumnChart";
import { Skeleton } from "@/components/ui/skeleton";
import { formatVND } from "@/helpers/format";
import { cn } from "@/lib/utils";
import { getMonthName, getSixMonthRange } from "../utils";
import SectionError from "./SectionError";

const signedVND = (value: number) =>
  `${value > 0 ? "+" : value < 0 ? "−" : ""}${formatVND(Math.abs(value))}`;

/** Thu và chi của 6 tháng gần nhất, tháng mới nhất ở trên */
const SixMonthsCard = ({ today }: { today: string }) => {
  const { from, to } = getSixMonthRange(today);
  const { data, isPending, isError, refetch } = useSeriesReport("month", from, to);

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="mt-5 flex flex-col gap-4">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-6" />
          ))}
        </div>
      );
    }
    if (isError || !data) return <SectionError onRetry={() => refetch()} />;
    if (data.items.every((item) => item.count === 0)) {
      return (
        <p className="py-8 text-sm text-muted-foreground">
          Thu chi từng tháng sẽ hiện ở đây sau khi bạn thêm giao dịch.
        </p>
      );
    }

    const max = Math.max(1, ...data.items.flatMap((item) => [item.income, item.expense]));
    const width = (value: number) => (value > 0 ? `max(2px, ${(value / max) * 100}%)` : 0);

    return (
      <>
        <div className="mt-4 flex justify-end text-xs text-muted-foreground">Còn lại</div>
        <ul className="mt-1">
          {[...data.items].reverse().map((item) => {
            const isCurrent = item.start <= today && today <= item.end;
            const monthName = getMonthName(item.start);
            return (
              <li
                key={item.key}
                tabIndex={0}
                aria-label={`${monthName}: thu ${formatVND(item.income)}, chi ${formatVND(
                  item.expense
                )}, còn lại ${signedVND(item.balance)}`}
                className="group relative grid grid-cols-[4.75rem_minmax(0,1fr)_auto] items-center gap-3 rounded-sm py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="text-sm leading-tight">
                  {monthName}
                  {isCurrent && <span className="block text-xs text-muted-foreground">đến nay</span>}
                </span>

                <div className="flex flex-col gap-0.5" aria-hidden>
                  {[
                    { value: item.income, className: "bg-income" },
                    { value: item.expense, className: "bg-expense" },
                  ].map((bar) => (
                    <div
                      key={bar.className}
                      className={cn(
                        "h-2 rounded-r-[4px] transition-opacity group-hover:opacity-80",
                        bar.className
                      )}
                      style={{ width: width(bar.value) }}
                    />
                  ))}
                </div>

                <span
                  className={cn(
                    "font-narrow text-sm font-medium tabular-nums",
                    item.balance < 0 && "text-red-700 dark:text-red-400"
                  )}
                >
                  {signedVND(item.balance)}
                </span>

                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-full left-20 z-10 mb-1 hidden whitespace-nowrap rounded-md border bg-popover px-3 py-2 text-xs shadow-md group-hover:block group-focus-visible:block"
                >
                  <p className="mb-1 font-medium">{item.label}</p>
                  {[
                    { label: "Thu", value: item.income, className: "bg-income" },
                    { label: "Chi", value: item.expense, className: "bg-expense" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-2 py-0.5">
                      <span className={cn("h-0.5 w-3 rounded-full", row.className)} />
                      <span className="font-narrow text-[13px] font-semibold tabular-nums">
                        {formatVND(row.value)}
                      </span>
                      <span className="text-muted-foreground">{row.label}</span>
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  return (
    <section className="rounded-lg border bg-card p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-base font-semibold">Sáu tháng gần nhất</h2>
        <ChartLegend series={["income", "expense"]} />
      </div>
      {renderContent()}
    </section>
  );
};

export default SixMonthsCard;
