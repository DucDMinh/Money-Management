import { BarChart3, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useOverviewReport, useSummaryReport } from "@/api/report";
import TransactionFormDialog from "@/components/finance/TransactionFormDialog";
import PageHeader from "@/components/PageHeader";
import PageWrapper from "@/components/PageWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import BaseUrl from "@/consts/baseUrl";
import { formatLongDate, todayISO } from "@/helpers/date";
import { useAuth } from "@/providers/AuthenticationProvider";
import MonthSheet from "./components/MonthSheet";
import RecentTransactionsCard from "./components/RecentTransactionsCard";
import SixMonthsCard from "./components/SixMonthsCard";
import TopCategoriesCard from "./components/TopCategoriesCard";
import { getPreviousMonthDate } from "./utils";

const Homepage = () => {
  const today = todayISO();
  const { user } = useAuth();
  const overview = useOverviewReport(today);
  const thisMonth = useSummaryReport("month", today);
  const lastMonth = useSummaryReport("month", getPreviousMonthDate(today));

  const monthsError = thisMonth.isError || lastMonth.isError;
  const retryMonths = () => {
    if (thisMonth.isError) thisMonth.refetch();
    if (lastMonth.isError) lastMonth.refetch();
  };

  return (
    <PageWrapper>
      <div className="component:Homepage font-archivo">
        <PageHeader
          title={user?.name ? `Xin chào, ${user.name}` : "Xin chào"}
          description={formatLongDate(today)}
          actions={
            <>
              <Link to={BaseUrl.Reports} className={buttonVariants({ variant: "outline" })}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Xem báo cáo
              </Link>
              <TransactionFormDialog
                trigger={
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm giao dịch
                  </Button>
                }
              />
            </>
          }
        />

        <MonthSheet
          today={today}
          overview={overview.data}
          thisMonth={thisMonth.data}
          lastMonth={lastMonth.data}
          isError={overview.isError || monthsError}
          onRetry={() => {
            if (overview.isError) overview.refetch();
            retryMonths();
          }}
        />

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-12">
          <RecentTransactionsCard today={today} className="lg:col-span-7" />
          <div className="flex flex-col gap-6 lg:col-span-5">
            <TopCategoriesCard
              thisMonth={thisMonth.data}
              lastMonth={lastMonth.data}
              isError={monthsError}
              onRetry={retryMonths}
            />
            <SixMonthsCard today={today} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Homepage;
