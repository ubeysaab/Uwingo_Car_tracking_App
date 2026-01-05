import { z } from "zod";



export interface VehicleApplicationT {
  year: number
  vin: string;
  vehicleId: number;
  plate: string;
  model: string;
  make: string;
  isThereDriver: boolean;
  isItForRent: boolean;
  firstKilometer: number;
  companyApplicationId: string;
}



export const VehicleApplicationSchema = z.object({
  year: z.number(),
  vin: z.string(),
  vehicleId: z.number().nonnegative(),
  plate: z.string(),
  model: z.string(),
  make: z.string(),
  isThereDriver: z.boolean(),
  isItForRent: z.boolean(),
  firstKilometer: z.number().nonnegative(),
  companyApplicationId: z.string(),
});


export type VehicleApplicationSchemaT = z.infer<typeof VehicleApplicationSchema>;