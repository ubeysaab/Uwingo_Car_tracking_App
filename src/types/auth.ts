import i18n from '@/localization/i18n';
// Auth state type only — no implementation details here.
import { z } from "zod";
// (Zod Schemas & TS Types)


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



export type LoginSchemaT = z.infer<typeof LoginSchema>





const t = (key: string) => i18n.t(key);

export const loginCredentialsValidationSchema = z.object({
  username: z
    .string()
    .min(3, { message: t("validationErrors.usernameMin") })
    .max(20, { message: t("validationErrors.usernameMax") })
    .regex(/^[a-zA-Z0-9_]+$/, { message: t("validationErrors.usernameRegex") }),

  password: z
    .string()
    .min(8, { message: t("validationErrors.passwordMin") })
    .max(50, { message: t("validationErrors.passwordMax") })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      { message: t("validationErrors.passwordRegex") }
    ),
});

export type loginCredentialsValidationSchemaT = z.infer<typeof loginCredentialsValidationSchema>;


// Define validation schema with Zod
// export const loginCredentialsValidationSchema = z.object({
//   username: z
//     .string()
//     .min(3, "Username must be at least 3 characters")
//     .max(20, "Username must be less than 20 characters")
//     .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 6 characters")
//     .max(50, "Password must be less than 50 characters")
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//       "Password must contain at least one uppercase letter, one lowercase letter, and one number"
//     ),
// })

// export type loginCredentialsValidationSchemaT = z.infer<typeof loginCredentialsValidationSchema>


