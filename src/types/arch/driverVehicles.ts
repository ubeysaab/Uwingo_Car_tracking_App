// import { z } from "zod";


// export type DriverVehicleT = {
//   driverVehicleId: number;
//   drivers_Id: number;
//   vehicle_Id: number;
//   identificationDate: string;
//   terminationDate: string;
//   companyApplicationId: string;
// };


// export const DriverVehicleSchema = z.object({
//   driverVehicleId: z.number().int().positive(),
//   drivers_Id: z.number().int().positive(),
//   vehicle_Id: z.number().int().positive(),
//   identificationDate: z.date(),
//   terminationDate: z.date(),
//   companyApplicationId: z.string(),
// });

// export type DriverVehicleSchemaT = z.infer<typeof DriverVehicleSchema>;
