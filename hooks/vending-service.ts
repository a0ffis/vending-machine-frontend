import { fetchProducts } from "@/services/vending-service";
import { useQuery } from "@tanstack/react-query";

export function useProductList(params = {}) {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(params),
  });
}
