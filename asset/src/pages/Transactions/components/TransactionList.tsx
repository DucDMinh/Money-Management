import { AlertCircle, Plus, Receipt, RotateCw, X } from "lucide-react";
import TransactionRow from "@/components/finance/TransactionRow";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatVND } from "@/helpers/format";
import { Transaction } from "@/interfaces/transaction";
import { cn } from "@/lib/utils";
import { TransactionDayGroup } from "../utils";

interface TransactionListProps {
  groups: TransactionDayGroup[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  isFiltered: boolean;
  canReset: boolean;
  onRetry: () => void;
  onAdd: () => void;
  onResetFilters: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const LoadingRows = () => (
  <div className="divide-y px-5">
    {Array.from({ length: 6 }, (_, index) => (
      <div key={index} className="flex items-center gap-3 py-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    ))}
  </div>
);

const StateMessage = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center px-6 py-16 text-center">
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
      {icon}
    </span>
    <p className="mt-4 font-medium">{title}</p>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    {children && (
      <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>
    )}
  </div>
);

const TransactionList = ({
  groups,
  isLoading,
  isError,
  isFetching,
  isFiltered,
  canReset,
  onRetry,
  onAdd,
  onResetFilters,
  onEdit,
  onDelete,
}: TransactionListProps) => {
  if (isLoading) return <LoadingRows />;

  if (isError && groups.length === 0) {
    return (
      <StateMessage
        icon={<AlertCircle className="h-5 w-5" />}
        title="Không tải được danh sách giao dịch"
        description="Kiểm tra kết nối tới máy chủ rồi thử lại."
      >
        <Button variant="outline" onClick={onRetry}>
          <RotateCw className="mr-2 h-4 w-4" />
          Thử lại
        </Button>
      </StateMessage>
    );
  }

  if (groups.length === 0) {
    return (
      <StateMessage
        icon={<Receipt className="h-5 w-5" />}
        title={isFiltered ? "Không có giao dịch phù hợp" : "Chưa có giao dịch nào"}
        description={
          isFiltered
            ? "Thử chọn khoảng thời gian khác hoặc xóa bộ lọc để xem thêm."
            : "Bắt đầu ghi lại khoản thu chi đầu tiên của bạn."
        }
      >
        {canReset && (
          <Button variant="outline" onClick={onResetFilters}>
            <X className="mr-2 h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm giao dịch
        </Button>
      </StateMessage>
    );
  }

  return (
    <div className={cn("transition-opacity", isFetching && "opacity-60")}>
      {groups.map((group) => (
        <section key={group.date}>
          <div className="flex items-center justify-between gap-3 border-b bg-muted/50 px-5 py-2.5 text-xs font-medium text-muted-foreground">
            <span>{group.label}</span>
            <span className="tabular-nums">
              {[
                group.income > 0 && `+${formatVND(group.income)}`,
                group.expense > 0 && `−${formatVND(group.expense)}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
          <div className="divide-y border-b px-5">
            {group.items.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onEdit={() => onEdit(transaction)}
                onDelete={() => onDelete(transaction)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default TransactionList;
