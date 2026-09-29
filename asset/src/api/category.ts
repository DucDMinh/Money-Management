import queriesKeys from "@/consts/queriesKeys"
import { CategoryResponse } from "@/interfaces/category"
import { useQuery } from "@tanstack/react-query"
import { api } from "./global"
import httpService from "@/services/httpService"

const key = queriesKeys.category

export const useCategory = () => {
    return useQuery({
        queryKey: [key],
        queryFn: () => {
            return api<CategoryResponse>(httpService.get(`/api/categories`))
        }
    })
}