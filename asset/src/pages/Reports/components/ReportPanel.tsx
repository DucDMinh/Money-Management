import { ChevronDown, ChevronLeft, ChevronRight, Table2 } from "lucide-react";
import ColumnChart, { ChartLegend } from "@/components/charts/ColumnChart";
import CategoryBreakdown from "@/components/finance/CategoryBreakdown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { todayISO } from "@/helpers/date";
import { formatVND } from "@/helpers/format";
import { SummaryResponse } from "@/interfaces/report";
import { cn } from "@/lib/utils";
import { chartConfigs, getRangeLabel, toChartPoints } from "../utils";
import DayTransactions from "./DayTransactions";

interface ReportPanelProps {
  report: SummaryResponse;
  isFetching?: boolean;
  onNavigate: (date: string) => void;
}

const ReportPanel = ({ report, isFetching, onNavigate }: ReportPanelProps) => {
  const { totals, byCategory } = report;
  const chart = chartConfigs[report.period];
  const chartData = toChartPoints(report);
  const today = todayISO();
  const isCurrentPeriod = report.start <= today && today <= report.end;

  const stats = [
    { label: "Tổng thu", value: formatVND(totals.income), swatch: "bg-income" },
    { label: "Tổng chi", value: formatVND(totals.expense), swatch: "bg-expense" },
    {
      label: "Số dư",
      value: formatVND(totals.balance),
      note: `${totals.count} giao dịch`,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-4 transition-opacity",
        isFetching && "opacity-60"
      )}
    >
      <div className="flex items-center justify-between rounded-lg border bg-card p-2 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Kỳ trước"
          onClick={() => onNavigate(report.prev)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col items-center text-center">
          <p className="text-sm font-semibold">{report.label}</p>
          <p className="text-xs text-muted-foreground">{getRangeLabel(report)}</p>
          {!isCurrentPeriod && (
            <button
              type="button"
              onClick={() => onNavigate(today)}
              className="mt-1 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Về kỳ hiện tại
            </button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Kỳ sau"
          disabled={report.next > today}
          onClick={() => onNavigate(report.next)}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {stat.swatch && (
                <span className={cn("h-2.5 w-2.5 rounded-[3px]", stat.swatch)} />
              )}
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {stat.value}
            </p>
            {stat.note && (
              <p className="mt-1 text-xs text-muted-foreground">{stat.note}</p>
            )}
          </Card>
        ))}
      </div>

      {chart && chartData.length > 0 && (
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div className="space-y-1.5">
              <CardTitle className="text-base">{chart.title}</CardTitle>
              <CardDescription>{chart.description}</CardDescription>
            </div>
            {chart.series.length > 1 && <ChartLegend series={chart.series} />}
          </CardHeader>
          <CardContent>
            <ColumnChart
              data={chartData}
              series={chart.series}
              labelEvery={chart.labelEvery}
              height={240}
            />

            <Collapsible className="mt-5 border-t pt-3">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group -ml-2 text-muted-foreground"
                >
                  <Table2 className="mr-2 h-4 w-4" />
                  Xem dạng bảng
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 max-h-80 overflow-auto rounded-md border">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card">
                      <TableRow>
                        <TableHead className="h-10">Thời gian</TableHead>
                        <TableHead className="h-10 text-right">Thu</TableHead>
                        <TableHead className="h-10 text-right">Chi</TableHead>
                        <TableHead className="h-10 text-right">Số dư</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chartData.map((point) => (
                        <TableRow key={point.key}>
                          <TableCell className="py-2.5">{point.label}</TableCell>
                          <TableCell className="py-2.5 text-right tabular-nums">
                            {formatVND(point.income)}
                          </TableCell>
                          <TableCell className="py-2.5 text-right tabular-nums">
                            {formatVND(point.expense)}
                          </TableCell>
                          <TableCell className="py-2.5 text-right tabular-nums">
                            {formatVND(point.balance)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      )}

      {report.period === "day" && <DayTransactions date={report.start} />}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chi theo danh mục</CardTitle>
            <CardDescription>
              Tổng chi {formatVND(totals.expense)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBreakdown
              items={byCategory.expense}
              type="expense"
              emptyText="Không có khoản chi nào"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thu theo danh mục</CardTitle>
            <CardDescription>
              Tổng thu {formatVND(totals.income)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBreakdown
              items={byCategory.income}
              type="income"
              emptyText="Không có khoản thu nào"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportPanel;
