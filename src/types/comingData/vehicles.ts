import { z } from "zod";
import i18n from '@/localization/i18n';

const t = (key: string) => i18n.t(key);

export const VehicleApplicationSchema = z.object({
  // Vehicle ID is usually positive for existing records or 0 for new ones
  vehicleId: z.number().int().nonnegative(),

  year: z.number({
    error: t("validationErrors.mustBeNumber")
  }).min(1900, { error: () => t("validationErrors.invalidYear") })
    .max(new Date().getFullYear() + 1, { error: () => t("validationErrors.invalidYear") }),

  vin: z.string()
    .min(1, { error: () => t("validationErrors.vinRequired") }),

  plate: z.string()
    .min(1, { error: () => t("validationErrors.plateRequired") }),

  model: z.string()
    .min(1, { error: () => t("validationErrors.modelRequired") }),

  make: z.string()
    .min(1, { error: () => t("validationErrors.makeRequired") }),

  isThereDriver: z.boolean({
    error: () => t("validationErrors.fieldRequired")
  }),

  isItForRent: z.boolean({
    error: () => t("validationErrors.fieldRequired")
  }),

  firstKilometer: z.number({
    error: () => t("validationErrors.mustBeNumber")
  }).nonnegative({ error: () => t("validationErrors.negativeKm") }),

  companyApplicationId: z.string()
});

export type VehicleApplicationSchemaT = z.infer<typeof VehicleApplicationSchema>;

export type VehicleApplicationT = {
  year: number;
  vin: string;
  vehicleId: number;
  plate: string;
  model: string;
  make: string;
  isThereDriver: boolean;
  isItForRent: boolean;
  firstKilometer: number;
  companyApplicationId: string;
};