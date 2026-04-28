export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePicture?: string;
  role: string;
  emailVerified: boolean;
  connectedProviders: string[];
}

export interface ApiError {
  error: string;
  message: string;
}
