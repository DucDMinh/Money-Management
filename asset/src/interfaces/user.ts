export interface UserInfo {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  company: string;
  address: string;
  roles: string[];
  isFirstTimeLogin: boolean;
  name: string
}

export interface RegisterPayload {
  username: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: UserInfo;
}