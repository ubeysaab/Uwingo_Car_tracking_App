import callApi from "@/api/config/apiCall";
import { ENDPOINTS } from "@/api/endpoints";
import { PacketApplicationSchema, PacketApplicationT } from "@/types/comingData/packets";
import z from "zod";

export const PacketsService = {
  // GET
  getAll: () => callApi('get', ENDPOINTS.Packets.get, z.array(z.any())),

  // create 

  create: (data: any) => callApi('post', ENDPOINTS.Packets.create, z.any(), data),

  // // PUT (Update)
  update: (data: Partial<PacketApplicationT>) =>
    callApi('put', `${ENDPOINTS.Packets.update}`, z.any(), data),

  // // DELETE
  delete: (id: string | number) =>
    callApi('delete', `${ENDPOINTS.Packets.delete}/${id}`, z.any()),
};