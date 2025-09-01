import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.BACKEND_URL; 

class Api {
  private static async getHeaders(): Promise<HeadersInit_> {
    const token = await AsyncStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private static async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication endpoints
  static async post(url: string, body: any) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  static async get(url: string) {
    return this.request(url, {
      method: 'GET',
    });
  }

  static async put(url: string, body: any) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  static async delete(url: string) {
    return this.request(url, {
      method: 'DELETE',
    });
  }

  static async patch(url: string, body?: any) {
    return this.request(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // Auth methods
  static async register(userData: {
    email: string;
    password: string;
    displayName?: string;
  }) {
    return this.post('/auth/register', userData);
  }

  static async login(credentials: { email: string; password: string }) {
    return this.post('/auth/login', credentials);
  }

  static async googleSignIn(googleData: {
    googleId: string;
    email: string;
    displayName?: string;
    avatar?: string;
  }) {
    return this.post('/auth/google', googleData);
  }

  static async getProfile() {
    return this.get('/auth/profile');
  }

  static async updateProfile(profileData: {
    displayName?: string;
    avatar?: string;
  }) {
    return this.put('/auth/profile', profileData);
  }

  static async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.put('/auth/change-password', passwordData);
  }

  static async logout() {
    return this.post('/auth/logout', {});
  }

  // Task methods
  static async createTask(taskData: {
    title: string;
    description?: string;
    dueDate: Date;
    priority?: 'low' | 'medium' | 'high';
    category?: string;
    tags?: string[];
    notes?: string;
  }) {
     console.log('Creating task with data:', taskData);
    return this.post('/tasks', taskData);
  }

  static async getTasks(params?: {
    page?: number;
    limit?: number;
    isCompleted?: boolean;
    priority?: 'low' | 'medium' | 'high';
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const queryParams = params ? new URLSearchParams() : null;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams!.append(key, value.toString());
        }
      });
    }
    
    const url = queryParams ? `/tasks?${queryParams.toString()}` : '/tasks';
    return this.get(url);
  }

  static async getTaskById(id: string) {
    return this.get(`/tasks/${id}`);
  }

  static async updateTask(id: string, taskData: {
    title?: string;
    description?: string;
    dueDate?: Date;
    priority?: 'low' | 'medium' | 'high';
    isCompleted?: boolean;
    category?: string;
    tags?: string[];
    notes?: string;
  }) {
    return this.put(`/tasks/${id}`, taskData);
  }

  static async deleteTask(id: string) {
    return this.delete(`/tasks/${id}`);
  }

  static async toggleTaskCompletion(id: string) {
    return this.patch(`/tasks/${id}/toggle`);
  }

  static async getOverdueTasks() {
    return this.get('/tasks/overdue');
  }

  static async getUpcomingTasks(days?: number) {
    const url = days ? `/tasks/upcoming?days=${days}` : '/tasks/upcoming';
    return this.get(url);
  }

  static async getTaskStats() {
    return this.get('/tasks/stats');
  }

  static async bulkUpdateTasks(taskIds: string[], updates: any) {
    return this.put('/tasks/bulk/update', { taskIds, updates });
  }

  static async bulkDeleteTasks(taskIds: string[]) {
    return this.delete('/tasks/bulk/delete', { taskIds });
  }

  // User methods
  static async getUserProfile() {
    return this.get('/users/profile');
  }

  static async updateUserProfile(profileData: {
    displayName?: string;
    avatar?: string;
  }) {
    return this.put('/users/profile', profileData);
  }

  static async getUserStats() {
    return this.get('/users/stats');
  }

  static async getUserActivity(days?: number) {
    const url = days ? `/users/activity?days=${days}` : '/users/activity';
    return this.get(url);
  }

  static async deleteAccount(password: string) {
    return this.delete('/users/account', { password });
  }

  // Health check
  static async healthCheck() {
    return this.get('/health');
  }
}

export default Api;
