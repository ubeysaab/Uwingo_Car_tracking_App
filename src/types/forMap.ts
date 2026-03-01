
export type FinalMapDTO = {
  // isBlocked: boolean
  Suffix: string | null

  trackingData: {
    // DateTime: string
    Latitude: number | string
    Longitude: number | string
    OutPutStatus: boolean
    SerialNumber: string
    speed: number
    Suffix: string | null
    WorkingStatus: boolean
  }

  vehicles: {
    CompnayApplicationId: string
    FirstKilometer: number
    IsItForRent: boolean
    IsThereDriver: boolean
    Make: string
    Model: string
    Plate: string
    VIN: string
    VehicleId: number
    Year: number
  }
}


export interface GetActiveDevicesEndPoint {
  deviceVehicle: DeviceVehicleRelation_GetActiveDeviceEndPoint;
  vehicle: Vehicle_GetActiveDeviceEndPoint;
  device: Device_GetActiveDeviceEndPoint;
}

export interface Device_GetActiveDeviceEndPoint {
  deviceId: number;
  serialNumber: string;
  model: string;
  packetType: string;
  suffix: string | null;
  isConnectedVehicles: boolean;
  devicePhoneNumber: string;
  companyApplicationId: string;
  createdDate: string; // or Date if you parse it
  createdBy: string;
  lastModifiedDate: string | null;
  lastModifiedBy: string | null;
  deletedDate: string | null;
  deletedBy: string | null;
  isActive: boolean;
  isDeleted: boolean;
}

export interface Vehicle_GetActiveDeviceEndPoint {
  vehicleId: number;
  make: string;
  model: string;
  year: number;
  vin: string;
  firstKilometer: number;
  plate: string;
  isThereDriver: boolean;
  isItForRent: boolean;
  companyApplicationId: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string | null;
  lastModifiedBy: string | null;
  deletedDate: string | null;
  deletedBy: string | null;
  isActive: boolean;
  isDeleted: boolean;
}

export interface DeviceVehicleRelation_GetActiveDeviceEndPoint {
  connectionId: number;
  devices: Device_GetActiveDeviceEndPoint;
  device_Id: number;
  vehicles: Vehicle_GetActiveDeviceEndPoint;
  vehicle_Id: number;
  installDate: string;
  removeDate: string | null;
  companyApplicationId: string;
  isRoleToBlockage: boolean;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string | null;
  lastModifiedBy: string | null;
  deletedDate: string | null;
  deletedBy: string | null;
  isActive: boolean;
  isDeleted: boolean;
}

export interface GetBySerialNumberList_MongoEndPoint {
  serialNumber: string;
  speed: number;
  workingstatus: boolean;
  latitude: number;
  longitude: number;
  suffix: string | null;
  outPutStatus: boolean;
}





export interface CreateInstantDataEndpoint_send {
  // Tracking Data (from x.trackingData)
  serialNumber: string;
  speed: number;
  workingstatus: boolean;
  outPutStatus: boolean;
  latitude: number;
  longitude: number;
  suffix: string; // Defaults to "--" in your mapping
  dateTime: string; // Or Date if handled as a date object
  odoMeter: number;
  vehicleId: number;
  make: string;
  model: string;
  year: number;
  vIN: string;
  plate: string;
  isThereDriver: boolean;
  isItForRent: boolean;
  companyApplicationId: string;
  isBlocked: boolean;
  sufflix: string; // Note: preserved the 'l' in Sufflix as per your snippet
}

export interface CreateInstantDataEndpoint_whatGet {
  id: number;
  vehicleId: number;
  serialNumber: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  vin: string;

  // Tracking Data
  latitude: number;
  longitude: number;
  speed: number;
  speedLimit: number;
  workingstatus: boolean;
  outPutStatus: boolean;
  odoMeter: number;
  currentKM: number;
  dailyKM: number;

  // Status & Logic
  isBlocked: boolean;
  isThereDriver: boolean;
  isItForRent: boolean;
  companyApplicationId: string; // UUID

  // Analysis & Routes
  routeName: string;
  analysisStartDate: string; // ISO Date String
  analysisEndDate: string;   // ISO Date String
  dateTime: string;          // ISO Date String

  /** * This is a stringified JSON array: 
   * "[{\"latitude\":38.5,...},...]"
   */
  coordinatesJson: string;

  // Metadata
  lastTrackingId: number;
  rn: number;
  suffix: string;
  sufflix: string; // Matches the typo in your backend object
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}