import { useQuery } from "@tanstack/react-query";
import { getStatsOverview } from "./statsService";
import { queryKeys } from "../../lib/queryKeys";

export function useStatsOverview() {
  return useQuery({
    queryKey: queryKeys.stats.overview,
    queryFn: getStatsOverview,
    staleTime: 30_000,
    retry: 1,
  });
}
