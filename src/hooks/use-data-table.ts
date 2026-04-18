import { useState, useCallback } from "react"

export interface DataTableState {
  sortBy?: string
  sortOrder: "asc" | "desc"
  search: string
  page: number
  pageSize: number
}

export function useDataTable(initialPageSize = 10) {
  const [state, setState] = useState<DataTableState>({
    sortOrder: "asc",
    search: "",
    page: 1,
    pageSize: initialPageSize,
  })

  const setSearch = useCallback((search: string) => {
    setState((prev) => ({ ...prev, search, page: 1 }))
  }, [])

  const setSort = useCallback((sortBy: string) => {
    setState((prev) => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }))
  }, [])

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }))
  }, [])

  return {
    state,
    setSearch,
    setSort,
    setPage,
  }
}
