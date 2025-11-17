// API Service pour DARRA Frontend
const API_BASE_URL = 'http://localhost:5000'; // Suppression du /api car notre serveur n'utilise pas ce préfixe

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  image: string;
  images?: string[];
  inStock?: boolean;
  stockQuantity?: number;
  origin?: string;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  tags?: string[];
  rating?: number;
  reviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Ajouter les headers existants s'ils existent
    if (options.headers) {
      Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
        headers[key] = value;
      });
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur réseau',
      };
    }
  }

  // Auth APIs
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response.data || { success: false };
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response.data || { success: false };
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Products APIs
  async getProducts(params?: {
    category?: string;
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.makeRequest<{ data: Product[]; meta: any }>(endpoint);
    
    // Notre serveur retourne { success: true, data: [...], meta: {...} }
    return response.data?.data || [];
  }

  async getProduct(id: string): Promise<Product | null> {
    const response = await this.makeRequest<{ data: Product }>(`/api/products/${id}`);
    return response.data?.data || null;
  }

  async createProduct(productData: Omit<Product, '_id' | 'id'>): Promise<Product | null> {
    const response = await this.makeRequest<{ data: Product }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response.data?.data || null;
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
    const response = await this.makeRequest<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return response.data || null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const response = await this.makeRequest(`/products/${id}`, {
      method: 'DELETE',
    });
    return response.success;
  }

  // Cart APIs
  async getCart(): Promise<any[]> {
    const response = await this.makeRequest<any[]>('/cart');
    return response.data || [];
  }

  async addToCart(productId: string, quantity: number = 1): Promise<boolean> {
    const response = await this.makeRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    return response.success;
  }

  async updateCartItem(productId: string, quantity: number): Promise<boolean> {
    const response = await this.makeRequest(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
    return response.success;
  }

  async removeFromCart(productId: string): Promise<boolean> {
    const response = await this.makeRequest(`/cart/${productId}`, {
      method: 'DELETE',
    });
    return response.success;
  }

  async clearCart(): Promise<boolean> {
    const response = await this.makeRequest('/cart/clear', {
      method: 'DELETE',
    });
    return response.success;
  }

  // Orders APIs
  async createOrder(orderData: {
    items: Array<{ product: string; quantity: number; price: number }>;
    shippingAddress: {
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      postalCode: string;
      country: string;
    };
    paymentMethod?: string;
  }): Promise<any> {
    const response = await this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response.data;
  }

  async getOrders(): Promise<any[]> {
    const response = await this.makeRequest<any[]>('/orders');
    return response.data || [];
  }

  async getOrder(id: string): Promise<any> {
    const response = await this.makeRequest(`/orders/${id}`);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:5000/health');
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();