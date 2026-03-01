import { z } from 'zod';
import i18n from '@/localization/i18n';

const t = (key: string) => i18n.t(key);

export const DriverVehiclesSchema = z.object({
  driverVehicleId: z.number().int(),

  // Ensuring a driver is actually selected from the dropdown
  drivers_Id: z.number({
  }).positive(t("validationErrors.driverRequired")),

  // Ensuring a vehicle is actually selected from the dropdown
  vehicle_Id: z.number({
  }).positive(t("validationErrors.vehicleRequired")),

  identificationDate: z.string(),

  driverCode: z.string().nullable(),

  terminationDate: z.string().nullable(),

  companyApplicationId: z.string()
});

export type DriverVehiclesSchemaT = z.infer<typeof DriverVehiclesSchema>;

export interface DriverVehiclesApplicationT {
  driverVehicleId?: number;
  drivers_Id: number | undefined;
  vehicle_Id: number | undefined;
  identificationDate?: string;
  terminationDate?: null | string;
  companyApplicationId?: string;
}



















// import { z } from 'zod'

// export interface DriverVehiclesApplicationT {
//   driverVehicleId?: number,
//   drivers_Id: number | undefined,
//   vehicle_Id: number | undefined,
//   identificationDate?: string,
//   terminationDate?: null | string,
//   companyApplicationId?: string
// }


// export const DriverVehiclesSchema = z.object({
//   driverVehicleId: z.number(),
//   drivers_Id: z.number().optional(),
//   vehicle_Id: z.number().optional(),
//   identificationDate: z.string(),
//   driverCode: z.string().nullable(),
//   terminationDate: z.string().nullable(),
//   companyApplicationId: z.string(),
// });

// export type DriverVehiclesSchemaT = z.infer<typeof DriverVehiclesSchema>;
