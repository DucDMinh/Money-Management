import queriesKeys from "@/consts/queriesKeys"
import { Transaction, TransactionFilter, TransactionPayload, TransactionResponse } from "@/interfaces/transaction"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "./global"
import httpService from "@/services/httpService"

const key = queriesKeys.transaction

export const useTransaction = (filters?: TransactionFilter) => {
    return useQuery({
        queryKey: [key, filters],
        queryFn: () => {
            return api<TransactionResponse>(httpService.get(`/api/transactions`, { params: filters }))
        },
        placeholderData: keepPreviousData,
    })
}

const useInvalidateTransactions = () => {
    const queryClient = useQueryClient()
    return () => Promise.all([
        queryClient.invalidateQueries({ queryKey: [key] }),
        queryClient.invalidateQueries({ queryKey: [queriesKeys.category] }),
    ])
}

export const useCreateTransaction = () => {
    const invalidate = useInvalidateTransactions()
    return useMutation({
        mutationFn: (payload: TransactionPayload) => {
            return api<Transaction>(httpService.post(`/api/transactions`, payload))
        },
        onSuccess: invalidate,
    })
}

export const useUpdateTransaction = () => {
    const invalidate = useInvalidateTransactions()
    return useMutation({
        mutationFn: ({ id, ...payload }: TransactionPayload & { id: string }) => {
            return api<Transaction>(httpService.put(`/api/transactions/${id}`, payload))
        },
        onSuccess: invalidate,
    })
}

export const useDeleteTransaction = () => {
    const invalidate = useInvalidateTransactions()
    return useMutation({
        mutationFn: (id: string) => {
            return api(httpService.delete(`/api/transactions/${id}`))
        },
        onSuccess: invalidate,
    })
}
