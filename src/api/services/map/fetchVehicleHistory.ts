// import api from "@/api/config/api";
// import { ENDPOINTS } from "@/api/endpoints";

// export async function fetchVehicleHistory(vehicleId: number, start: Date, end: Date) {
//   // Logic from FiltreIndex
//   const devices = await api.get(`${ENDPOINTS.Devices.getByVehicleId}/${vehicleId}`);
//   const serialNumber = devices.data.serialNumber;
  
//   // Note: Use fetch here as well if the Mongo API doesn't use the standard token
//   const response = await fetch(
//     `${MONGO_BASE_URL}/api/TrackingData/getby-filtre?serialNumber=${serialNumber}&firstDate=${start.toISOString()}&lastDate=${end.toISOString()}`
//   );
//   return await response.json();
// }