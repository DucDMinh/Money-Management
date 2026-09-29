import { useSeriesReport } from "@/api/report";
import ColumnChart, { ChartLegend } from "@/components/charts/ColumnChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getSeriesRangeLabel,
  getSixMonthRange,
  toMonthlyChartPoints,
} from "../utils";
import SectionError from "./SectionError";

const CashflowCard = () => {
  const { from, to } = getSixMonthRange();
  const { data, isPending, isError, refetch } = useSeriesReport("month", from, to);

  const renderContent = () => {
    if (isPending) return <Skeleton className="h-[270px] w-full" />;
    if (isError || !data) return <SectionError onRetry={() => refetch()} />;
    return (
      <ColumnChart
        data={toMonthlyChartPoints(data.items)}
        series={["income", "expense"]}
        height={240}
      />
    );
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-base">Thu chi 6 tháng gần nhất</CardTitle>
          <CardDescription>
            {data ? getSeriesRangeLabel(data.start, data.end) : "Đang tải..."}
          </CardDescription>
        </div>
        <ChartLegend series={["income", "expense"]} />
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};

export default CashflowCard;
