import callApi from "@/api/config/apiCall";
import { ENDPOINTS } from "@/api/endpoints";
import { DriverApplicationT, DriverSchema } from "@/types/comingData/drivers";
import z from "zod";

export const DriverVehiclesService = {
  // GET
  getAll: () => callApi('get', ENDPOINTS.DriverVehicles.get, z.array(z.any())),

  // create 

  create: (data: any) => callApi('post', ENDPOINTS.DriverVehicles.create, z.any(), data),

  // // PUT (Update)
  update: (data: Partial<DriverApplicationT>) =>
    callApi('put', `${ENDPOINTS.DriverVehicles.update}`, z.any(), data),

  // // DELETE
  delete: (id: string | number) =>
    callApi('delete', `${ENDPOINTS.DriverVehicles.delete}/${id}`, z.any()),
};