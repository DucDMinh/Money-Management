import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatVND } from "@/helpers/format";
import { Totals } from "@/interfaces/Filter";
import { cn } from "@/lib/utils";

interface TransactionSummaryProps {
  totals?: Totals;
}

const TransactionSummary = ({ totals }: TransactionSummaryProps) => {
  const items = [
    { label: "Tổng thu", value: totals?.income, swatch: "bg-income" },
    { label: "Tổng chi", value: totals?.expense, swatch: "bg-expense" },
    {
      label: "Chênh lệch",
      value: totals?.balance,
      note: totals && `${totals.count} giao dịch`,
    },
  ];

  return (
    <div className="mb-4 grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="p-4">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {item.swatch && (
              <span className={cn("h-2.5 w-2.5 rounded-[3px]", item.swatch)} />
            )}
            {item.label}
          </p>
          <div className="mt-1.5 flex min-h-[28px] items-baseline justify-between gap-2">
            {item.value === undefined ? (
              <Skeleton className="h-7 w-32" />
            ) : (
              <p className="text-xl font-semibold tracking-tight">
                {formatVND(item.value)}
              </p>
            )}
            {item.note && (
              <span className="text-xs text-muted-foreground">{item.note}</span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TransactionSummary;
