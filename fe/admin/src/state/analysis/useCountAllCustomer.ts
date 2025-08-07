import { AnalysisApi } from "@api/analysis_api";
import { useQuery } from "@tanstack/react-query";

export const useCountAllCustomer = () => {
  return useQuery<number>({
    queryKey: ["analysis_count_all_customer"],
    queryFn: () => AnalysisApi.countAllCustomer(),
  });
};
