import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  PiggyBank,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import ColumnChart, { ChartLegend } from "@/components/charts/ColumnChart";
import CategoryBreakdown from "@/components/finance/CategoryBreakdown";
import TransactionFormDialog from "@/components/finance/TransactionFormDialog";
import TransactionRow from "@/components/finance/TransactionRow";
import PageHeader from "@/components/PageHeader";
import PageWrapper from "@/components/PageWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BaseUrl from "@/consts/baseUrl";
import { formatCompactVND, formatPercent, formatVND } from "@/helpers/format";
import { cn } from "@/lib/utils";
import {
  overview,
  PeriodOverview,
  sixMonthSeries,
} from "@/mocks/mockData";
import { useAuth } from "@/providers/AuthenticationProvider";
import { formatDayLabel, todayISO } from "@/helpers/date";
import { useOverviewReport, useSummaryReport } from "@/api/report";
import { Overview } from "@/interfaces/report";
import { useTransaction } from "@/api/transaction";

const ChangeBadge = ({ change }: { change: number }) => {
  const isIncrease = change > 0;
  const Icon = isIncrease ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
        isIncrease
          ? "bg-red-500/10 text-red-700 dark:text-red-400"
          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {isIncrease ? "Tăng" : "Giảm"} {formatPercent(Math.abs(change))}
    </span>
  );
};

const PeriodCard = ({ item }: { item: PeriodOverview }) => {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          {item.title}
        </p>
        <span className="text-xs text-muted-foreground">{item.range}</span>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight">
        {formatVND(item.expense)}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Đã chi · Thu {formatCompactVND(item.income)}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4 text-xs text-muted-foreground">
        <ChangeBadge change={item.change} />
        {item.compareLabel}
      </div>
    </Card>
  );
};

const BalanceCard = ({ monthOverview }: { monthOverview: Overview }) => {
  const monthBalance = monthOverview.totals
  const spentRatio = 100 / monthBalance.income * monthBalance.expense
  return (
    <Card className="flex flex-col justify-between p-6 sm:col-span-2 lg:row-span-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Số dư {monthOverview.label.toLowerCase()}
          </p>
          <p className="mt-3 text-5xl font-semibold tracking-tight">
            {formatVND(monthBalance.balance)}
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted">
          <PiggyBank className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-income" />
            Tổng thu
          </p>
          <p className="mt-1 text-lg font-semibold">
            {formatVND(monthBalance.income)}
          </p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-expense" />
            Tổng chi
          </p>
          <p className="mt-1 text-lg font-semibold">
            {formatVND(monthBalance.expense)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>Đã chi so với thu nhập</span>
          <span className="font-medium text-foreground">
            {formatPercent(spentRatio)}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-expense/20">
          <div
            className="h-full rounded-full bg-expense"
            style={{ width: `${spentRatio}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

const Homepage = () => {
  const today = todayISO()
  const { user } = useAuth()
  const { data: OverviewData } = useOverviewReport(today)
  const { data: SummaryData } = useSummaryReport("month", today)
  const { data: transactionData } = useTransaction({ limit: 6 })
  const monthOverview = OverviewData?.month
  return (
    <PageWrapper>
      <div className="component:Homepage">
        <PageHeader
          title={`Xin chào, ${user?.name}`}
          description={`${formatDayLabel(today)} · Đây là tình hình tài chính của bạn`}
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {monthOverview && <BalanceCard monthOverview={monthOverview} />}
          {overview.map((item) => (
            <PeriodCard key={item.key} item={item} />
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle className="text-base">
                  Thu chi 6 tháng gần nhất
                </CardTitle>
                <CardDescription>Tháng 04 – 09/2026</CardDescription>
              </div>
              <ChartLegend series={["income", "expense"]} />
            </CardHeader>
            <CardContent>
              <ColumnChart
                data={sixMonthSeries}
                series={["income", "expense"]}
                height={240}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle className="text-base">Chi theo danh mục</CardTitle>
                <CardDescription>{monthOverview?.label}</CardDescription>
              </div>
              <Link
                to={BaseUrl.Reports}
                className="flex items-center text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Chi tiết
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              {SummaryData && <CategoryBreakdown items={SummaryData?.byCategory.expense} type="expense" />}
            </CardContent>
          </Card>
        </div>

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
          <CardContent className="grid gap-x-10 divide-y md:grid-cols-2 md:divide-y-0">
            {transactionData?.items.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                showDate
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default Homepage;
