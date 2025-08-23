/**
 * API Client for backend communication
 * 
 * TODO: Extend this client with your specific API methods
 */

export class ApiClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
    
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authorization header
   * TODO: Call this after user authentication
   */
  setAuthToken(token: string) {
    this.headers = {
      ...this.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Handle API responses
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }
    return response.json();
  }

  /**
   * Health check endpoint
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}/api/health`, {
      headers: this.headers,
    });
    return this.handleResponse(response);
  }

  /**
   * Generic GET request
   * TODO: Use this as a template for your GET endpoints
   */
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.headers,
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Generic POST request
   * TODO: Use this as a template for your POST endpoints
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Generic PUT request
   * TODO: Use this as a template for your PUT endpoints
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Generic DELETE request
   * TODO: Use this as a template for your DELETE endpoints
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.headers,
    });
    return this.handleResponse<T>(response);
  }

  // TODO: Add your specific API methods here
  // Examples:
  // async getUsers() { return this.get<User[]>('/api/users'); }
  // async createUser(user: CreateUserDto) { return this.post<User>('/api/users', user); }
  // async updateUser(id: string, user: UpdateUserDto) { return this.put<User>(`/api/users/${id}`, user); }
  // async deleteUser(id: string) { return this.delete<void>(`/api/users/${id}`); }
}

// Export singleton instance
export const apiClient = new ApiClient();