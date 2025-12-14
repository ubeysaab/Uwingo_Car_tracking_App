// Auth state type only — no implementation details here.
import { z } from "zod";



export type AuthStateT = {
  accessToken: string | null;
  setAccessToken: (t: string) => void;
  clearSession: () => void;
};


export type NormalizedErrorT = {
  message: string;
  status?: number;
  original?: any;
};



export const LoginSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
  // add missing fields from your real JSON
});



export type LoginResponseT = z.infer<typeof LoginSchema>




// Define validation schema with Zod
export const loginCredentialsValidationSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z
    .string()
    .min(8, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
})

export type loginCredentialsValidationSchemaT = z.infer<typeof loginCredentialsValidationSchema>




