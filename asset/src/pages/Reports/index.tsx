import { useState } from "react";
import { AlertCircle, RotateCw } from "lucide-react";
import { useSummaryReport } from "@/api/report";
import PageHeader from "@/components/PageHeader";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { todayISO } from "@/helpers/date";
import { ReportPeriod } from "@/interfaces/report";
import ReportPanel from "./components/ReportPanel";

const periodTabs: { value: ReportPeriod; label: string }[] = [
  { value: "day", label: "Ngày" },
  { value: "week", label: "Tuần" },
  { value: "month", label: "Tháng" },
  { value: "year", label: "Năm" },
];

const ReportSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-16 w-full" />
    <div className="grid gap-4 sm:grid-cols-3">
      <Skeleton className="h-28" />
      <Skeleton className="h-28" />
      <Skeleton className="h-28" />
    </div>
    <Skeleton className="h-80 w-full" />
  </div>
);

const Reports = () => {
  const [period, setPeriod] = useState<ReportPeriod>("month");
  const [date, setDate] = useState(todayISO());

  const { data, isPending, isError, isFetching, refetch } = useSummaryReport(
    period,
    date
  );

  const renderContent = () => {
    if (isPending) return <ReportSkeleton />;

    if (isError || !data) {
      return (
        <Card className="flex flex-col items-center px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
          </span>
          <p className="mt-4 font-medium">Không tải được báo cáo</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Kiểm tra kết nối tới máy chủ rồi thử lại.
          </p>
          <Button variant="outline" className="mt-5" onClick={() => refetch()}>
            <RotateCw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
        </Card>
      );
    }

    return (
      <ReportPanel report={data} isFetching={isFetching} onNavigate={setDate} />
    );
  };

  return (
    <PageWrapper>
      <div className="component:Reports">
        <PageHeader
          title="Báo cáo"
          description="Tổng hợp thu chi theo ngày, tuần, tháng và năm"
        />

        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as ReportPeriod)}
        >
          <TabsList className="grid w-full grid-cols-4 sm:inline-grid sm:w-auto">
            {periodTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="px-6">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {periodTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              {renderContent()}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageWrapper>
  );
};

export default Reports;
