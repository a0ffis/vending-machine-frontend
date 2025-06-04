import { fetchCashInInventory, fetchMasCash } from "@/services/admin-service";
import { useQuery } from "@tanstack/react-query";

export function useCashInInventory(params = {}) {
  return useQuery({
    queryKey: ["cash-in-inventory"],
    queryFn: () => fetchCashInInventory(params),
  });
}

export function useMasCash(params = {}) {
  return useQuery({
    queryKey: ["mas-cash"],
    queryFn: () => fetchMasCash(params),
  });
}
