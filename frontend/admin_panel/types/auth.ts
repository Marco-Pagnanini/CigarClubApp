// types/auth.ts
export interface User {
  email: string;
  name?: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
