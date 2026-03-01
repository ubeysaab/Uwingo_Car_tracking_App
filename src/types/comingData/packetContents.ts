import { z } from "zod";
import i18n from '@/localization/i18n';

const t = (key: string) => i18n.t(key);

export const PacketContentsApplicationSchema = z.object({
  packetContentId: z.number().int(),

  packet_Id: z.number()
    .positive({ error: () => t("validationErrors.packetNameRequired") }),

  fieldName: z.string()
    .min(3, { error: () => t("validationErrors.fieldNameLength") }),

  description: z.string()
    .min(3, { error: () => t("validationErrors.descriptionLength") }),

  companyApplicationId: z.string()
});

export type PacketContentsApplicationSchemaT = z.infer<typeof PacketContentsApplicationSchema>;

export interface PacketContentsApplicationT {
  packetContentId: number;
  packet_Id: number;
  fieldName: string;
  description: string;
  companyApplicationId: string;
}

// export interface PacketContentsApplicationT {
//   packetContentId: number,
//   packet_Id: number,
//   fieldName: string,
//   description: string,
//   companyApplicationId: string
// }


// // TODO : ADD VALIDATION MESSAGES OF THE FORM HERE
// export const PacketContentsApplicationSchema = z.object({
//   packetContentId: z.number(),
//   packet_Id: z.number().positive({ error: "The Packet Name Should Be Selected" }),
//   fieldName: z.string().min(3, { error: 'the length should be 3 character at least' }),
//   description: z.string().min(3, { error: 'the length should be 3 character at least' }),
//   companyApplicationId: z.string(),
// });


// export type PacketContentsApplicationSchemaT = z.infer<typeof PacketContentsApplicationSchema>;