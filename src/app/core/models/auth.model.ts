export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: string;
  firstName?: string;
  lastName?: string;
  username?: string;
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
  roles: string[];
  emailVerified: boolean;
  connectedProviders: string[];
}

export interface ApiError {
  error: string;
  message: string;
}
