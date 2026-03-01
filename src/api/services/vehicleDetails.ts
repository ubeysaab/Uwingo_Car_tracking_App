import callApi from "@/api/config/apiCall";
import { ENDPOINTS } from "@/api/endpoints";
import z from "zod";


export const vehicleDetailsService = {
  // GET
  getAllDetailsOfVehicle: (id: string | number) => callApi('get', `${ENDPOINTS.VehicleDetails.get}?id=${id}`, z.any()),

  // create 

}