import callApi from "@/api/config/apiCall";
import { ENDPOINTS } from "@/api/endpoints";

import z from "zod";

import { PacketContentsApplicationSchema, PacketContentsApplicationT } from "@/types/comingData/packetContents";

export const PacketContentsService = {
  // GET
  getAll: () => callApi('get', ENDPOINTS.PacketContents.get, z.array(PacketContentsApplicationSchema)),

  // create 

  create: (data: any) => callApi('post', ENDPOINTS.PacketContents.create, z.any(), data),

  // // PUT (Update)
  update: (data: Partial<PacketContentsApplicationT>) =>
    callApi('put', `${ENDPOINTS.PacketContents.update}`, z.any(), data),

  // // DELETE
  delete: (id: string | number) =>
    callApi('delete', `${ENDPOINTS.PacketContents.delete}/${id}`, z.any()),
};