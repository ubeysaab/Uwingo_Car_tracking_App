import callApi from "@/api/config/apiCall";
import { ENDPOINTS } from "@/api/endpoints";

import z from "zod";
import { DriverSchema, DriverApplicationT } from "@/types/comingData/drivers";

export const DriverService = {
  // GET
  getAll: () => callApi('get', ENDPOINTS.Drivers.get, z.array(DriverSchema)),

  // create 

  create: (data: any) => callApi('post', ENDPOINTS.Drivers.create, z.any(), data),

  // // PUT (Update)
  update: (data: Partial<DriverApplicationT>) =>
    callApi('put', `${ENDPOINTS.Drivers.update}`, z.any(), data),

  // // DELETE
  delete: (id: string | number) =>
    callApi('delete', `${ENDPOINTS.Drivers.delete}/${id}`, z.any()),
};