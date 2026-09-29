import { Totals } from "@/interfaces/Filter";

export const getSpentRatio = (totals: Totals) =>
  totals.income > 0 ? (totals.expense / totals.income) * 100 : null;
