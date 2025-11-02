import api from './api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  verificationCode: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  resetToken: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  profilePicture?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    const authData = response.data.data;
    
    // Store tokens and user data
    localStorage.setItem('accessToken', authData.tokens.accessToken);
    localStorage.setItem('refreshToken', authData.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    return authData;
  }

  async verifyEmail(data: VerifyEmailData): Promise<{ message: string; user: User }> {
    const response = await api.post('/auth/verify-email', data);
    return response.data.data;
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data.data;
  }

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', data);
    return response.data.data;
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string; tokens: any }> {
    const response = await api.post('/auth/reset-password', data);
    return response.data.data;
  }

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await api.post('/auth/change-password', data);
    return response.data.data;
  }

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data.data.user;
  }

  async updateProfile(data: { name?: string; profilePicture?: string }): Promise<User> {
    const response = await api.put('/auth/profile', data);
    return response.data.data.user;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export default new AuthService();
