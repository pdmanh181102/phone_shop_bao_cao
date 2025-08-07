import { AnalysisApi } from "@api/analysis_api";
import { useQuery } from "@tanstack/react-query";
import { CountByStatusResponse } from "@type/analysis";

export const useCountOrderByStatus = () => {
  return useQuery<CountByStatusResponse[]>({
    queryKey: ["analysis_count_order_by_status"],
    queryFn: () => AnalysisApi.countOrderByStatus(),
  });
};
