import { DatePreset, formatDayLabel, getDateRange } from "@/helpers/date";
import { CategoryResponse } from "@/interfaces/category";
import {
  Transaction,
  TransactionFilter,
  TransactionType,
} from "@/interfaces/transaction";

export type DateFilter = DatePreset | "custom";

export interface FilterState {
  search: string;
  preset: DateFilter;
  from: string;
  to: string;
  type: "all" | TransactionType;
  category: string;
  page: number;
  limit: number;
}

export interface TransactionDayGroup {
  date: string;
  label: string;
  income: number;
  expense: number;
  items: Transaction[];
}

export const initialFilterState: FilterState = {
  search: "",
  preset: "this-month",
  from: "",
  to: "",
  type: "all",
  category: "all",
  page: 1,
  limit: 20,
};

export const datePresetOptions: { value: DateFilter; label: string }[] = [
  { value: "all", label: "Tất cả thời gian" },
  { value: "today", label: "Hôm nay" },
  { value: "last-7-days", label: "7 ngày qua" },
  { value: "this-month", label: "Tháng này" },
  { value: "last-month", label: "Tháng trước" },
  { value: "this-year", label: "Năm nay" },
  { value: "custom", label: "Tùy chọn khoảng ngày" },
];

export const buildTransactionFilter = (
  state: FilterState,
  search: string
): TransactionFilter => {
  let range =
    state.preset === "custom"
      ? { from: state.from || undefined, to: state.to || undefined }
      : getDateRange(state.preset);

  if (range.from && range.to && range.from > range.to) {
    range = { from: range.to, to: range.from };
  }

  return {
    ...range,
    type: state.type === "all" ? undefined : state.type,
    category: state.category === "all" ? undefined : state.category,
    q: search || undefined,
    page: state.page,
    limit: state.limit,
  };
};

export const hasCustomFilters = (state: FilterState) =>
  state.search !== initialFilterState.search ||
  state.preset !== initialFilterState.preset ||
  state.type !== initialFilterState.type ||
  state.category !== initialFilterState.category;

export const getCategoryList = (
  options: CategoryResponse,
  type: FilterState["type"]
) => {
  if (type !== "all") return options[type];
  return Array.from(new Set([...options.expense, ...options.income]));
};

export const groupByDate = (items: Transaction[]): TransactionDayGroup[] => {
  const groups: TransactionDayGroup[] = [];

  for (const item of items) {
    let group = groups[groups.length - 1];
    if (!group || group.date !== item.date) {
      group = {
        date: item.date,
        label: formatDayLabel(item.date),
        income: 0,
        expense: 0,
        items: [],
      };
      groups.push(group);
    }
    group.items.push(item);
    group[item.type] += item.amount;
  }

  return groups;
};
