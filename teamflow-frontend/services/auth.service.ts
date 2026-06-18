import { api } from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const AuthService = {
  login(payload: LoginPayload) {
    return api.post("/auth/login", payload);
  },

  register(payload: RegisterPayload) {
    return api.post("/auth/register", payload);
  },

  me() {
    return api.get("/auth/me");
  },
};
