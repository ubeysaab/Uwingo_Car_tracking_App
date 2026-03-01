// // fetchPipeline.ts
import { GetActiveDevicesEndPoint, FinalMapDTO, GetBySerialNumberList_MongoEndPoint, CreateInstantDataEndpoint_send, CreateInstantDataEndpoint_whatGet } from "@/types/forMap"
import { ENDPOINTS } from "@/api/endpoints";
import api from "@/api/config/api";




export async function fetchFinalMapData(): Promise<CreateInstantDataEndpoint_whatGet[] | CreateInstantDataEndpoint_send[]> {
  console.log("start fetch pipeline")
  // 1️⃣ Fetch Active Devices
  const res = await api.get(ENDPOINTS.Devices.getActiveDevice);
  const deviceData: GetActiveDevicesEndPoint[] = res.data;

  // 2️⃣ Extract Serial Numbers
  const serialNumbers = deviceData
    .map((item) => item.deviceVehicle?.devices?.serialNumber)
    .filter(Boolean) as string[];

  if (serialNumbers.length === 0) return [];

  // 3️⃣ Fetch Tracking Data from Mongo (Bypassing Axios interceptor)
  const mongoRes = await fetch(ENDPOINTS.Others.getBySrnLastList, {
    method: "POST", // Standardized to uppercase
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(serialNumbers),
  });

  if (!mongoRes.ok) throw new Error("Failed to fetch MongoDB tracking data");

  const trackingDataRaw: GetBySerialNumberList_MongoEndPoint[] = await mongoRes.json();

  // 4️⃣ Create Dictionary for O(1) lookup
  const trackingMap = new Map(trackingDataRaw.map((t) => [t.serialNumber, t]));

  // 5️⃣ Merge and Format in ONE pass
  const instantDataList = deviceData
    .map((item) => {
      const serial = item.deviceVehicle?.devices?.serialNumber;
      const tracked = serial ? trackingMap.get(serial) : null;

      // Skip if we don't have tracking info for this active device
      if (!tracked || !item.vehicle) return null;

      return {
        serialNumber: serial,
        speed: tracked.speed,
        workingstatus: tracked.workingstatus,
        outPutStatus: tracked.outPutStatus,
        latitude: tracked.latitude,
        longitude: tracked.longitude,
        suffix: tracked.suffix || "--",
        vehicleId: item.vehicle.vehicleId,
        make: item.vehicle.make || "",
        model: item.vehicle.model || "",
        year: item.vehicle.year || 0,
        vIN: item.vehicle.vin || "",
        plate: item.vehicle.plate || "",
        isThereDriver: item.vehicle.isThereDriver ?? false,
        isItForRent: item.vehicle.isItForRent ?? false,
        companyApplicationId: item.deviceVehicle?.devices?.companyApplicationId || null,
        isBlocked: false, // Or map from actual property if available
        sufflix: "--",
      };
    })
    .filter((item): item is CreateInstantDataEndpoint_send => item !== null);

  // 6️⃣ Sync back to the SQL Backend and get the Final UI Data
  if (instantDataList.length > 0) {
    try {
      // The backend returns the final list (possibly with more fields)
      const finalRes = await api.post(ENDPOINTS.Others.instantData, instantDataList);
      // 
      console.log("-------FECH PIPELINE________________--")
      console.log(finalRes.data)
      // Return the data property from the Axios response
      return finalRes.data;
    } catch (err) {
      // console.error("Failed to sync instant data to SQL:", err);
      //! Fallback: return the local list so the UI doesn't break if the sync fails
      return instantDataList;
    }
  }

  return []
}






















// export async function fetchFinalMapData(): Promise<CreateInstantDataEndpoint[]> {

//   // 1️⃣ Fetch Endpoint A
//   const res = await api.get(ENDPOINTS.Devices.getActiveDevice)
//   const data: GetActiveDevicesEndPoint[] = await res.data;
//   console.log('1️⃣data fetched from get getActiveDevice : ', data)


//   // 2️⃣ Extract valid serial numbers
//   const serialNumbers: string[] = data
//     .map((item: any) => item.deviceVehicle?.devices?.serialNumber)
//     .filter(Boolean)

//   // 3️⃣ Fetch Endpoint B "with mongo there is not token this why i don't use axios because there is a global interceptor "
//   const secondRes = await fetch(ENDPOINTS.Others.getBySrnLastList, {
//     method: "Post",
//     headers: {
//       "Content-Type": "application/json",
//     },

//     body: JSON.stringify(serialNumbers),
//   })

//   const secondData: GetBySerialNumberList_MongoEndPoint[] = await secondRes.json()

//   console.log("Second data", secondData)

//   // 4️⃣ Index B by serialNumber
//   const trackingBySerialDictionary = new Map(
//     secondData.map((x) => [x.serialNumber, x]) // key:serialNumber,value: x object
//   )

//   // 5️⃣  merge  active devices with mongo
//   const result: FinalMapDTO[] = data
//     .map((x: any) => {
//       const serial = x.deviceVehicle?.devices?.serialNumber;

//       if (!serial || !trackingBySerialDictionary.has(serial)) {
//         return null; // skip if no tracking
//       }

//       const trackedVehicle = trackingBySerialDictionary.get(serial)!;

//       return {
//         Suffix: trackedVehicle.suffix,

//         trackingData: {
//           Latitude: trackedVehicle.latitude,
//           Longitude: trackedVehicle.longitude,
//           OutPutStatus: trackedVehicle.outPutStatus,
//           SerialNumber: serial,
//           speed: trackedVehicle.speed,
//           Suffix: trackedVehicle.suffix,
//           WorkingStatus: trackedVehicle.workingstatus,
//         },

//         vehicles: {
//           CompnayApplicationId:
//             x.deviceVehicle?.devices?.companyApplicationId ?? null,
//           FirstKilometer: x.vehicle?.firstKilometer ?? 0,
//           IsItForRent: x.vehicle?.isItForRent ?? false,
//           IsThereDriver: x.vehicle?.isThereDriver ?? false,
//           Make: x.vehicle?.make ?? "",
//           Model: x.vehicle?.model ?? "",
//           Plate: x.vehicle?.plate ?? "",
//           VIN: x.vehicle?.vin ?? "",
//           VehicleId: x.vehicle?.vehicleId ?? 0,
//           Year: x.vehicle?.year ?? 0,
//         },
//       };
//     })
//     .filter(Boolean) as FinalMapDTO[];

//   // console.log("FINAL MAP DATA COUNT:", result.length)
//   // console.log("SAMPLE DTO:", result[0])



//   // 5️⃣ send to instandData endpoint


//   const instantDataList: CreateInstantDataEndpoint[] = result.map((x: FinalMapDTO) => {
//     if (x.trackingData === null || !x.vehicles === null) {
//       return null; // skip if no tracking
//     }
//     return {
//       SerialNumber : x.trackingData.SerialNumber,
//         Speed : x.trackingData.speed,
//         Workingstatus : x.trackingData.WorkingStatus,
//         OutPutStatus : x.trackingData.OutPutStatus,
//         Latitude : x.trackingData.Latitude,
//         Longitude : x.trackingData.Longitude,
//         Suffix : "--",
//         // DateTime : x.trackingData.,
//         // OdoMeter : x.trackingData.OdoMeter,

//         VehicleId : x.vehicles.VehicleId,
//         Make : x.vehicles.Make,
//         Model : x.vehicles.Model,
//         Year : x.vehicles.Year,
//         VIN : x.vehicles.VIN,
//         Plate : x.vehicles.Plate,
//         IsThereDriver : x.vehicles.IsThereDriver,
//         IsItForRent : x.vehicles.IsItForRent,
//         CompanyApplicationId : x.vehicles.CompnayApplicationId,

//         IsBlocked : x.IsBlocked,
//         Sufflix : "--",
//       }


//   })

//   return instantDataList
// }


