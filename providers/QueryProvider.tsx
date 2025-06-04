"use client"; // Ini sangat penting karena QueryClientProvider adalah komponen klien

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Pengaturan default untuk semua query
            staleTime: 5 * 60 * 1000, // Data dianggap 'stale' setelah 5 menit
            refetchOnWindowFocus: false, // Jangan refetch saat window mendapat fokus
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={true} />{" "}
      {/* Devtools untuk debugging */}
    </QueryClientProvider>
  );
}
