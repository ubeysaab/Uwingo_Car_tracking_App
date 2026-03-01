import { z } from "zod";
import i18n from '@/localization/i18n';

const t = (key: string) => i18n.t(key);

// Assuming these constants are defined in your project
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/;

export const VehicleMaintenanceApplicationSchema = z.object({
  periodicMaintenanceId: z.number().int(),

  vehicle_Id: z.number()
    .int()
    .positive({ error: () => t("validationErrors.vehicleRequired") }),

  periodInMonths: z.number().int().min(0),

  periodInKilometers: z.number().int().min(0),

  lastMaintenanceDate: z.string()
    .regex(ISO_DATE_REGEX, { error: () => t("validationErrors.invalidDateFormat") })
    .refine((val) => !isNaN(Date.parse(val)), { error: () => t("validationErrors.invalidDateValue") }),

  performedBy: z.string()
    .min(1, { error: () => t("validationErrors.performedByRequired") }),

  description: z.string().optional(),

  kilometer: z.number().int().min(0, { error: () => t("validationErrors.invalidKilometer") }),

  nextMaintenanceDate: z.string()
    .regex(ISO_DATE_REGEX, { error: () => t("validationErrors.invalidDateFormat") }),

  companyApplicationId: z.string(),

  images: z.array(z.string()).default([]),

}).refine((data) => {
  const last = new Date(data.lastMaintenanceDate);
  const next = new Date(data.nextMaintenanceDate);
  return next >= last;
}, {
  error: () => t("validationErrors.maintenanceDateComparison"),
  path: ["nextMaintenanceDate"],
});

export type VehicleMaintenanceApplicationSchemaT = z.infer<typeof VehicleMaintenanceApplicationSchema>;

export interface VehicleMaintenanceApplicationT {
  periodicMaintenanceId: number;
  vehicle_Id: number;
  periodInMonths: number;
  periodInKilometers: number;
  lastMaintenanceDate: string;
  performedBy: string;
  description: string;
  kilometer: number;
  nextMaintenanceDate: string;
  companyApplicationId: string;
  images: string[];
}













// import { z } from "zod";

// /**
//  * .NET Compatibility Regex:
//  * ISO 8601: Matches YYYY-MM-DDTHH:mm:ss (with optional milliseconds and Z)
//  * UUID/GUID: Matches the standard 8-4-4-4-12 hex format
//  */
// const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/;
// const GUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;






// export enum PeriodInMonths {
//   ONE = 1,
//   TWO = 2,
//   THREE = 3,
//   FOUR = 4,
//   FIVE = 5,
//   SIX = 6,
//   SEVEN = 7,
//   EIGHT = 8,
//   NINE = 9,
//   TEN = 10,
//   ELEVEN = 11,
//   TWELVE = 12,
//   // THIRTEEN = 13,
//   // FOURTEEN = 14,
//   // FIFTEEN = 15,
//   // SIXTEEN = 16,
//   // SEVENTEEN = 17,
//   // EIGHTEEN = 18,
//   // NINETEEN = 19,
//   // TWENTY = 20,
//   // TWENTY_ONE = 21,
//   // TWENTY_TWO = 22,
//   // TWENTY_THREE = 23,
//   // TWENTY_FOUR = 24
// }



// // Decoration = looks meaningful
// // Symbol = enforces meaning







// export interface VehicleMaintenanceApplicationT {
//   periodicMaintenanceId: number;
//   vehicle_Id: number;
//   periodInMonths: number;
//   periodInKilometers: number;
//   lastMaintenanceDate: string;
//   performedBy: string;
//   description: string;
//   kilometer: number;
//   nextMaintenanceDate: string;
//   companyApplicationId: string;
//   images: string[]
// }
// export const VehicleMaintenanceApplicationSchema = z.object({
//   periodicMaintenanceId: z.number().int(),
//   vehicle_Id: z.number().int(),
//   periodInMonths: z.number().int().min(0),
//   periodInKilometers: z.number().int().min(0),

//   // Handled with Regex + Date.parse for double security
//   lastMaintenanceDate: z.string()
//     .regex(ISO_DATE_REGEX, "Invalid ISO 8601 date format")
//     .refine((val) => !isNaN(Date.parse(val)), "Invalid date value"),

//   performedBy: z.string().min(1, "Performed by is required"),

//   // .optional() doesn't allow nulls from API; .nullable() is safer for DB records
//   description: z.string(),

//   kilometer: z.number().int().min(0),

//   nextMaintenanceDate: z.string()
//     .regex(ISO_DATE_REGEX, "Invalid ISO 8601 date format"),

//   // Manual GUID validation for older Zod versions
//   companyApplicationId: z.string().regex(GUID_REGEX, "Invalid GUID format"),
// });

// export type VehicleMaintenanceApplicationSchemaT = z.infer<typeof VehicleMaintenanceApplicationSchema>;