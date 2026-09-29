import { Pagination, Totals } from "./Filter";

export type TransactionType = "expense" | "income";

export interface TransactionFilter {
    type?: TransactionType;
    category?: string;
    q?: string;
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
}

export interface Transaction {
    id: string,
    userId: string,
    type: TransactionType,
    amount: number,
    category: string,
    note: string,
    date: string,
    createdAt: string,
    updatedAt: string
}

export type TransactionPayload = Pick<Transaction, "type" | "amount" | "category" | "note" | "date">;

export interface TransactionResponse {
    items: Transaction[],
    pagination: Pagination,
    totals: Totals
}