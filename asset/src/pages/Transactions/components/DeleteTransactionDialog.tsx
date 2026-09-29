import { useDeleteTransaction } from "@/api/transaction";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatShortDate, formatVND } from "@/helpers/format";
import { showSuccess } from "@/helpers/toast";
import { Transaction } from "@/interfaces/transaction";

interface DeleteTransactionDialogProps {
  open: boolean;
  transaction: Transaction | null;
  onOpenChange: (open: boolean) => void;
}

const DeleteTransactionDialog = ({
  open,
  transaction,
  onOpenChange,
}: DeleteTransactionDialogProps) => {
  const deleteTransaction = useDeleteTransaction();

  const handleDelete = () => {
    if (!transaction) return;
    deleteTransaction.mutate(transaction.id, {
      onSuccess: () => {
        showSuccess("Đã xóa giao dịch");
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => !deleteTransaction.isPending && onOpenChange(value)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa giao dịch này?</AlertDialogTitle>
          <AlertDialogDescription>
            {transaction && (
              <>
                Giao dịch “{transaction.note || transaction.category}”{" "}
                {transaction.type === "income" ? "+" : "−"}
                {formatVND(transaction.amount)} ngày{" "}
                {formatShortDate(transaction.date)} sẽ bị xóa vĩnh viễn và không
                thể khôi phục.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteTransaction.isPending}>
            Hủy
          </AlertDialogCancel>
          <Button
            variant="destructive"
            isLoading={deleteTransaction.isPending}
            onClick={handleDelete}
          >
            Xóa giao dịch
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTransactionDialog;
