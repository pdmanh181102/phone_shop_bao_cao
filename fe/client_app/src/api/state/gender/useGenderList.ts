import { GenderApi } from "@/api/client/gender_api";
import { useQuery } from "@tanstack/react-query";

export const useGenderList = () => {
    return useQuery({
        queryKey: ['genders'],
        queryFn: () => GenderApi.readAll()
    });
};
