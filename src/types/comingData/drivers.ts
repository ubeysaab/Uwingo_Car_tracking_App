
import { z } from "zod";



export interface DriverApplicationT {
  driverId: number;
  driverName: string;
  driverCode: string;
  companyApplicationId: string;
}


export const DriverSchema = z.object({
  driverId: z.number().int(),
  driverName: z.string().min(2, { error: 'Driver Name Is Required and should be 2 characters at least' }),
  driverCode: z.string().min(2, { error: 'Driver Code Is Required and should be 2 characters at least' }),
  companyApplicationId: z.string(),
});

export type DriverSchemaT = z.infer<typeof DriverSchema>;
