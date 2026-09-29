import { useTransaction } from "@/api/transaction";
import TransactionRow from "@/components/finance/TransactionRow";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DayTransactions = ({ date }: { date: string }) => {
  const { data, isPending } = useTransaction({ from: date, to: date, limit: 100 });
  const items = data?.items ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Giao dịch trong ngày</CardTitle>
        <CardDescription>
          {isPending ? "Đang tải..." : `${data?.pagination.total ?? 0} giao dịch`}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-0 pb-3">
        {isPending ? (
          <div className="space-y-3 pb-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : items.length === 0 ? (
          <p className="pb-6 pt-2 text-center text-sm text-muted-foreground">
            Không có giao dịch nào trong ngày này
          </p>
        ) : (
          <div className="divide-y">
            {items.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DayTransactions;
