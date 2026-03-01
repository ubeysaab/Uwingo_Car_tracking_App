
// types/Vehicle.ts
export interface Device {
  deviceId: number;
  serialNumber: string;
  model: string;
  packetType: string;
  suffix: string | null;
  isConnectedVehicles: boolean;
  devicePhoneNumber: string;
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

export interface Vehicle {
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

export interface DeviceVehicle {
  connectionId: number;
  devices: Device;
  device_Id: number;
  vehicles: Vehicle;
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

export interface DeviceVehicleWithDetails {
  deviceVehicle: DeviceVehicle;
  vehicle: Vehicle;
  device: Device;
}

// For instant tracking data
export interface InstantDataDTO {
  serialNumber: string;
  speed: number;
  workingstatus: boolean;
  outputStatus: boolean;
  latitude: number;
  longitude: number;
  dateTime: string;
  odometer: number;
  suffix?: string;

  // Vehicle properties
  vehicleId: number;
  make: string;
  model: string;
  year: number;
  vin: string;
  plate: string;
  isThereDriver: boolean;
  isItForRent: boolean;
  companyApplicationId: string;

  isBlocked?: boolean;
  dailyKM?: number;
  speedLimit?: number;
}




export interface TrackingData {
  serialNumber: string;
  speed: number;
  workingstatus: boolean;
  outputStatus: boolean;
  latitude: number;
  longitude: number;
  dateTime: string;
  odometer: number;
  suffix?: string;
}



export interface DeviceVehicle {
  deviceVehicleId: number;
  device_Id: number;
  vehicle_Id: number;
  isActive: boolean;
}

export interface DeviceVehicleWithDetails {
  deviceVehicle: DeviceVehicle;
  device: Device;
  vehicle: Vehicle;
}

export interface ApiResponse<T> {
  data: T[];
  isSuccess: boolean;
  errorMessage?: string;
  totalRecords?: number;
  pageNumber?: number;
  pageSize?: number;
  deviceType?: 'STD' | 'ACC';
}

export interface TrackingDataForStd {
  serialNumber: string;
  speed: number;
  workingstatus: boolean;
  outputStatus: boolean;
  latitude: number;
  longitude: number;
  dateTime: string;
  odometer: number;
}

export interface TrackingDataForACC {
  serialNumber: string;
  speed: number;
  workingstatus: boolean;
  outputStatus: boolean;
  latitude: number;
  longitude: number;
  dateTime: string;
  odometer: number;
}

export interface MapsModel {
  serialNumber: string;
  latitude: number;
  longitude: number;
  speed: number;
  workingstatus: boolean;
  dateTime: string;
}

// Filter types
export interface FilterMapRequestModel {
  id: number;
  firstDate: string;
  lastDate: string;
}

// Analysis types
export interface TrackingAnalysisDto {
  vehicleId: number;
  routeName: string;
  status: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  speed: number;
  violationType?: string;
  analysisStartDate: string;
  analysisEndDate: string;
  additionalInfo?: string;
}

export interface RouteDto {
  routeName: string;
  vehicleId: number;
  analysisStartDate: string;
  analysisEndDate: string;
  coordinates: LatLngDto[];
}

export interface LatLngDto {
  latitude: number;
  longitude: number;
}

// Violation types
export interface Violation {
  vehicleId: number;
  routeName: string;
  status: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  speed: number;
  violationType: string;
  additionalInfo: string;
}