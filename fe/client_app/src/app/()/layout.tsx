'use client';

import { MessageProvider } from "@/context/MessageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";

const queryClient = new QueryClient();

export default function ProviderLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<ConfigProvider>
        <QueryClientProvider client={queryClient}>
            <MessageProvider>{children}</MessageProvider>
        </QueryClientProvider>
    </ConfigProvider>);
}