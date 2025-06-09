const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://codeveer-production.up.railway.app';

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isProfileComplete: boolean;
  };
}

export class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ApiService {
  private baseURL = API_BASE_URL;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };
    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new ApiError(data.message || `HTTP error! status: ${response.status}`, response.status);
      }
      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error) throw new ApiError(error.message);
      throw new ApiError('An unexpected error occurred');
    }
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Helper method to get auth token from localStorage
  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Helper method to set auth token in localStorage
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  // Helper method to remove auth token from localStorage
  removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiService = new ApiService(); 