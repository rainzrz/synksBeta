
const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      return { error: 'Network error' };
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Companies methods
  async getCompanies() {
    return this.request<any[]>('/companies');
  }

  async getCompany(id: string) {
    return this.request<any>(`/companies/${id}`);
  }

  async createCompany(company: { name: string; description?: string }) {
    return this.request<any>('/companies', {
      method: 'POST',
      body: JSON.stringify(company),
    });
  }

  async updateCompany(id: string, company: { name: string; description?: string }) {
    return this.request<any>(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(company),
    });
  }

  async deleteCompany(id: string) {
    return this.request<any>(`/companies/${id}`, {
      method: 'DELETE',
    });
  }

  // Links methods
  async getLinks() {
    return this.request<any[]>('/links');
  }

  async getCompanyLinks(companyId: string) {
    return this.request<any[]>(`/links/company/${companyId}`);
  }

  async createLink(link: { name: string; url: string; description?: string; company_id: string }) {
    return this.request<any>('/links', {
      method: 'POST',
      body: JSON.stringify(link),
    });
  }

  async updateLink(id: string, link: { name: string; url: string; description?: string }) {
    return this.request<any>(`/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(link),
    });
  }

  async deleteLink(id: string) {
    return this.request<any>(`/links/${id}`, {
      method: 'DELETE',
    });
  }

  async checkLink(id: string) {
    return this.request<any>(`/links/${id}/check`, {
      method: 'POST',
    });
  }

  // Profile methods
  async getProfile() {
    return this.request<any>('/profile');
  }

  async updateProfile(profile: { name?: string; avatar_url?: string }) {
    return this.request<any>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Tools methods
  async getTools() {
    return this.request<any[]>('/tools');
  }

  async createTool(tool: { name: string; url: string; description?: string; icon?: string; category?: string }) {
    return this.request<any>('/tools', {
      method: 'POST',
      body: JSON.stringify(tool),
    });
  }

  async updateTool(id: string, tool: { name: string; url: string; description?: string; icon?: string; category?: string }) {
    return this.request<any>(`/tools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tool),
    });
  }

  async deleteTool(id: string) {
    return this.request<any>(`/tools/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
