import { useEffect, useRef, useState } from "react";
import { getTicks } from "@/components/charts/ColumnChart";
import { formatCompactVND, formatVND } from "@/helpers/format";
import { cn } from "@/lib/utils";

export interface PaceSeries {
  label: string;
  points: { date: string; value: number }[];
}

interface PaceChartProps {
  current: PaceSeries;
  previous?: PaceSeries;
  /** Số ngày trên trục X (ngày dài nhất của hai tháng) */
  days: number;
  height?: number;
  className?: string;
}

const MARGIN = { top: 20, right: 60, bottom: 28, left: 44 };
const DAY_TICKS = [1, 5, 10, 15, 20, 25];

const useElementWidth = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
};

const dayMonth = (isoDate: string) => {
  const [, month, day] = isoDate.split("-");
  return `${Number(day)}/${Number(month)}`;
};

const LineKey = ({ className }: { className: string }) => (
  <span className={cn("h-0.5 w-3.5 shrink-0 rounded-full", className)} />
);

export const PaceLegend = ({ current, previous }: Pick<PaceChartProps, "current" | "previous">) => (
  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
    <span className="flex items-center gap-1.5">
      <LineKey className="bg-expense" />
      {current.label}, đến hôm nay
    </span>
    {previous && (
      <span className="flex items-center gap-1.5">
        <LineKey className="bg-chart-muted" />
        {previous.label}
      </span>
    )}
  </div>
);

/** Chi tiêu cộng dồn từng ngày của tháng này, đặt cạnh tháng trước */
const PaceChart = ({ current, previous, days, height = 230, className }: PaceChartProps) => {
  const [ref, width] = useElementWidth();
  const [active, setActive] = useState<number | null>(null);

  const series = [current, previous].filter(Boolean) as PaceSeries[];
  const max = Math.max(...series.flatMap((item) => item.points.map((point) => point.value)));
  const ticks = getTicks(max);
  const top = ticks[ticks.length - 1];

  const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const plotHeight = height - MARGIN.top - MARGIN.bottom;
  const x = (index: number) => MARGIN.left + (days > 1 ? (index / (days - 1)) * plotWidth : 0);
  const y = (value: number) => MARGIN.top + plotHeight - (value / top) * plotHeight;
  const baseline = y(0);

  const linePath = (points: PaceSeries["points"]) =>
    points.map((point, index) => `${index ? "L" : "M"}${x(index)},${y(point.value)}`).join("");

  const currentLast = current.points.length - 1;
  const currentEnd = current.points[currentLast];
  const previousEnd = previous?.points[previous.points.length - 1];
  const xTicks = [...DAY_TICKS.filter((day) => day < days - 2), days];

  const moveActive = (step: number) =>
    setActive((index) => Math.min(days - 1, Math.max(0, (index ?? currentLast) + step)));

  const handlePointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const left = event.currentTarget.getBoundingClientRect().left;
    const index = Math.round(((event.clientX - left - MARGIN.left) / plotWidth) * (days - 1));
    setActive(Math.min(days - 1, Math.max(0, index)));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, Home: -days, End: days };
    if (event.key in steps) {
      event.preventDefault();
      moveActive(steps[event.key]);
    }
  };

  const tooltipRows =
    active === null
      ? []
      : [
          { series: current, key: "bg-expense" },
          ...(previous ? [{ series: previous, key: "bg-chart-muted" }] : []),
        ]
          .map(({ series: item, key }) => ({ label: item.label, key, point: item.points[active] }))
          .filter((row) => row.point);

  const summary = [
    currentEnd && `${current.label}: đã chi ${formatVND(currentEnd.value)} tính đến hôm nay.`,
    previousEnd && `${previous?.label}: cả tháng chi ${formatVND(previousEnd.value)}.`,
    "Dùng phím mũi tên để xem từng ngày.",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="group"
      aria-label={`Biểu đồ chi tiêu cộng dồn. ${summary}`}
      onKeyDown={handleKeyDown}
      onFocus={() => setActive((index) => index ?? currentLast)}
      onBlur={() => setActive(null)}
      className={cn(
        "relative rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-card",
        className
      )}
      style={{ height }}
    >
      {width > 0 && (
        <svg
          width={width}
          height={height}
          className="block touch-pan-y overflow-visible"
          onPointerMove={handlePointer}
          onPointerLeave={() => setActive(null)}
          aria-hidden
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={MARGIN.left}
                x2={MARGIN.left + plotWidth}
                y1={y(tick)}
                y2={y(tick)}
                className={tick === 0 ? "stroke-foreground/25" : "stroke-border"}
                strokeWidth={1}
                shapeRendering="crispEdges"
              />
              <text
                x={MARGIN.left - 10}
                y={y(tick)}
                dy="0.32em"
                textAnchor="end"
                className="fill-muted-foreground text-[11px] tabular-nums"
              >
                {formatCompactVND(tick)}
              </text>
            </g>
          ))}

          {xTicks.map((day) => (
            <text
              key={day}
              x={x(day - 1)}
              y={baseline + 18}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] tabular-nums"
            >
              {day}
            </text>
          ))}

          {previous && previous.points.length > 1 && (
            <path
              d={linePath(previous.points)}
              pathLength={1}
              className="pace-draw fill-none stroke-chart-muted"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {current.points.length > 1 && (
            <>
              <path
                d={`${linePath(current.points)}L${x(currentLast)},${baseline}L${x(0)},${baseline}Z`}
                className="pace-fade fill-expense/10"
              />
              <path
                d={linePath(current.points)}
                pathLength={1}
                className="pace-draw fill-none stroke-expense"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </>
          )}

          {previous && previousEnd && (
            <text
              x={x(previous.points.length - 1) + 10}
              y={y(previousEnd.value)}
              dy="0.32em"
              className="pace-fade fill-muted-foreground text-xs font-medium"
            >
              {formatCompactVND(previousEnd.value)}
            </text>
          )}

          {currentEnd && (
            <g className="pace-fade">
              {currentEnd.value > 0 && (
                <text
                  x={x(currentLast)}
                  y={y(currentEnd.value) - 12}
                  textAnchor={
                    currentLast < days * 0.1 ? "start" : currentLast > days * 0.9 ? "end" : "middle"
                  }
                  className="fill-foreground font-narrow text-[13px] font-semibold"
                >
                  {formatCompactVND(currentEnd.value)}
                </text>
              )}
              <circle
                cx={x(currentLast)}
                cy={y(currentEnd.value)}
                r={4.5}
                className="fill-expense stroke-card"
                strokeWidth={2}
              />
            </g>
          )}

          {active !== null && (
            <g>
              <line
                x1={x(active)}
                x2={x(active)}
                y1={MARGIN.top}
                y2={baseline}
                className="stroke-foreground/30"
                strokeWidth={1}
                shapeRendering="crispEdges"
              />
              {tooltipRows.map((row) => (
                <circle
                  key={row.label}
                  cx={x(active)}
                  cy={y(row.point.value)}
                  r={4}
                  className={cn(
                    "stroke-card",
                    row.key === "bg-expense" ? "fill-expense" : "fill-chart-muted"
                  )}
                  strokeWidth={2}
                />
              ))}
            </g>
          )}
        </svg>
      )}

      <div aria-live="polite" className="sr-only">
        {tooltipRows
          .map((row) => `${row.label} ngày ${dayMonth(row.point.date)}: ${formatVND(row.point.value)}`)
          .join(". ")}
      </div>

      {active !== null && tooltipRows.length > 0 && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-10 min-w-[11rem] rounded-md border bg-popover px-3 py-2 text-xs shadow-md"
          // Đường cộng dồn luôn đi lên nên góc trên-trái và dưới-phải luôn trống
          style={
            x(active) > width * 0.6
              ? { top: MARGIN.top, right: width - x(active) + 12 }
              : { bottom: MARGIN.bottom + 8, left: x(active) + 12 }
          }
        >
          <p className="mb-1.5 font-medium text-foreground">Ngày {active + 1}</p>
          {tooltipRows.map((row) => (
            <div key={row.label} className="flex items-center gap-2 py-0.5">
              <LineKey className={row.key} />
              <span className="font-narrow text-[13px] font-semibold tabular-nums text-foreground">
                {formatVND(row.point.value)}
              </span>
              <span className="ml-auto pl-3 text-muted-foreground">{row.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaceChart;
