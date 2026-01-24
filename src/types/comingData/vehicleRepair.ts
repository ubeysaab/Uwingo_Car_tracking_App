import { z } from "zod";


export interface VehicleRepairApplicationT {
  vehicleRepairId: number;
  vehicleId: number;
  repairDate: string; // ISO 8601 format
  faultType: string;
  faultDescription: string;
  repairAction: string;
  performedBy: string;
  repairCost: number;
  notes: string;
  images: string[]; // Assuming an array of URLs or Base64 strings
  companyApplicationId: string;
}


export const vehicleRepairApplicationSchema = z.object({
  vehicleRepairId: z.number().int(),
  vehicleId: z.number().int(),
  // Validates the string format. If your API excludes 'Z', 
  // we use a generic string validation or regex.
  // repairDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
  //   message: "Invalid date format",
  // }),
  repairDate: z.string(),
  faultType: z.string().min(1, "Fault type is required"),
  faultDescription: z.string().min(1, "Description is required"),
  repairAction: z.string().min(1, "Repair action is required"),
  performedBy: z.string().min(1, "Service provider is required"),
  // Validates as a number, allowing decimals, minimum 0
  repairCost: z.number().min(0, "Cost cannot be negative"),
  notes: z.string(),
  images: z.array(z.string()),
  companyApplicationId: z.string()
});


export type vehicleRepairApplicationSchemaT = z.infer<typeof vehicleRepairApplicationSchema>