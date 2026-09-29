import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactVND, formatPercent, formatShortDate, formatVND } from "@/helpers/format";
import { Overview, ReportPeriod } from "@/interfaces/report";
import { cn } from "@/lib/utils";
import { getPeriodRangeLabel } from "../utils";

interface PeriodCardProps {
  period: ReportPeriod;
  title: string;
  compareLabel: string;
  overview?: Overview;
}

const ChangeBadge = ({ change }: { change: number }) => {
  const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
  const text =
    change === 0
      ? "Không đổi"
      : `${change > 0 ? "Tăng" : "Giảm"} ${formatPercent(Math.abs(change))}`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
        change > 0 && "bg-red-500/10 text-red-700 dark:text-red-400",
        change < 0 && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        change === 0 && "bg-muted text-muted-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {text}
    </span>
  );
};

const PeriodCard = ({ period, title, compareLabel, overview }: PeriodCardProps) => {
  if (!overview) {
    return (
      <Card className="flex flex-col gap-3 p-5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-5 w-40" />
      </Card>
    );
  }

  const { totals, previous, change } = overview;

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span className="text-xs text-muted-foreground">
          {getPeriodRangeLabel(period, overview)}
        </span>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight">
        {formatVND(totals.expense)}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Đã chi · Thu {formatCompactVND(totals.income)}
      </p>

      <div
        className="mt-auto flex flex-wrap items-center gap-1.5 pt-4 text-xs text-muted-foreground"
        title={`${formatShortDate(previous.start)} – ${formatShortDate(previous.end)}: đã chi ${formatVND(previous.totals.expense)}`}
      >
        {change.expense === null ? (
          "Chưa có dữ liệu kỳ trước để so sánh"
        ) : (
          <>
            <ChangeBadge change={change.expense} />
            {compareLabel}
          </>
        )}
      </div>
    </Card>
  );
};

export default PeriodCard;
