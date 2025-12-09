// fetchPipeline.ts
import { FinalMapDTO } from "../../types/forMap"
import { getActiveDevice, getBySrnLastList } from "../endpoints";

interface DeviceData {
  serialNumber: string;
  speed: number;
  workingstatus: boolean;
  latitude: number;
  longitude: number;
  suffix: string | null;
  outPutStatus: boolean;
}






const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiOUQyY3NDZzNSVTBETVVPYmlCVFRrZz09OitiT2h5RlRUWTJtN29MVDhXUVhVK0NWSmN6WUxzTlJKckhhSitHN1hQV3c9IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiQURuV1h6MHdzT0hnQm9sWXZnVFhKZz09OndiVW5hMEhnZi9qdmlJYzlqRWF5Z0RGVmhIWDFsYTJOSDhVZW9uYUVuTTQ9IiwidWlkIjoiZ0NxdnIwajRFaWJMaXg2TWlMVmJPdz09Ompod0dkQmRqKzJKZmN6cHNiM0pqSVl3WEQ5RUZaTDczalh6dmtxNHpkb1ZWQ3Y3a3dHbVZqRDBJa2p6djdNYTEiLCJjYWlkIjoiUjBmcmYwUElQNkpLNWt6Wk9lN1BCUT09OmR0YWo1Tm12UEZHV1MrVnFzRW5tVUNsZzZtbHZOc3R1bGcwdVpJVHdrM0xLUVF4VnNhUDdoRGlHckVzUVhjMVUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIrYzBRbm5KMHNHeVdJUWlya1JLUUVnPT06ZU83TWZRcFl5bEYwVFJXSk1POUUyQT09IiwiVmVoaWNsZSI6WyJHZXRWZWhpY2xlIiwiQ3JlYXRlVmVoaWNsZSIsIlVwZGF0ZVZlaGljbGUiLCJEZWxldGVWZWhpY2xlIl0sIkRldmljZSI6WyJHZXREZXZpY2UiLCJDcmVhdGVEZXZpY2UiLCJVcGRhdGVEZXZpY2UiLCJEZWxldGVEZXZpY2UiXSwiRHJpdmVyIjpbIkdldERyaXZlciIsIkNyZWF0ZURyaXZlciIsIlVwZGF0ZURyaXZlciIsIkRlbGV0ZURyaXZlciJdLCJQYWNrZXQiOlsiR2V0UGFja2V0IiwiQ3JlYXRlUGFja2V0IiwiVXBkYXRlUGFja2V0IiwiRGVsZXRlUGFja2V0Il0sIlBhY2tldENvbnRlbnQiOlsiR2V0UGFja2V0Q29udGVudCIsIkNyZWF0ZVBhY2tldENvbnRlbnQiLCJVcGRhdGVQYWNrZXRDb250ZW50IiwiRGVsZXRlUGFja2V0Q29udGVudCJdLCJEZXZpY2VWZWhpY2xlIjpbIkdldERldmljZVZlaGljbGUiLCJDcmVhdGVEZXZpY2VWZWhpY2xlIiwiVXBkYXRlRGV2aWNlVmVoaWNsZSIsIkRlbGV0ZURldmljZVZlaGljbGUiXSwiRHJpdmVyVmVoaWNsZSI6WyJHZXREcml2ZXJWZWhpY2xlIiwiQ3JlYXRlRHJpdmVyVmVoaWNsZSIsIlVwZGF0ZURyaXZlclZlaGljbGUiLCJEZWxldGVEcml2ZXJWZWhpY2xlIl0sIk1hcCI6IkdldE1hcCIsIlRyYWNraW5nRGF0YSI6IkdldFRyYWNraW5nRGF0YSIsIlBlcmlvZCI6WyJHZXRQZXJpb2QiLCJDcmVhdGVQZXJpb2QiLCJVcGRhdGVQZXJpb2QiLCJEZWxldGVQZXJpb2QiXSwiVHJhY2tpbmciOiJHZXRUcmFja2luZyIsIk1hcHMiOiJHZXRNYXBzIiwiUmVwb3J0IjpbIkdldFJlcG9ydCIsImdldFJlcG9ydCIsInVwZGF0ZVJlcG9ydCIsImRlbGV0ZVJlcG9ydCIsImNyZWF0ZVJlcG9ydCIsInNoYXJlUmVwb3J0Il0sIlZlaGljbGVDYXNjbyI6WyJHZXRWZWhpY2xlQ2FzY28iLCJVcGRhdGVWZWhpY2xlQ2FzY28iLCJDcmVhdGVWZWhpY2xlQ2FzY28iLCJEZWxldGVWZWhpY2xlQ2FzY28iXSwiVmVoaWNsZUluc3VyYW5jZSI6WyJHZXRWZWhpY2xlSW5zdXJhbmNlIiwiVXBkYXRlVmVoaWNsZUluc3VyYW5jZSIsIkNyZWF0ZVZlaGljbGVJbnN1cmFuY2UiLCJEZWxldGVWZWhpY2xlSW5zdXJhbmNlIl0sIlZlaGljbGVTcGVlZExpbWl0IjpbIkdldFZlaGljbGVTcGVlZExpbWl0IiwiVXBkYXRlVmVoaWNsZVNwZWVkTGltaXQiLCJDcmVhdGVWZWhpY2xlU3BlZWRMaW1pdCIsIkRlbGV0ZVZlaGljbGVTcGVlZExpbWl0Il0sIlZlaGljbGVJbnNwZWN0aW9uIjpbIkdldFZlaGljbGVJbnNwZWN0aW9uIiwiVXBkYXRlVmVoaWNsZUluc3BlY3Rpb24iLCJDcmVhdGVWZWhpY2xlSW5zcGVjdGlvbiIsIkRlbGV0ZVZlaGljbGVJbnNwZWN0aW9uIl0sIlZlaGljbGVSZXBhaXIiOlsiR2V0VmVoaWNsZVJlcGFpciIsIlVwZGF0ZVZlaGljbGVSZXBhaXIiLCJDcmVhdGVWZWhpY2xlUmVwYWlyIiwiRGVsZXRlVmVoaWNsZVJlcGFpciJdLCJEYXRhU291cmNlIjpbImdldERhdGFTb3VyY2UiLCJ1cGRhdGVEYXRhU291cmNlIiwiZGVsZXRlRGF0YVNvdXJjZSIsImNyZWF0ZURhdGFTb3VyY2UiXSwiUmVwb3J0RmlsdGVyIjpbImdldFJlcG9ydEZpbHRlciIsInVwZGF0ZVJlcG9ydEZpbHRlciIsImRlbGV0ZVJlcG9ydEZpbHRlciIsImNyZWF0ZVJlcG9ydEZpbHRlciJdLCJSZXBvcnRMb2ciOlsiZ2V0UmVwb3J0TG9nIiwiZGVsZXRlUmVwb3J0TG9nIl0sIlJlcG9ydFNoYXJpbmciOlsiZ2V0UmVwb3J0U2hhcmluZyIsInVwZGF0ZVJlcG9ydFNoYXJpbmciLCJkZWxldGVSZXBvcnRTaGFyaW5nIiwiY3JlYXRlUmVwb3J0U2hhcmluZyJdLCJCbG9ja2FnZSI6WyJnZXRCbG9ja2FnZSIsImNyZWF0ZUJsb2NrYWdlIl0sIlRyYWNraW5nRGF0YUFjYyI6WyJnZXRUcmFja2luZ0RhdGFBY2MiLCJjcmVhdGVUcmFja2luZ0RhdGFBY2MiLCJ1cGRhdGVUcmFja2luZ0RhdGFBY2MiLCJkZWxldGVUcmFja2luZ0RhdGFBY2MiXSwiVHJhY2tpbmdEYXRhU3RkIjpbImdldFRyYWNraW5nRGF0YVN0ZCIsImNyZWF0ZVRyYWNraW5nRGF0YVN0ZCIsInVwZGF0ZVRyYWNraW5nRGF0YVN0ZCIsImRlbGV0ZVRyYWNraW5nRGF0YVN0ZCJdLCJSb3V0ZSI6WyJjcmVhdGVSb3V0ZSIsImdldFJvdXRlIiwiZGVsZXRlUm91dGUiXSwiVHJhY2tpbmdBbmFseXNpcyI6WyJzYXZlVHJhY2tpbmdBbmFseXNpcyIsInZpZXdSb3V0ZUFuYWx5c2lzIiwiZ2V0VHJhY2tpbmdBbmFseXNpcyJdLCJleHAiOjE3NjQ3OTc1NzQsImlzcyI6InV3aW5nb2FyYWN0YWtpcCIsImF1ZCI6Ikh0dHBzOi8vdXdpbmdvYXJhY3Rha2lwLmNvbSJ9.NkbYERVRyZOeFU5Il7WoaBgy5ZvAhQJg-hCbZeTxdq4"

export async function fetchFinalMapData(): Promise<FinalMapDTO[]> {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }

  // 1️⃣ Fetch Endpoint A
  const res = await fetch(getActiveDevice, { headers })
  const data = await res.json()
  // console.log(" Data from active device : ", data)

  // 2️⃣ Extract valid serial numbers
  const serialNumbers: string[] = data
    .map((item: any) => item.deviceVehicle?.devices?.serialNumber)
    .filter(Boolean)

  // 3️⃣ Fetch Endpoint B (✅ correct headers + correct body)
  const secondRes = await fetch(getBySrnLastList, {
    method: "POST",
    headers,
    body: JSON.stringify(serialNumbers),
  })

  const secondData: DeviceData[] = await secondRes.json()
  // console.log(" 2nd Data from active device : ", secondData.length)

  // 4️⃣ Index B by serialNumber (✅ correct casing)
  const trackingBySerial = new Map(
    secondData.map((x) => [x.serialNumber, x])
  )

  // 5️⃣ Final merge (✅ all casing fixed)
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
