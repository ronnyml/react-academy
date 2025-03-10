export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: {
    success: boolean;
    message: string;
    data: {
      token: string;
      user: User;
    };
  };
}
