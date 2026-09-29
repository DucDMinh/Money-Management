import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTransaction } from "@/api/transaction";
import TransactionRow from "@/components/finance/TransactionRow";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BaseUrl from "@/consts/baseUrl";
import SectionError from "./SectionError";

const RecentTransactionsCard = () => {
  const { data, isPending, isError, refetch } = useTransaction({ limit: 6 });

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="grid gap-x-10 md:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-center gap-3 py-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      );
    }
    if (isError || !data) return <SectionError onRetry={() => refetch()} />;
    if (data.items.length === 0) {
      return (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Chưa có giao dịch nào. Bấm “Thêm giao dịch” để bắt đầu.
        </p>
      );
    }
    return (
      <div className="grid gap-x-10 divide-y md:grid-cols-2 md:divide-y-0">
        {data.items.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} showDate />
        ))}
      </div>
    );
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-base">Giao dịch gần đây</CardTitle>
          <CardDescription>Các khoản thu chi mới nhất</CardDescription>
        </div>
        <Link
          to={BaseUrl.Transactions}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          Xem tất cả
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;
