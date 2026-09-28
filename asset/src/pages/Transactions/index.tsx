import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import TransactionFormDialog from "@/components/finance/TransactionFormDialog";
import TransactionRow from "@/components/finance/TransactionRow";
import PageHeader from "@/components/PageHeader";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatVND } from "@/helpers/format";
import { cn } from "@/lib/utils";
import {
  categoryFilterOptions,
  dateRangeOptions,
  transactionGroups,
  transactionSummary,
} from "@/mocks/mockData";

const summaryItems = [
  {
    label: "Tổng thu",
    value: formatVND(transactionSummary.income),
    swatch: "bg-income",
  },
  {
    label: "Tổng chi",
    value: formatVND(transactionSummary.expense),
    swatch: "bg-expense",
  },
  {
    label: "Chênh lệch",
    value: formatVND(transactionSummary.balance),
    note: `${transactionSummary.count} giao dịch`,
  },
];

const Transactions = () => {
  return (
    <PageWrapper>
      <div className="component:Transactions">
        <PageHeader
          title="Giao dịch"
          description="Theo dõi và quản lý mọi khoản thu chi của bạn"
          actions={
            <TransactionFormDialog
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm giao dịch
                </Button>
              }
            />
          }
        />

        <div className="mb-4 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo ghi chú hoặc danh mục..."
              className="bg-card pl-9"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
            <Select defaultValue="this-month">
              <SelectTrigger className="bg-card lg:w-44">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
                <SelectSeparator />
                <SelectItem value="custom">Tùy chọn khoảng ngày...</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="bg-card lg:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="expense">Khoản chi</SelectItem>
                <SelectItem value="income">Khoản thu</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="bg-card lg:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectSeparator />
                {categoryFilterOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          {summaryItems.map((item) => (
            <Card key={item.label} className="p-4">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {item.swatch && (
                  <span className={cn("h-2.5 w-2.5 rounded-[3px]", item.swatch)} />
                )}
                {item.label}
              </p>
              <div className="mt-1.5 flex items-baseline justify-between gap-2">
                <p className="text-xl font-semibold tracking-tight">
                  {item.value}
                </p>
                {item.note && (
                  <span className="text-xs text-muted-foreground">
                    {item.note}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          {transactionGroups.map((group) => (
            <section key={group.date}>
              <div className="flex items-center justify-between gap-3 border-b bg-muted/50 px-5 py-2.5 text-xs font-medium text-muted-foreground">
                <span>{group.label}</span>
                <span className="tabular-nums">
                  {group.income > 0 && `+${formatVND(group.income)} · `}−
                  {formatVND(group.expense)}
                </span>
              </div>
              <div className="divide-y px-5">
                {group.items.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    showActions
                  />
                ))}
              </div>
            </section>
          ))}

          <div className="flex flex-col items-center justify-between gap-3 border-t px-5 py-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Hiển thị {transactionSummary.showing} trong{" "}
              {transactionSummary.count} giao dịch
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled
                aria-label="Trang trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from(
                { length: transactionSummary.totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={page === transactionSummary.page ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-label="Trang sau"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default Transactions;
