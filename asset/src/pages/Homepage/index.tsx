import { BarChart3, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useOverviewReport } from "@/api/report";
import TransactionFormDialog from "@/components/finance/TransactionFormDialog";
import PageHeader from "@/components/PageHeader";
import PageWrapper from "@/components/PageWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BaseUrl from "@/consts/baseUrl";
import { formatLongDate, todayISO } from "@/helpers/date";
import { useAuth } from "@/providers/AuthenticationProvider";
import BalanceCard from "./components/BalanceCard";
import CashflowCard from "./components/CashflowCard";
import PeriodCard from "./components/PeriodCard";
import RecentTransactionsCard from "./components/RecentTransactionsCard";
import SectionError from "./components/SectionError";
import TopCategoriesCard from "./components/TopCategoriesCard";
import { periodCards } from "./utils";

const Homepage = () => {
  const today = todayISO();
  const { user } = useAuth();
  const { data: overview, isError, refetch } = useOverviewReport(today);

  return (
    <PageWrapper>
      <div className="component:Homepage">
        <PageHeader
          title={user?.name ? `Xin chào, ${user.name}` : "Xin chào"}
          description={`${formatLongDate(today)} · Đây là tình hình tài chính của bạn`}
          actions={
            <>
              <Link
                to={BaseUrl.Reports}
                className={buttonVariants({ variant: "outline" })}
              >
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

        {isError ? (
          <Card>
            <SectionError onRetry={() => refetch()} />
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <BalanceCard overview={overview?.month} />
            {periodCards.map((card) => (
              <PeriodCard
                key={card.period}
                period={card.period}
                title={card.title}
                compareLabel={card.compareLabel}
                overview={overview?.[card.period]}
              />
            ))}
          </div>
        )}

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <CashflowCard />
          <TopCategoriesCard date={today} />
        </div>

        <RecentTransactionsCard />
      </div>
    </PageWrapper>
  );
};

export default Homepage;
