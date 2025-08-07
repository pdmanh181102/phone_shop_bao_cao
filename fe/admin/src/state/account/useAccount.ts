import { AccountApi } from "@api/account_api";
import { useQuery } from "@tanstack/react-query";

export const useAccount = ({ account_uid }: { account_uid: string | null }) => {
  return useQuery({
    queryKey: ["account", account_uid],
    queryFn: () => AccountApi.readByUid(account_uid),
  });
};
