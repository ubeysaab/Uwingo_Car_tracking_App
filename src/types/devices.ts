export type Device = {
  deviceId: number;
  serialNumber: string;
  model: string;
  packetType: string;
  suffix: string | null;
  isConnectedVehicles: boolean;
  companyApplicationId: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string | null;
  lastModifiedBy: string | null;
  deletedDate: string | null;
  deletedBy: string | null;
  isActive: boolean;
  isDeleted: boolean;
};

export type Vehicle = {
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
};

export type DeviceVehicle = {
  connectionId: number;
  devices: Device;
  device_Id: number;
  vehicles: Vehicle;
  vehicle_Id: number;
  installDate: string;
  removeDate: string | null;
  companyApplicationId: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string | null;
  lastModifiedBy: string | null;
  deletedDate: string | null;
  deletedBy: string | null;
  isActive: boolean;
  isDeleted: boolean;
};

export type DeviceVehicleResponse = {
  deviceVehicle: DeviceVehicle;
  vehicle: Vehicle;
  device: Device;
};
