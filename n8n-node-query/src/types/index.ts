export interface CustomQueryOptions {
    query: string;
    parameters?: Record<string, any>;
}

export interface QueryResponse {
    success: boolean;
    data?: any;
    error?: string;
}