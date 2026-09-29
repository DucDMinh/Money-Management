import { Totals } from "./Filter";

export type ReportPeriod = "day" | "week" | "month" | "year";

export interface PeriodTotals {
    key: string,
    label: string,
    start: string,
    end: string,
    totals: Totals
}

export interface Overview extends PeriodTotals {
    previous: PeriodTotals,
    change: {
        income: number | null,
        expense: number | null
    }
}

export interface OverviewResponse {
    date: string,
    day: Overview,
    week: Overview,
    month: Overview,
    year: Overview
}

export interface CategoryTotal {
    category: string,
    total: number,
    count: number,
    percent: number
}

export interface PeriodBucket {
    key: string,
    label: string,
    start: string,
    end: string,
    income: number,
    expense: number,
    balance: number,
    count: number
}

export interface ChartPoint {
    key: string,
    label: string,
    shortLabel: string,
    income: number,
    expense: number,
    balance: number
}

export interface SummaryResponse {
    period: ReportPeriod,
    key: string,
    label: string,
    start: string,
    end: string,
    prev: string,
    next: string,
    totals: Totals,
    byCategory: {
        expense: CategoryTotal[],
        income: CategoryTotal[]
    },
    subPeriod: "day" | "month" | null,
    breakdown: PeriodBucket[]
}

export interface SeriesResponse {
    period: ReportPeriod,
    start: string,
    end: string,
    totals: Totals,
    items: PeriodBucket[]
}
