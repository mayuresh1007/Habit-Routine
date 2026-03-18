// Typed API client for frontend → backend communication
// Uses native fetch with automatic session token injection

interface ApiResponse<T> {
    data: T;
    ok: boolean;
    status: number;
}

interface ApiError {
    error: string;
    message: string;
    details?: Array<{ path: string[]; message: string }>;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                const error = data as ApiError;
                throw new ApiRequestError(
                    error.message || 'An unexpected error occurred',
                    response.status,
                    error.error,
                    error.details
                );
            }

            return {
                data: data as T,
                ok: true,
                status: response.status,
            };
        } catch (error) {
            if (error instanceof ApiRequestError) {
                throw error;
            }
            throw new ApiRequestError(
                'Network error. Please check your connection.',
                0,
                'NETWORK_ERROR'
            );
        }
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await this.request<T>(endpoint, { method: 'GET' });
        return response.data;
    }

    async post<T>(endpoint: string, body: unknown): Promise<T> {
        const response = await this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return response.data;
    }

    async put<T>(endpoint: string, body: unknown): Promise<T> {
        const response = await this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
        return response.data;
    }

    async patch<T>(endpoint: string, body: unknown): Promise<T> {
        const response = await this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
        return response.data;
    }

    async delete<T>(endpoint: string): Promise<T> {
        const response = await this.request<T>(endpoint, { method: 'DELETE' });
        return response.data;
    }
}

export class ApiRequestError extends Error {
    public status: number;
    public code: string;
    public details?: Array<{ path: string[]; message: string }>;

    constructor(
        message: string,
        status: number,
        code: string,
        details?: Array<{ path: string[]; message: string }>
    ) {
        super(message);
        this.name = 'ApiRequestError';
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

// Singleton instance — uses relative URLs so Next.js handles routing
export const api = new ApiClient('/api');

export default api;
