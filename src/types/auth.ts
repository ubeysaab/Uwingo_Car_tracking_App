// Auth state type only — no implementation details here.
import { z } from "zod";



export type AuthStateT = {
  token: string | null;
  isHydrated: boolean;

  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  hydrate(): Promise<void>;
};


export type NormalizedErrorT = {
  message: string;
  status?: number;
  original?: any;
};



export const LoginSchema = z.object({
  token: z.string(),
  refreshToken: z.string()
  // add missing fields from your real JSON
});



export type LoginResponseT = z.infer<typeof LoginSchema>