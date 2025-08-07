import { UserApi } from "@api/user_api";
import { useQuery } from "@tanstack/react-query";

export const useUserAccount = ({ user_uid }: { user_uid: string }) => {
    return useQuery({
        queryKey: ['user_account', user_uid],
        queryFn: () => UserApi.readAccountByUserUid(user_uid),
        staleTime: 0
    });
};
