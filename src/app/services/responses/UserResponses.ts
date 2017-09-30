export interface LoginResponse {
  id: number;
  token: string;
}

export interface UserDetailResponse {
  id: number;
  username: string;
  location: string;
  email: string;
}

export interface SignupResponse {
    login: string;
    bio: string;
    company: string;
}