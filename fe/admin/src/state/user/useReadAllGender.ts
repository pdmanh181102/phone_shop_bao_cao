import { UserGenderApi } from "@api/user_gender_api";
import { useQuery } from "@tanstack/react-query";

export const useReadAllGender = () => {
    return useQuery({
        queryKey: ['genders'],
        queryFn: () => UserGenderApi.readAll()
    });
};
