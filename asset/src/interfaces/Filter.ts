export interface Pagination {
    page: number,
    limit: number,
    total: number,
    totalPages: number
}

export interface Totals {
    income: number,
    expense: number,
    balance: number,
    count: number
}