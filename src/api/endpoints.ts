import Config from 'react-native-config';


// export const getActiveDevice = "http://78.111.111.81:5191/api/DeviceVehicles/get-activedevice"
// export const getBySrnLastList = "http://78.111.111.81:5302/api/TrackingData/getby-srnlastlist"
// export const loginEndPoint = 'http://78.111.111.81:5191/api/Authentication/login'

/**
 * Application Endpoint Configuration
 */

const BASE_URL = Config.API_BASE_URL;
const MONGO_BASE_URL = Config.MONGO_BASE_URL;

export const ENDPOINTS = {
  // ✅
  Vehicles: {
    create: `${BASE_URL}/api/Vehicles/create-vehicle`,
    get: `${BASE_URL}/api/Vehicles/get-vehicles`,
    update: `${BASE_URL}/api/Vehicles/update-vehicle`,
    delete: `${BASE_URL}/api/Vehicles/delete-vehicle`,
  },
  // ✅
  Drivers: {
    create: `${BASE_URL}/api/Drivers/create-driver`,
    get: `${BASE_URL}/api/Drivers/get-driver`,
    update: `${BASE_URL}/api/Drivers/update-driver`,
    delete: `${BASE_URL}/api/Drivers/delete-driver`,
  },
  // ✅
  Devices: {
    getActiveDevice: `${BASE_URL}/api/DeviceVehicles/get-activedevice`,
    create: `${BASE_URL}/api/Devices/create-device`,
    get: `${BASE_URL}/api/Devices/get-device`,
    update: `${BASE_URL}/api/Devices/update-device`,
    delete: `${BASE_URL}/api/Devices/delete-device`,
  },

  DriverVehicles: {
    get: `${BASE_URL}/api/DriverVehicle/get-drivervehicle`,
    create: `${BASE_URL}/api/DriverVehicle/create-drivervehicle`,
    update: `${BASE_URL}/api/DriverVehicle/update-drivervehicle`,
    delete: `${BASE_URL}/api/DriverVehicle/delete-drivervehicle`,
  },

  DeviceVehicles: {
    get: `${BASE_URL}/api/DeviceVehicles/get-devicevehicle`,
    create: `${BASE_URL}/api/DeviceVehicles/create-devicevehicle`,
    update: `${BASE_URL}/api/DeviceVehicles/update-devicevehicle`,
    delete: `${BASE_URL}/api/DeviceVehicles/delete-devicevehicle`,
  },
  // ✅
  PacketContents: {
    get: `${BASE_URL}/api/PacketContent/get-packetcontent`,
    create: `${BASE_URL}/api/PacketContent/create-packetcontent`,
    update: `${BASE_URL}/api/PacketContent/update-packetcontent`,
    delete: `${BASE_URL}/api/PacketContent/delete-packetcontent`,
  },
  // ✅
  Packets: {
    get: `${BASE_URL}/api/Packets/get-packet`,
    create: `${BASE_URL}/api/Packets/create-packet`,
    update: `${BASE_URL}/api/Packets/update-packet`,
    delete: `${BASE_URL}/api/Packets/delete-packet`,
  },
  // ✅
  PeriodicMaintenances: {
    get: `${BASE_URL}/api/PeriodicMaintenance/get-periodicmaintenance`,
    create: `${BASE_URL}/api/PeriodicMaintenance/create-periodicmaintenance`,
    update: `${BASE_URL}/api/PeriodicMaintenance/update-periodicmaintenance`,
    delete: `${BASE_URL}/api/PeriodicMaintenance/delete-periodicmaintenance`,
  },
  // ✅
  VehicleCasco: {
    get: `${BASE_URL}/api/VehicleCasco/get-vehiclecasco`,
    create: `${BASE_URL}/api/VehicleCasco/create-vehiclecasco`,
    update: `${BASE_URL}/api/VehicleCasco/update-vehiclecasco`,
    delete: `${BASE_URL}/api/VehicleCasco/delete-vehiclecasco`,
  },
  // ✅
  VehicleInsurance: {
    get: `${BASE_URL}/api/VehicleInsurance/get-vehicleinsurance`,
    create: `${BASE_URL}/api/VehicleInsurance/create-vehicleinsurance`,
    update: `${BASE_URL}/api/VehicleInsurance/update-vehicleinsurance`,
    delete: `${BASE_URL}/api/VehicleInsurance/delete-vehicleinsurance`,
  },
  // ✅
  VehicleSpeedLimit: {
    get: `${BASE_URL}/api/VehicleSpeedLimit/get-vehiclespeedlimit`,
    create: `${BASE_URL}/api/VehicleSpeedLimit/create-vehiclespeedlimit`,
    update: `${BASE_URL}/api/VehicleSpeedLimit/update-vehiclespeedlimit`,
    delete: `${BASE_URL}/api/VehicleSpeedLimit/delete-vehiclespeedlimit`,
  },
  // ✅

  VehicleInspection: {
    get: `${BASE_URL}/api/VehicleInspection/get-vehicleinspection`,
    create: `${BASE_URL}/api/VehicleInspection/create-vehicleinspection`,
    update: `${BASE_URL}/api/VehicleInspection/update-vehicleinspection`,
    delete: `${BASE_URL}/api/VehicleInspection/delete-vehicleinspection`,
  },
  // ✅
  VehicleRepair: {
    get: `${BASE_URL}/api/VehicleRepair/get-vehiclerepair`,
    create: `${BASE_URL}/api/VehicleRepair/create-vehiclerepair`,
    update: `${BASE_URL}/api/VehicleRepair/update-vehiclerepair`,
    delete: `${BASE_URL}/api/VehicleRepair/delete-vehiclerepair`,
  },
  VehicleDetails: {
    get: `${BASE_URL}/api/Vehicles/get-vehiclesDetails`
  },


  Others: {
    getBySrnLastList: `${MONGO_BASE_URL}/api/TrackingData/getby-srnlastlist`,
    login: `${BASE_URL}/api/Authentication/login`,
    instantData: `${BASE_URL}/api/InstantData/create-InstantData`
  }
};