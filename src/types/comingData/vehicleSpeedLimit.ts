import { z } from "zod";
import i18n from '@/localization/i18n';

const t = (key: string) => i18n.t(key);

export const vehicleSpeedLimitApplicationSchema = z.object({
  // vehicleSpeedLimitId: z.number().int(),

  vehicleId: z.number()
    .int()
    .positive({ error: () => t("validationErrors.vehicleRequired") }),

  // Validates that speed limit is at least 0
  speedLimit: z.number({
    error: t("validationErrors.mustBeNumber")
  }).min(0, { error: () => t("validationErrors.negativeSpeedLimit") }),

  startDate: z.string()
    .min(1, { error: () => t("validationErrors.startDateRequired") }),

  endDate: z.string()
    .min(1, { error: () => t("validationErrors.endDateRequired") }),

  description: z.string()
    .min(1, { error: () => t("validationErrors.descriptionRequired") }),

  // companyApplicationId: z.string().nullable()

}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  error: () => t("validationErrors.dateComparison"),
  path: ["endDate"],
});





export type vehicleSpeedLimitApplicationSchemaT = z.infer<typeof vehicleSpeedLimitApplicationSchema>;

export interface VehicleSpeedLimitApplicationT {
  vehicleSpeedLimitId: number;
  vehicleId: number;
  speedLimit: number;
  startDate: string;
  endDate: string;
  description: string;
  companyApplicationId?: string;
}











// import { z } from "zod";

// export interface VehicleSpeedLimitApplicationT {
//   vehicleSpeedLimitId: number;
//   vehicleId: number;
//   speedLimit: number;
//   startDate: string; // ISO 8601 format
//   endDate: string;   // ISO 8601 format
//   description: string;
//   companyApplicationId: string; // UUID
// }

// export const vehicleSpeedLimitApplicationSchema = z.object({
//   vehicleSpeedLimitId: z.number().int(),
//   vehicleId: z.number().int(),
//   // Hız limiti 0 veya daha yüksek olmalı
//   speedLimit: z.number().min(0, "Hız limiti negatif olamaz"),
//   startDate: z.string(),
//   endDate: z.string(),
//   description: z.string().min(1, "Açıklama boş bırakılamaz"),
//   companyApplicationId: z.string()
// }).refine((data) => {
//   const start = new Date(data.startDate);
//   const end = new Date(data.endDate);
//   return end >= start;
// }, {
//   message: "Bitiş tarihi başlangıç tarihinden önce olamaz",
//   path: ["endDate"],
// });

// export type vehicleSpeedLimitApplicationSchemaT = z.infer<typeof vehicleSpeedLimitApplicationSchema>;