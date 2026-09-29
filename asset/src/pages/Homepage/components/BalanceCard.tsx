import { PiggyBank } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSpentRatio } from "@/helpers/finance";
import { formatPercent, formatVND } from "@/helpers/format";
import { Overview } from "@/interfaces/report";

const cardClassName = "flex flex-col justify-between p-6 sm:col-span-2 lg:row-span-2";

const BalanceCard = ({ overview }: { overview?: Overview }) => {
  if (!overview) {
    return (
      <Card className={cardClassName}>
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-64" />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Skeleton className="h-11" />
          <Skeleton className="h-11" />
        </div>
        <Skeleton className="mt-6 h-6" />
      </Card>
    );
  }

  const { totals } = overview;
  const spentRatio = getSpentRatio(totals);

  return (
    <Card className={cardClassName}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            Số dư {overview.label.toLowerCase()}
          </p>
          <p className="mt-3 truncate text-4xl font-semibold tracking-tight sm:text-5xl">
            {formatVND(totals.balance)}
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted">
          <PiggyBank className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-income" />
            Tổng thu
          </p>
          <p className="mt-1 text-lg font-semibold">{formatVND(totals.income)}</p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-expense" />
            Tổng chi
          </p>
          <p className="mt-1 text-lg font-semibold">{formatVND(totals.expense)}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>Đã chi so với thu nhập</span>
          <span className="font-medium text-foreground">
            {spentRatio === null ? "Chưa có khoản thu" : formatPercent(spentRatio)}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-expense/20">
          <div
            className="h-full rounded-full bg-expense"
            style={{ width: `${Math.min(spentRatio ?? 0, 100)}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default BalanceCard;
