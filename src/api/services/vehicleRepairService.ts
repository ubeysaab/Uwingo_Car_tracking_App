import callApi from "@/api/config/apiCall";
import { ENDPOINTS } from "@/api/endpoints";
import { VehicleRepairApplicationT } from "@/types/comingData/vehicleRepair";
import z from "zod";

export const vehicleRepairService = {
  // GET
  getAll: () => callApi('get', ENDPOINTS.VehicleRepair.get, z.array(z.any())),

  // create 

  create: (data: Partial<VehicleRepairApplicationT>) => callApi('post', ENDPOINTS.VehicleRepair.create, z.any(), data),

  // // PUT (Update)
  update: (data: Partial<VehicleRepairApplicationT>) =>
    callApi('put', `${ENDPOINTS.VehicleRepair.update}`, z.any(), data),

  // // DELETE
  delete: (id: string | number) =>
    callApi('delete', `${ENDPOINTS.VehicleRepair.delete}/${id}`, z.any()),
};