import { AnalysisApi } from "@api/analysis_api";
import { useQuery } from "@tanstack/react-query";

export const useCountAllUser = () => {
  return useQuery<number>({
    queryKey: ["analysis_count_all_user"],
    queryFn: () => AnalysisApi.countAllUser(),
  });
};
