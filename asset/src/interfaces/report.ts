import { Totals } from "./Filter";

export type ReportPeriod = "day" | "week" | "month" | "year";

export interface OverviewResponse {
    date: string,
    day: Overview,
    week: Overview,
    month: Overview,
    year: Overview
}

export interface Overview {
    key: string,
    label: string,
    start: string,
    end: string,
    totals: Totals
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
