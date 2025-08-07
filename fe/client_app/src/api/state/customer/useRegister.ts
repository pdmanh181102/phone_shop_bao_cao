import { CustomerApi } from "@/api/client/customer_api";
import { CreateCustomer, Customer } from "@/api/type/customer";
import { useMutation } from "@tanstack/react-query";

export const useRegister = (
    onSuccess?: (data: Customer) => void,
    onError?: (message: string) => void
) => {
    return useMutation<Customer, Error, CreateCustomer>({
        mutationFn: (data) => CustomerApi.register(data),
        onSuccess: (data) => {
            onSuccess?.(data);
        },
        onError: (error) => {
            onError?.(error.message || "Đăng ký thất bại");
        },
    });
};
