import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useAPI<T>(url: string | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher)

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}

export async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error("API error")
  return res.json()
}
