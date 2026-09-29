import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSummaryReport } from "@/api/report";
import CategoryBreakdown from "@/components/finance/CategoryBreakdown";
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

const TopCategoriesCard = ({ date }: { date: string }) => {
  const { data, isPending, isError, refetch } = useSummaryReport("month", date);

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-1.5 w-full" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (isError || !data) return <SectionError onRetry={() => refetch()} />;
    return (
      <CategoryBreakdown
        items={data.byCategory.expense.slice(0, 6)}
        type="expense"
        emptyText="Chưa có khoản chi nào trong tháng"
      />
    );
  };

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-base">Chi theo danh mục</CardTitle>
          <CardDescription>{data?.label ?? "Tháng này"}</CardDescription>
        </div>
        <Link
          to={BaseUrl.Reports}
          className="flex items-center text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Chi tiết
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};

export default TopCategoriesCard;
