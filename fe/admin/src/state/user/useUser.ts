import { UserApi } from "@api/user_api";
import { useQuery } from "@tanstack/react-query";

export const useUser = ({ user_uid }: { user_uid: string | null }) => {
  return useQuery({
    queryKey: ["user", user_uid],
    queryFn: () => UserApi.readByUid(user_uid),
    enabled: !!user_uid,
    staleTime: 0,
  });
};
