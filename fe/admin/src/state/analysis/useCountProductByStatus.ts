import { AnalysisApi } from "@api/analysis_api";
import { useQuery } from "@tanstack/react-query";
import { CountByStatusResponse } from "@type/analysis";

export const useCountProductByStatus = () => {
  return useQuery<CountByStatusResponse[]>({
    queryKey: ["analysis_count_product_by_status"],
    queryFn: () => AnalysisApi.countProductByStatus(),
  });
};
