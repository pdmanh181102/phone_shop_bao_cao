import { AnalysisApi } from "@api/analysis_api";
import { useQuery } from "@tanstack/react-query";

export const useOrderSummary = (startDate?: Date, endDate?: Date) => {
  return useQuery<any>({
    queryKey: ["analysis_order_summaries", startDate, endDate],
    queryFn: () => AnalysisApi.orderSummaries(startDate, endDate),
    staleTime: 0,
  });
};
