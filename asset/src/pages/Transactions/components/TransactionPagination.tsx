import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/interfaces/Filter";

interface TransactionPaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const LIMIT_OPTIONS = [10, 20, 50, 100];

const getPageItems = (page: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = Array.from(
    new Set([1, page - 1, page, page + 1, totalPages])
  )
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);

  const items: (number | "ellipsis")[] = [];
  pages.forEach((item, index) => {
    if (index > 0 && item - pages[index - 1] > 1) items.push("ellipsis");
    items.push(item);
  });
  return items;
};

const TransactionPagination = ({
  pagination,
  onPageChange,
  onLimitChange,
}: TransactionPaginationProps) => {
  const { page, limit, total, totalPages } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-5 py-4 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Hiển thị {from}–{to} trong {total} giao dịch
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Select
          value={String(limit)}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[118px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIMIT_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option} / trang
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              aria-label="Trang trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {getPageItems(page, totalPages).map((item, index) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="w-8 text-center text-sm text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <Button
                  key={item}
                  variant={item === page ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPageChange(item)}
                  aria-current={item === page ? "page" : undefined}
                >
                  {item}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              aria-label="Trang sau"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPagination;
