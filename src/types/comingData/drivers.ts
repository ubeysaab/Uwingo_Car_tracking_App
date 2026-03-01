import { z } from "zod";
import i18n from '@/localization/i18n';

const t = (key: string) => i18n.t(key);

export const DriverApplicationSchema = z.object({
  driverId: z.number().int(),

  driverName: z.string()
    .min(2, { error: () => t("validationErrors.driverNameRequired") }),

  driverCode: z.string()
    .min(2, { error: () => t("validationErrors.driverCodeRequired") }),

  companyApplicationId: z.string()
});

export type DriverApplicationSchemaT = z.infer<typeof DriverApplicationSchema>;

export interface DriverApplicationT {
  driverId: number;
  driverName: string;
  driverCode: string;
  companyApplicationId: string;
}


// import { z } from "zod";



// export interface DriverApplicationT {
//   driverId: number;
//   driverName: string;
//   driverCode: string;
//   companyApplicationId: string;
// }


// export const DriverApplicationSchema = z.object({
//   driverId: z.number().int(),
//   driverName: z.string().min(2, { error: 'Driver Name Is Required and should be 2 characters at least' }),
//   driverCode: z.string().min(2, { error: 'Driver Code Is Required and should be 2 characters at least' }),
//   companyApplicationId: z.string(),
// });

// export type DriverApplicationSchemaT = z.infer<typeof DriverApplicationSchema>;
