
import { z } from "zod";
export interface VehicleInspectionApplicationT {
  vehicleInspectionId: number;
  vehicleId: number;
  inspectionDate: string; // ISO 8601 format
  expiryDate: string;     // ISO 8601 format
  notes: string;
  companyApplicationId: string;
}


export const vehicleInspectionApplicationTSchema = z.object({
  vehicleInspectionId: z.number().int(),
  vehicleId: z.number().int(),

  inspectionDate: z.string(),
  expiryDate: z.string(),
  notes: z.string(),
  companyApplicationId: z.string()
}).refine((data) => {
  const start = new Date(data.inspectionDate);
  const end = new Date(data.expiryDate);
  return end >= start;
}, {
  message: "Bitiş tarihi, muayene tarihinden önce olamaz",
  path: ["expiryDate"], // Hata mesajının hangi alanda görüneceğini belirler
});


export type vehicleInspectionApplicationTSchemaT = z.infer<typeof vehicleInspectionApplicationTSchema>