import { AnalysisApi } from "@api/analysis_api";
import { useQuery } from "@tanstack/react-query";

export const useCountAllProduct = () => {
  return useQuery<number>({
    queryKey: ["analysis_count_all_product"],
    queryFn: () => AnalysisApi.countAllProduct(),
  });
};
