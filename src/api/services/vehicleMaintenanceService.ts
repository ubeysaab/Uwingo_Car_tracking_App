import callApi from "@/api/config/apiCall";
import { ENDPOINTS } from "@/api/endpoints";
import { VehicleMaintenanceApplicationSchema, VehicleMaintenanceApplicationT } from "@/types/comingData/vehicleMaintenance";
import z from "zod";

export const vehicleMaintenanceService = {
  // GET
  getAll: () => callApi('get', ENDPOINTS.PeriodicMaintenances.get, z.array(z.any())),

  // create 

  create: (data: Partial<VehicleMaintenanceApplicationT>) => callApi('post', ENDPOINTS.PeriodicMaintenances.create, z.any(), data),

  // // PUT (Update)
  update: (data: Partial<VehicleMaintenanceApplicationT>) =>
    callApi('put', `${ENDPOINTS.PeriodicMaintenances.update}`, z.any(), data),

  // // DELETE
  delete: (id: string | number) =>
    callApi('delete', `${ENDPOINTS.PeriodicMaintenances.delete}/${id}`, z.any()),
};