import { AnalysisApi } from "@api/analysis_api";
import { useQuery } from "@tanstack/react-query";

export const useEntrySummary = (startDate?: Date, endDate?: Date) => {
  return useQuery<any>({
    queryKey: ["analysis_entry_summaries", startDate, endDate],
    queryFn: () => AnalysisApi.inventoryEntrySummaries(startDate, endDate),
    staleTime: 0,
  });
};
