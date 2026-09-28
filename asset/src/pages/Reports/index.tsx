import PageHeader from "@/components/PageHeader";
import PageWrapper from "@/components/PageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportPeriod, reports } from "@/mocks/mockData";
import ReportPanel from "./components/ReportPanel";

const periodTabs: { value: ReportPeriod; label: string }[] = [
  { value: "day", label: "Ngày" },
  { value: "week", label: "Tuần" },
  { value: "month", label: "Tháng" },
  { value: "year", label: "Năm" },
];

const Reports = () => {
  return (
    <PageWrapper>
      <div className="component:Reports">
        <PageHeader
          title="Báo cáo"
          description="Tổng hợp thu chi theo ngày, tuần, tháng và năm"
        />

        <Tabs defaultValue="month">
          <TabsList className="grid w-full grid-cols-4 sm:inline-grid sm:w-auto">
            {periodTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="px-6">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {periodTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              <ReportPanel report={reports[tab.value]} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageWrapper>
  );
};

export default Reports;
