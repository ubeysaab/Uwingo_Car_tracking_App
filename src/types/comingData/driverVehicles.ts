import { z } from 'zod'

export interface DriverVehiclesApplicationT {
  driverVehicleId?: number,
  drivers_Id: number | undefined,
  vehicle_Id: number | undefined,
  identificationDate?: Date,
  terminationDate?: null | Date,
  companyApplicationId?: string
}


export const DriverVehiclesSchema = z.object({
  driverVehicleId: z.number(),
  drivers_Id: z.number().optional(),
  vehicle_Id: z.number().optional(),
  identificationDate: z.date(),
  driverCode: z.date().nullable(),
  companyApplicationId: z.string(),
});

export type DriverVehiclesSchemaT = z.infer<typeof DriverVehiclesSchema>;
