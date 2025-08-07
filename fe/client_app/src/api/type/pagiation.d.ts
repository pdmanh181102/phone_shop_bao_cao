export interface FetcherParams {
    page?: number;
    size?: number;
    sortField?: string;
    sortOrder?: string | null;
    filters?: Record<string, any>;
}