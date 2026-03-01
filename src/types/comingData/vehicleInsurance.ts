import { z } from "zod";
import i18n from '@/localization/i18n';

const t = (key: string) => i18n.t(key);

export const vehicleInsuranceApplicationSchema = z.object({
  vehicleInsuranceId: z.number().int(),

  vehicleId: z.number()
    .int()
    .positive({ error: () => t("validationErrors.vehicleRequired") }),

  policyNumber: z.string()
    .min(1, { error: () => t("validationErrors.policyRequired") }),

  insuranceCompany: z.string()
    .min(1, { error: () => t("validationErrors.companyRequired") }),

  startDate: z.string()
    .min(1, { error: () => t("validationErrors.startDateRequired") }),

  endDate: z.string()
    .min(1, { error: () => t("validationErrors.endDateRequired") }),

  companyApplicationId: z.string()

}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  error: () => t("validationErrors.dateComparison"),
  path: ["endDate"], // Error attaches to the end date field
});

export type vehicleInsuranceApplicationSchemaT = z.infer<typeof vehicleInsuranceApplicationSchema>;

export interface VehicleInsuranceApplicationT {
  vehicleInsuranceId: number;
  vehicleId: number;
  policyNumber: string;
  insuranceCompany: string;
  startDate: string;
  endDate: string;
  companyApplicationId: string;
}











// import { z } from "zod";


// export interface VehicleInsuranceApplicationT {
//   vehicleInsuranceId: number;
//   vehicleId: number;
//   policyNumber: string;
//   insuranceCompany: string;
//   startDate: string; // ISO String format
//   endDate: string;   // ISO String format
//   companyApplicationId: string; // UUID string
// }


// export const vehicleInsuranceApplicationSchema = z.object({
//   vehicleInsuranceId: z.number().int(),
//   vehicleId: z.number().int(),
//   policyNumber: z.string().min(1),
//   insuranceCompany: z.string().min(1),
//   // Validates that the string is a valid ISO date format
//   startDate: z.string(),
//   endDate: z.string(),
//   // Validates that the string is a properly formatted UUID
//   companyApplicationId: z.string(),

// });

// export type vehicleInsuranceApplicationSchemaT = z.infer<typeof vehicleInsuranceApplicationSchema>;