import { AccountApi } from "@api/account_api";
import { useQuery } from "@tanstack/react-query";

export const useAccountRole = ({ account_uid }: { account_uid: string }) => {
    return useQuery({
        queryKey: ['account_roles', account_uid],
        queryFn: () => AccountApi.readAllRoles(account_uid)
    });
};
