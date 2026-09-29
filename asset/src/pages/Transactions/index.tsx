import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useCategory } from "@/api/category";
import { useTransaction } from "@/api/transaction";
import TransactionFormDialog from "@/components/finance/TransactionFormDialog";
import PageHeader from "@/components/PageHeader";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { defaultCategories } from "@/consts/categories";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { Transaction } from "@/interfaces/transaction";
import DeleteTransactionDialog from "./components/DeleteTransactionDialog";
import TransactionFilters from "./components/TransactionFilters";
import TransactionList from "./components/TransactionList";
import TransactionPagination from "./components/TransactionPagination";
import TransactionSummary from "./components/TransactionSummary";
import {
  buildTransactionFilter,
  FilterState,
  getCategoryList,
  groupByDate,
  hasCustomFilters,
  initialFilterState,
} from "./utils";

const Transactions = () => {
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const search = useDebouncedValue(filterState.search.trim());
  const filters = buildTransactionFilter(filterState, search);
  const { data, isPending, isError, isFetching, refetch } = useTransaction(filters);
  const { data: categoryOptions = defaultCategories } = useCategory();

  const groups = useMemo(() => groupByDate(data?.items ?? []), [data]);
  const categories = getCategoryList(categoryOptions, filterState.type);
  const canReset = hasCustomFilters(filterState);
  const isFiltered = canReset || filterState.preset !== "all";
  const totalPages = data?.pagination.totalPages ?? 0;

  useEffect(() => {
    if (totalPages > 0 && filterState.page > totalPages) {
      setFilterState((prev) => ({ ...prev, page: totalPages }));
    }
  }, [totalPages, filterState.page]);

  const updateFilters = (patch: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, page: 1, ...patch }));
  };

  const resetFilters = () => {
    setFilterState((prev) => ({ ...initialFilterState, limit: prev.limit }));
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setFormOpen(true);
  };

  const openDelete = (transaction: Transaction) => {
    setDeleting(transaction);
    setDeleteOpen(true);
  };

  return (
    <PageWrapper>
      <div className="component:Transactions">
        <PageHeader
          title="Giao dịch"
          description="Theo dõi và quản lý mọi khoản thu chi của bạn"
          actions={
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm giao dịch
            </Button>
          }
        />

        <TransactionFilters
          value={filterState}
          categories={categories}
          canReset={canReset}
          onChange={updateFilters}
          onReset={resetFilters}
        />

        <TransactionSummary totals={data?.totals} />

        <Card className="overflow-hidden">
          <TransactionList
            groups={groups}
            isLoading={isPending}
            isError={isError}
            isFetching={isFetching}
            isFiltered={isFiltered}
            canReset={canReset}
            onRetry={() => refetch()}
            onAdd={openCreate}
            onResetFilters={resetFilters}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          {data && data.pagination.total > 0 && (
            <TransactionPagination
              pagination={data.pagination}
              onPageChange={(page) => updateFilters({ page })}
              onLimitChange={(limit) => updateFilters({ limit })}
            />
          )}
        </Card>
      </div>

      <TransactionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={editing}
      />

      <DeleteTransactionDialog
        open={deleteOpen}
        transaction={deleting}
        onOpenChange={setDeleteOpen}
      />
    </PageWrapper>
  );
};

export default Transactions;
