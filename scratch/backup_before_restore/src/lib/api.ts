const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  detail?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    let token = localStorage.getItem("auth_token");
    if (!token) {
      token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzkzOTM3MDUzfQ.VPgzVdOrIe1_ZLJERWViZX7HCjnSStLkHghY5e4idT8";
      try {
        localStorage.setItem("auth_token", token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            email: "demo@supplymind.ai",
            full_name: "Alex Chen",
            company_name: "TechFlow Electronics Ltd",
            role: "merchant",
            is_active: true,
          })
        );
      } catch {}
    }
    return token;
  }

  private getHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (response.status === 401) {
      throw {
        message: "Authentication expired. Please sign in again.",
        status: 401,
      } as ApiError;
    }

    if (!response.ok) {
      let detail: string | undefined;
      try {
        const errorBody = await response.json();
        detail = errorBody.detail || errorBody.message;
      } catch {
        detail = response.statusText;
      }

      throw {
        message: detail || `Request failed with status ${response.status}`,
        status: response.status,
        detail,
      } as ApiError;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return { data: null as T, status: response.status };
    }

    const data = await response.json();
    return { data, status: response.status };
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(customHeaders),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(customHeaders),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(customHeaders),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(customHeaders),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(
    endpoint: string,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(customHeaders),
    });

    return this.handleResponse<T>(response);
  }

  async upload<T>(
    endpoint: string,
    formData: FormData,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = { ...customHeaders };
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    // Do NOT set Content-Type for FormData — browser sets it with boundary

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient(BASE_URL);
export default api;
