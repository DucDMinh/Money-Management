import { cn } from "@/lib/utils";
import { formatVND } from "@/helpers/format";
import { TransactionType } from "@/mocks/mockData";

interface AmountTextProps {
  type: TransactionType;
  amount: number;
  className?: string;
}

const AmountText = ({ type, amount, className }: AmountTextProps) => {
  return (
    <span
      className={cn(
        "whitespace-nowrap font-medium tabular-nums",
        type === "income"
          ? "text-emerald-700 dark:text-emerald-400"
          : "text-foreground",
        className
      )}
    >
      {type === "income" ? "+" : "−"}
      {formatVND(amount)}
    </span>
  );
};

export default AmountText;
