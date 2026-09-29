import queriesKeys from "@/consts/queriesKeys"
import { OverviewResponse, ReportPeriod, SummaryResponse } from "@/interfaces/report"
import { useQuery } from "@tanstack/react-query"
import { api } from "./global"
import httpService from "@/services/httpService"

const key = queriesKeys.report

export const useOverviewReport = (date: string) => {
    return useQuery({
        queryKey: [key, date],
        queryFn: () => {
            return api<OverviewResponse>(httpService.get(`/api/reports/overview?date=${date}`))
        }
    })
}

export const useSummaryReport = (period: ReportPeriod, date: string) => {
    return useQuery({
        queryKey: [key, "summary", period, date],
        queryFn: () => {
            return api<SummaryResponse>(httpService.get(`/api/reports/summary`, { params: { period, date } }))
        },
        placeholderData: (previousData, previousQuery) =>
            previousQuery?.queryKey[2] === period ? previousData : undefined,
    })
}
