import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatShortDate } from "@/helpers/format";
import { Transaction } from "@/interfaces/transaction";
import AmountText from "./AmountText";
import CategoryIcon from "./CategoryIcon";

interface TransactionRowProps {
  transaction: Pick<
    Transaction,
    "id" | "type" | "amount" | "category" | "note" | "date"
  >;
  showDate?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TransactionRow = ({
  transaction,
  showDate,
  onEdit,
  onDelete,
}: TransactionRowProps) => {
  return (
    <div className="flex items-center gap-3 py-3">
      <CategoryIcon category={transaction.category} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {transaction.note || transaction.category}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {transaction.category}
          {showDate && ` · ${formatShortDate(transaction.date)}`}
        </p>
      </div>

      <AmountText
        type={transaction.type}
        amount={transaction.amount}
        className="text-sm"
      />

      {(onEdit || onDelete) && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground"
              aria-label="Tùy chọn"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {onEdit && (
              <DropdownMenuItem onSelect={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Sửa
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onSelect={onDelete}
                className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default TransactionRow;
