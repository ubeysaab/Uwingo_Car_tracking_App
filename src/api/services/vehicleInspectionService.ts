import callApi from "@/api/config/apiCall";
import { ENDPOINTS } from "@/api/endpoints";
import { VehicleInspectionApplicationT } from "@/types/comingData/vehicleInspection";

import z from "zod";

export const vehicleInspectionService = {
  // GET
  getAll: () => callApi('get', ENDPOINTS.VehicleInspection.get, z.array(z.any())),

  // create 

  create: (data: Partial<VehicleInspectionApplicationT>) => callApi('post', ENDPOINTS.VehicleInspection.create, z.any(), data),

  // // PUT (Update)
  update: (data: Partial<VehicleInspectionApplicationT>) =>
    callApi('put', `${ENDPOINTS.VehicleInspection.update}`, z.any(), data),

  // // DELETE
  delete: (id: string | number) =>
    callApi('delete', `${ENDPOINTS.VehicleInspection.delete}/${id}`, z.any()),
};