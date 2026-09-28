import { cn } from "@/lib/utils";
import { formatCompactVND, formatVND } from "@/helpers/format";
import { ChartPoint, TransactionType } from "@/mocks/mockData";

interface ColumnChartProps {
  data: ChartPoint[];
  series: TransactionType[];
  labelEvery?: number;
  height?: number;
}

export const seriesMeta: Record<
  TransactionType,
  { label: string; className: string }
> = {
  income: { label: "Thu", className: "bg-income" },
  expense: { label: "Chi", className: "bg-expense" },
};

const getTicks = (max: number) => {
  if (max <= 0) return [0, 1];
  const raw = max / 5;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step =
    [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  return Array.from(
    { length: Math.ceil(max / step) + 1 },
    (_, index) => index * step
  );
};

export const ChartLegend = ({ series }: { series: TransactionType[] }) => {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      {series.map((key) => (
        <span key={key} className="flex items-center gap-1.5">
          <span
            className={cn("h-2.5 w-2.5 rounded-[3px]", seriesMeta[key].className)}
          />
          {seriesMeta[key].label}
        </span>
      ))}
    </div>
  );
};

const ColumnChart = ({
  data,
  series,
  labelEvery = 1,
  height = 220,
}: ColumnChartProps) => {
  const values = data.flatMap((point) => series.map((key) => point[key]));
  const max = Math.max(...values);
  const ticks = getTicks(max);
  const top = ticks[ticks.length - 1];
  const isSingle = series.length === 1;
  const toPercent = (value: number) => `${(value / top) * 100}%`;

  return (
    <div className="flex gap-3 pt-6">
      <div className="relative w-9 shrink-0" style={{ height }}>
        {ticks.map((tick) => (
          <span
            key={tick}
            className="absolute right-0 translate-y-1/2 text-[11px] tabular-nums text-muted-foreground"
            style={{ bottom: toPercent(tick) }}
          >
            {formatCompactVND(tick)}
          </span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative" style={{ height }}>
          {ticks.map((tick) => (
            <div
              key={tick}
              className={cn(
                "absolute inset-x-0 border-t",
                tick === 0 ? "border-foreground/20" : "border-border/70"
              )}
              style={{ bottom: toPercent(tick) }}
            />
          ))}

          <div className="absolute inset-0 flex items-end">
            {data.map((point, index) => {
              const tooltipPosition =
                index < data.length / 4
                  ? "left-0"
                  : index >= (data.length * 3) / 4
                  ? "right-0"
                  : "left-1/2 -translate-x-1/2";

              return (
                <div
                  key={point.key}
                  tabIndex={0}
                  aria-label={`${point.label}: ${series
                    .map((key) => `${seriesMeta[key].label} ${formatVND(point[key])}`)
                    .join(", ")}`}
                  className="group relative flex h-full flex-1 items-end justify-center gap-0.5 px-px outline-none"
                >
                  <div className="pointer-events-none absolute inset-y-0 inset-x-px rounded-sm transition-colors group-hover:bg-muted/70 group-focus-visible:bg-muted/70" />

                  {series.map((key) => (
                    <div
                      key={key}
                      className={cn(
                        "relative w-full max-w-[24px] rounded-t-[4px] transition-opacity group-hover:opacity-90",
                        seriesMeta[key].className
                      )}
                      style={{
                        height:
                          point[key] > 0
                            ? `max(2px, ${toPercent(point[key])})`
                            : 0,
                      }}
                    >
                      {isSingle && point[key] === max && (
                        <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium text-foreground">
                          {formatCompactVND(point[key])}
                        </span>
                      )}
                    </div>
                  ))}

                  <div
                    className={cn(
                      "pointer-events-none absolute bottom-full z-20 mb-2 hidden whitespace-nowrap rounded-md border bg-popover px-3 py-2 text-xs shadow-md group-hover:block group-focus-visible:block",
                      tooltipPosition
                    )}
                  >
                    <p className="mb-1 font-medium text-foreground">
                      {point.label}
                    </p>
                    {series.map((key) => (
                      <div key={key} className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-0.5 w-3 rounded-full",
                            seriesMeta[key].className
                          )}
                        />
                        <span className="font-semibold tabular-nums text-foreground">
                          {formatVND(point[key])}
                        </span>
                        <span className="text-muted-foreground">
                          {seriesMeta[key].label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-2 flex">
          {data.map((point, index) => (
            <span
              key={point.key}
              className="flex-1 text-center text-[11px] text-muted-foreground"
            >
              {index === 0 || (index + 1) % labelEvery === 0
                ? point.shortLabel
                : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColumnChart;
