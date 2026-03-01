// ✅
import { z } from 'zod';

import i18n from '@/localization/i18n';

const t = (key: string) => i18n.t(key);

export const deviceVehicleApplicationSchema = z.object({
  connectionId: z.number().int(),

  device_Id: z.number()
    .int()
    .positive({ error: () => t("validationErrors.deviceRequired") }),

  vehicle_Id: z.number()
    .int()
    .positive({ error: () => t("validationErrors.vehicleRequired") }),

  installDate: z.string(),


  removeDate: z.string().nullable().optional(),

  companyApplicationId: z.string(),

  isRoleToBlockage: z.boolean(),
});

export type deviceVehicleApplicationSchemaT = z.infer<typeof deviceVehicleApplicationSchema>;

export interface DeviceVehicleApplicationT {
  connectionId: number;
  device_Id: number;
  vehicle_Id: number;
  installDate?: string;
  removeDate?: string;
  companyApplicationId: string;
  isRoleToBlockage: boolean;
}

/**
 * Cihaz ve Araç eşleşme bilgilerini temsil eden ana interface
 */
export interface DeviceVehicleApplicationT {
  connectionId: number;
  device_Id: number;
  vehicle_Id: number;
  installDate?: string;
  removeDate?: string;
  companyApplicationId: string;
  isRoleToBlockage: boolean;
}






// export const deviceVehicleApplicationSchema = z.object({
//   connectionId: z.number().int(),
//   device_Id: z.number().int(),
//   vehicle_Id: z.number().int(),
//   // Coerces string timestamps into actual JS Date objects
//   installDate: z.string(),
//   removeDate: z.string().nullable(),
//   // Validates the specific UUID format provided in your JSON
//   companyApplicationId: z.string(),
//   isRoleToBlockage: z.boolean(),
// });

// // Extract the TypeScript type from the schema
// export type deviceVehicleApplicationSchemaT = z.infer<typeof deviceVehicleApplicationSchema>;