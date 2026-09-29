import { CalendarDays, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateFilter, datePresetOptions, FilterState } from "../utils";

interface TransactionFiltersProps {
  value: FilterState;
  categories: string[];
  canReset: boolean;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

const TransactionFilters = ({
  value,
  categories,
  canReset,
  onChange,
  onReset,
}: TransactionFiltersProps) => {
  const isCustomRange = value.preset === "custom";

  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value.search}
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Tìm theo ghi chú hoặc danh mục..."
            className="bg-card pl-9 pr-9"
          />
          {value.search && (
            <button
              type="button"
              onClick={() => onChange({ search: "" })}
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Xóa từ khóa"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
          <Select
            value={value.preset}
            onValueChange={(preset) => onChange({ preset: preset as DateFilter })}
          >
            <SelectTrigger className="bg-card lg:w-52">
              <span className="flex items-center gap-2 truncate">
                <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent>
              {datePresetOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={value.type}
            onValueChange={(type) =>
              onChange({ type: type as FilterState["type"], category: "all" })
            }
          >
            <SelectTrigger className="bg-card lg:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="expense">Khoản chi</SelectItem>
              <SelectItem value="income">Khoản thu</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={value.category}
            onValueChange={(category) => onChange({ category })}
          >
            <SelectTrigger className="bg-card lg:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              <SelectSeparator />
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(isCustomRange || canReset) && (
        <div className="flex flex-wrap items-center gap-3">
          {isCustomRange && (
            <div className="flex flex-wrap items-center gap-2">
              <Input
                type="date"
                value={value.from}
                max={value.to || undefined}
                onChange={(event) => onChange({ from: event.target.value })}
                className="w-40 bg-card"
                aria-label="Từ ngày"
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="date"
                value={value.to}
                min={value.from || undefined}
                onChange={(event) => onChange({ to: event.target.value })}
                className="w-40 bg-card"
                aria-label="Đến ngày"
              />
            </div>
          )}

          {canReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-muted-foreground"
            >
              <X className="mr-1.5 h-4 w-4" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
