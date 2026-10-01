import { ArrowDownRight, ArrowUpRight, Minus, Plus } from "lucide-react";
import TransactionFormDialog from "@/components/finance/TransactionFormDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSpentRatio } from "@/helpers/finance";
import { formatPercent, formatVND } from "@/helpers/format";
import { Totals } from "@/interfaces/Filter";
import { Overview, OverviewResponse, SummaryResponse } from "@/interfaces/report";
import { cn } from "@/lib/utils";
import {
  describeChange,
  getMonthName,
  getPaceStory,
  horizons,
  toCumulativeExpense,
} from "../utils";
import PaceChart, { PaceLegend } from "./PaceChart";
import SectionError from "./SectionError";

interface MonthSheetProps {
  today: string;
  overview?: OverviewResponse;
  thisMonth?: SummaryResponse;
  lastMonth?: SummaryResponse;
  isError: boolean;
  onRetry: () => void;
}

const sheetClassName = "rounded-2xl border bg-card text-card-foreground shadow-sm";
const bodyClassName = "grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12";

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const Ledger = ({ totals, caption }: { totals: Totals; caption?: string }) => {
  const spentRatio = getSpentRatio(totals);
  const rows = [
    { label: "Thu vào", value: totals.income, swatch: "bg-income" },
    { label: "Chi ra", value: totals.expense, swatch: "bg-expense" },
  ];

  return (
    <div className="flex flex-col justify-end lg:pb-7">
      {caption && <p className="mb-4 text-sm font-medium">{caption}</p>}
      <dl className="grid gap-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <span className={cn("h-2.5 w-2.5 rounded-[3px]", row.swatch)} />
              {row.label}
            </dt>
            <dd className="font-narrow text-lg font-medium tabular-nums">{formatVND(row.value)}</dd>
          </div>
        ))}
        <div className="mt-1 border-t pt-4">
          <dt className="text-muted-foreground">{totals.balance < 0 ? "Chi vượt thu" : "Còn lại"}</dt>
          <dd className="mt-1.5 font-narrow text-[2rem] font-semibold leading-none tracking-[-0.01em]">
            {formatVND(Math.abs(totals.balance))}
          </dd>
        </div>
      </dl>

      <div className="mt-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-expense/20" aria-hidden>
          <div
            className="h-full rounded-full bg-expense"
            style={{ width: `${Math.min(spentRatio ?? 0, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {spentRatio === null
            ? "Chưa có khoản thu nào"
            : `Đã chi ${formatPercent(spentRatio)} số tiền thu vào`}
        </p>
      </div>
    </div>
  );
};

const ChangeNote = ({ overview, target }: { overview: Overview; target: string }) => {
  const change = overview.change.expense;
  const previousExpense = overview.previous.totals.expense;

  if (change === null || (overview.totals.expense === 0 && previousExpense > 0)) {
    return (
      <p className="mt-1 text-xs text-muted-foreground">
        {capitalize(target)}{" "}
        {previousExpense > 0 ? `chi ${formatVND(previousExpense)}` : "không có khoản chi"}
      </p>
    );
  }

  const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
  return (
    <p
      className={cn(
        "mt-1 flex items-center gap-1 text-xs",
        change > 0 && "text-red-700 dark:text-red-400",
        change < 0 && "text-emerald-700 dark:text-emerald-400",
        change === 0 && "text-muted-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {capitalize(describeChange(change, target))}
    </p>
  );
};

const Horizons = ({ overview }: { overview: OverviewResponse }) => (
  <div className="grid divide-y border-t sm:grid-cols-3 sm:divide-x sm:divide-y-0">
    {horizons.map(({ period, title, target }) => (
      <div key={period} className="px-5 py-4 sm:px-8 sm:py-5">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-1 font-narrow text-2xl font-semibold tracking-[-0.01em]">
          {formatVND(overview[period].totals.expense)}
        </p>
        <ChangeNote overview={overview[period]} target={target} />
      </div>
    ))}
  </div>
);

const MonthSheetSkeleton = () => (
  <section className={sheetClassName}>
    <div className={bodyClassName}>
      <div>
        <Skeleton className="h-4 w-44" />
        <Skeleton className="mt-3 h-10 w-3/4" />
        <Skeleton className="mt-3 h-4 w-1/2" />
        <Skeleton className="mt-8 h-[250px] w-full" />
      </div>
      <div className="flex flex-col justify-end gap-3 lg:pb-7">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="mt-3 h-9 w-4/5" />
        <Skeleton className="mt-3 h-1.5 w-full" />
      </div>
    </div>
    <div className="grid gap-4 border-t px-5 py-5 sm:grid-cols-3 sm:px-8">
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-14" />
      ))}
    </div>
  </section>
);

/** Khối đầu trang: nhịp chi tiêu tháng này so với tháng trước */
const MonthSheet = ({ today, overview, thisMonth, lastMonth, isError, onRetry }: MonthSheetProps) => {
  if (isError) {
    return (
      <section className={sheetClassName}>
        <SectionError onRetry={onRetry} className="py-16" />
      </section>
    );
  }
  if (!overview || !thisMonth || !lastMonth) return <MonthSheetSkeleton />;

  const current = {
    label: getMonthName(today),
    points: toCumulativeExpense(thisMonth.breakdown, today),
  };
  const previous =
    lastMonth.totals.expense > 0
      ? { label: getMonthName(lastMonth.start), points: toCumulativeExpense(lastMonth.breakdown) }
      : undefined;
  const spentToDate = current.points[current.points.length - 1]?.value ?? 0;
  const story = getPaceStory(today, spentToDate, overview.month, lastMonth);
  const hasSpending = thisMonth.totals.expense > 0 || !!previous;
  // Tháng mới chưa có giao dịch nào thì sổ thu chi hiện số liệu cả tháng trước
  const showLastMonth = thisMonth.totals.count === 0 && lastMonth.totals.count > 0;

  return (
    <section className={sheetClassName}>
      <div className={bodyClassName}>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{story.context}</p>
          <h2 className="mt-2 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.015em] [text-wrap:balance] sm:text-[2.5rem]">
            {story.headline}
          </h2>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
            {story.detail}
          </p>

          {hasSpending ? (
            <div className="mt-8">
              <PaceLegend current={current} previous={previous} />
              <PaceChart
                className="mt-3"
                current={current}
                previous={previous}
                days={Math.max(thisMonth.breakdown.length, lastMonth.breakdown.length)}
              />
            </div>
          ) : (
            <TransactionFormDialog
              trigger={
                <Button className="mt-6">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm giao dịch
                </Button>
              }
            />
          )}
        </div>

        {showLastMonth ? (
          <Ledger
            totals={lastMonth.totals}
            caption={`Cả ${getMonthName(lastMonth.start).toLowerCase()}`}
          />
        ) : (
          <Ledger totals={overview.month.totals} />
        )}
      </div>

      <Horizons overview={overview} />
    </section>
  );
};

export default MonthSheet;
