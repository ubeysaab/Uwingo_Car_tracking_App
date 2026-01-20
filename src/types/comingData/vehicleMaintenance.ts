import { z } from "zod";

/**
 * .NET Compatibility Regex:
 * ISO 8601: Matches YYYY-MM-DDTHH:mm:ss (with optional milliseconds and Z)
 * UUID/GUID: Matches the standard 8-4-4-4-12 hex format
 */
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/;
const GUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

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
}

export const VehicleMaintenanceApplicationSchema = z.object({
  periodicMaintenanceId: z.number().int(),
  vehicle_Id: z.number().int(),
  periodInMonths: z.number().int().min(0),
  periodInKilometers: z.number().int().min(0),

  // Handled with Regex + Date.parse for double security
  lastMaintenanceDate: z.string()
    .regex(ISO_DATE_REGEX, "Invalid ISO 8601 date format")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date value"),

  performedBy: z.string().min(1, "Performed by is required"),

  // .optional() doesn't allow nulls from API; .nullable() is safer for DB records
  description: z.string(),

  kilometer: z.number().int().min(0),

  nextMaintenanceDate: z.string()
    .regex(ISO_DATE_REGEX, "Invalid ISO 8601 date format"),

  // Manual GUID validation for older Zod versions
  companyApplicationId: z.string().regex(GUID_REGEX, "Invalid GUID format"),
});

export type VehicleMaintenanceApplicationSchemaT = z.infer<typeof VehicleMaintenanceApplicationSchema>;