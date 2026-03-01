import callApi from "@/api/config/apiCall";
import { ENDPOINTS } from "@/api/endpoints";
import { DeviceVehicleApplicationT } from '@/types/comingData/deviceVehicle';

import z from "zod";

export const DeviceVehiclesService = {
  // GET
  getAll: () => callApi('get', ENDPOINTS.DeviceVehicles.get, z.array(z.any())),

  // create 

  create: (data: any) => callApi('post', ENDPOINTS.DeviceVehicles.create, z.any(), data),

  // // PUT (Update)
  update: (data: Partial<DeviceVehicleApplicationT>) =>
    callApi('put', `${ENDPOINTS.DeviceVehicles.update}`, z.any(), data),

  // // DELETE
  delete: (id: string | number) =>
    callApi('delete', `${ENDPOINTS.DeviceVehicles.delete}/${id}`, z.any()),
};