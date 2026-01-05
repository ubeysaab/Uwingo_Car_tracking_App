import callApi from "@/api/config/apiCall";
import { ENDPOINTS } from "@/api/endpoints";
import { VehicleApplicationSchema, VehicleApplicationT } from "@/types/vehicles";
import z from "zod";

export const VehicleService = {
  // GET
  getAll: () => callApi('get', ENDPOINTS.Vehicles.get, z.array(VehicleApplicationSchema)),

  // create 

  create: (data: any) => callApi('post', ENDPOINTS.Vehicles.create, z.any(), data),

  // // PUT (Update)
  update: (data: Partial<VehicleApplicationT>) =>
    callApi('put', `${ENDPOINTS.Vehicles.update}`, z.any(), data),

  // // DELETE
  delete: (id: string) =>
    callApi('delete', `${ENDPOINTS.Vehicles.delete}/${id}`, z.any()),
};