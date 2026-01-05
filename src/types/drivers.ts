
import { z } from "zod";



export type DriverT = {
  driverId: number;
  driverName: string;
  driverCode: string;
  companyApplicationId: string; // unique
}


export const DriverSchema = z.object({
  driverId: z.number().int().positive(),
  driverName: z.string().min(1),
  driverCode: z.string().min(1),
  companyApplicationId: z.string(),
});

export type DriverSchemaT = z.infer<typeof DriverSchema>;
