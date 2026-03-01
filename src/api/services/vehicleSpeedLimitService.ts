import callApi from "@/api/config/apiCall";
import { ENDPOINTS } from "@/api/endpoints";
import z from "zod";
import { VehicleSpeedLimitApplicationT } from "@/types/comingData/vehicleSpeedLimit";
export const VehicleSpeedLimitService = {
  // GET
  getAll: () => callApi('get', ENDPOINTS.VehicleSpeedLimit.get, z.array(z.any())),

  // create 

  create: (data: Partial<VehicleSpeedLimitApplicationT>) => callApi('post', ENDPOINTS.VehicleSpeedLimit.create, z.any(), data),

  // // PUT (Update)
  update: (data: Partial<VehicleSpeedLimitApplicationT>) =>
    callApi('put', `${ENDPOINTS.VehicleSpeedLimit.update}`, z.any(), data),

  // // DELETE
  delete: (id: string | number) =>
    callApi('delete', `${ENDPOINTS.VehicleSpeedLimit.delete}/${id}`, z.any()),
};