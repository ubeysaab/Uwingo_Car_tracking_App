// fetchPipeline.ts
import { FinalMapDTO } from "@/types/forMap"
// import { getActiveDevice, getBySrnLastList } from "../endpoints";
import { ENDPOINTS } from "@/api/endpoints";
interface DeviceData {
  serialNumber: string;
  speed: number;
  workingstatus: boolean;
  latitude: number;
  longitude: number;
  suffix: string | null;
  outPutStatus: boolean;
}


import api from "../../config/api";



export async function fetchFinalMapData(): Promise<FinalMapDTO[]> {

  // 1️⃣ Fetch Endpoint A
  const res = await api.get(ENDPOINTS.Devices.getActiveDevice)
  const data = await res.data;


  // 2️⃣ Extract valid serial numbers
  const serialNumbers: string[] = data
    .map((item: any) => item.deviceVehicle?.devices?.serialNumber)
    .filter(Boolean)

  // 3️⃣ Fetch Endpoint B "with mongo there is not token this why i don't use axios because there is a global interceptor "
  const secondRes = await fetch(ENDPOINTS.Others.getBySrnLastList, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(serialNumbers),
  })

  const secondData: DeviceData[] = await secondRes.json()


  // 4️⃣ Index B by serialNumber 
  const trackingBySerial = new Map(
    secondData.map((x) => [x.serialNumber, x])
  )

  // 5️⃣ Final merge 
  const result: FinalMapDTO[] = data
    .map((x: any) => {
      const serial = x.deviceVehicle?.devices?.serialNumber;

      if (!serial || !trackingBySerial.has(serial)) {
        return null; // skip if no tracking
      }

      const tracking = trackingBySerial.get(serial)!;

      return {
        Suffix: tracking.suffix,

        trackingData: {
          Latitude: tracking.latitude,
          Longitude: tracking.longitude,
          OutPutStatus: tracking.outPutStatus,
          SerialNumber: serial,
          speed: tracking.speed,
          Suffix: tracking.suffix,
          WorkingStatus: tracking.workingstatus,
        },

        vehicles: {
          CompnayApplicationId:
            x.deviceVehicle?.devices?.companyApplicationId ?? null,
          FirstKilometer: x.vehicle?.firstKilometer ?? 0,
          IsItForRent: x.vehicle?.isItForRent ?? false,
          IsThereDriver: x.vehicle?.isThereDriver ?? false,
          Make: x.vehicle?.make ?? "",
          Model: x.vehicle?.model ?? "",
          Plate: x.vehicle?.plate ?? "",
          VIN: x.vehicle?.vin ?? "",
          VehicleId: x.vehicle?.vehicleId ?? 0,
          Year: x.vehicle?.year ?? 0,
        },
      };
    })
    .filter(Boolean) as FinalMapDTO[];

  // console.log("FINAL MAP DATA COUNT:", result.length)
  // console.log("SAMPLE DTO:", result[0])

  return result
}
