import { z } from "zod";
import i18n from '@/localization/i18n';

const t = (key: string) => i18n.t(key);

export const vehicleRepairApplicationSchema = z.object({
  vehicleRepairId: z.number().int(),
  
  vehicleId: z.number()
    .int()
    .positive({ error: ()=>t("validationErrors.vehicleRequired") }),

  repairDate: z.string()
    .min(1, { error: ()=>t("validationErrors.repairDateRequired") }),

  faultType: z.string()
    .min(1, { error: ()=>t("validationErrors.faultTypeRequired") }),

  faultDescription: z.string()
    .min(1, { error: ()=>t("validationErrors.descriptionRequired") }),

  repairAction: z.string()
    .min(1, { error: ()=>t("validationErrors.repairActionRequired") }),

  performedBy: z.string()
    .min(1, { error: ()=>t("validationErrors.performedByRequired") }),

  // Validates as a number, allowing decimals (like 150.50), minimum 0
  repairCost: z.number()
    .min(0, { error: ()=>t("validationErrors.invalidCost") }),

  notes: z.string().optional(),

  images: z.array(z.string()).default([]),

  companyApplicationId: z.string()
});

export type vehicleRepairApplicationSchemaT = z.infer<typeof vehicleRepairApplicationSchema>;

export interface VehicleRepairApplicationT {
  vehicleRepairId: number;
  vehicleId: number;
  repairDate: string;
  faultType: string;
  faultDescription: string;
  repairAction: string;
  performedBy: string;
  repairCost: number;
  notes: string;
  images: string[];
  companyApplicationId: string;
}


// import { z } from "zod";


// export interface VehicleRepairApplicationT {
//   vehicleRepairId: number;
//   vehicleId: number;
//   repairDate: string; // ISO 8601 format
//   faultType: string;
//   faultDescription: string;
//   repairAction: string;
//   performedBy: string;
//   repairCost: number;
//   notes: string;
//   images: string[]; // Assuming an array of URLs or Base64 strings
//   companyApplicationId: string;
// }


// export const vehicleRepairApplicationSchema = z.object({
//   vehicleRepairId: z.number().int(),
//   vehicleId: z.number().int(),

//   repairDate: z.string(),
//   faultType: z.string().min(1, "Fault type is required"),
//   faultDescription: z.string().min(1, "Description is required"),
//   repairAction: z.string().min(1, "Repair action is required"),
//   performedBy: z.string().min(1, "Service provider is required"),
//   // Validates as a number, allowing decimals, minimum 0
//   repairCost: z.number().min(0, "Cost cannot be negative"),
//   notes: z.string(),
//   images: z.array(z.string()),
//   companyApplicationId: z.string()
// });


// export type vehicleRepairApplicationSchemaT = z.infer<typeof vehicleRepairApplicationSchema>


















  // Validates the string format. If your API excludes 'Z', 
  // we use a generic string validation or regex.
  // repairDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
  //   message: "Invalid date format",
  // }),