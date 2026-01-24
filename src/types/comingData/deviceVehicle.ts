import { z } from 'zod';






export type DeviceVehicleApplicationT = {
  connectionId: number;
  device_Id: number;
  vehicle_Id: number;
  installDate: string;
  removeDate: string | null;
  companyApplicationId: string;
  isRoleToBlockage: boolean;
};


export const deviceVehicleApplicationSchema = z.object({
  connectionId: z.number(),
  device_Id: z.number(),
  vehicle_Id: z.number(),
  installDate: z.string(),
  removeDate: z.string(),
  companyApplicationId: z.string(),
  isRoleToBlockage: z.boolean(),
});


export type deviceVehicleApplicationSchemaT = z.infer<typeof deviceVehicleApplicationSchema>;

