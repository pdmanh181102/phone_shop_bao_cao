import { AnalysisApi } from "@api/analysis_api";
import { useQuery } from "@tanstack/react-query";

export const useCountAllOrder = () => {
  return useQuery<number>({
    queryKey: ["analysis_count_all_order"],
    queryFn: () => AnalysisApi.countAllOrder(),
  });
};
