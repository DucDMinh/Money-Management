import { Link } from "react-router-dom";
import { useTransaction } from "@/api/transaction";
import AmountText from "@/components/finance/AmountText";
import CategoryIcon from "@/components/finance/CategoryIcon";
import { Skeleton } from "@/components/ui/skeleton";
import BaseUrl from "@/consts/baseUrl";
import { Transaction } from "@/interfaces/transaction";
import { cn } from "@/lib/utils";
import { getDayHeading } from "../utils";
import SectionError from "./SectionError";

const groupByDate = (transactions: Transaction[]) =>
  transactions.reduce<{ date: string; items: Transaction[] }[]>((groups, transaction) => {
    const last = groups[groups.length - 1];
    if (last?.date === transaction.date) last.items.push(transaction);
    else groups.push({ date: transaction.date, items: [transaction] });
    return groups;
  }, []);

const RecentTransactionsCard = ({ today, className }: { today: string; className?: string }) => {
  const { data, isPending, isError, refetch } = useTransaction({ limit: 8 });

  const renderContent = () => {
    if (isPending) {
      return Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="flex items-center gap-3 py-2.5">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      ));
    }
    if (isError || !data) return <SectionError onRetry={() => refetch()} />;
    if (data.items.length === 0) {
      return (
        <p className="py-8 text-sm text-muted-foreground">
          Chưa có giao dịch nào. Các khoản thu chi mới nhất sẽ hiện ở đây.
        </p>
      );
    }

    return groupByDate(data.items).map((group) => (
      <div key={group.date} className="mt-5 first:mt-3">
        <h3 className="text-xs font-medium text-muted-foreground">
          {getDayHeading(group.date, today)}
        </h3>
        <ul className="mt-1 divide-y">
          {group.items.map((transaction) => (
            <li key={transaction.id} className="flex items-center gap-3 py-2.5">
              <CategoryIcon category={transaction.category} className="h-9 w-9" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {transaction.note || transaction.category}
                </p>
                {transaction.note && (
                  <p className="truncate text-xs text-muted-foreground">{transaction.category}</p>
                )}
              </div>
              <AmountText
                type={transaction.type}
                amount={transaction.amount}
                className="font-narrow text-[15px]"
              />
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <section className={cn("rounded-lg border bg-card p-5 sm:p-6", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-base font-semibold">Giao dịch gần đây</h2>
        <Link
          to={BaseUrl.Transactions}
          className="rounded-sm text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Xem tất cả
        </Link>
      </div>
      {renderContent()}
    </section>
  );
};

export default RecentTransactionsCard;
