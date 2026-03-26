import ResponsiveTable from '@/components/ResponsiveTable/ResponsiveTable';

import { NormalizedErrorT } from '@/types/auth';
import { VehicleApplicationT } from '@/types/comingData/vehicles';
import * as React from 'react';
import { View } from 'react-native';
import LucideIconButton from '../IconButton/LucideIconButton';
import DeleteConfirmationModal from '../Modals/DeleteConfirmationModal';
import ErrorModal from '../Modals/ErrorModal';
import { ColumnConfig } from '../ResponsiveTable/types';
import ErrorScreen from './ErrorScreen';
import SplashScreen from './SplashScreen';



import DeviceVehiclesModal from '@/components/Modals/forms/DeviceVehicleFormModal';
import { useCreateDeviceVehicle, useDeleteDeviceVehicle, useGetDeviceVehicles, useUpdateDeviceVehicle } from '@/store/server/useDeviceVehicle';
import { useGetDevices } from '@/store/server/useDevices';
import { useGetVehicles } from '@/store/server/useVehicles';
import { DeviceVehicleApplicationT } from '@/types/comingData/deviceVehicle';
import { DeviceApplicationT } from '@/types/comingData/devices';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';


interface dataShapeToShow {
  deviceSerialNumber: string | null,
  vehiclePlate: string
  | null,
  installDate: string | null,
  removeDate: string | null,
  vehicle_Id: number | null,
  device_Id: number | null,
  connectionId: number | null
  isRoleToBlockage: boolean | null
}



const DevicesVehicles = () => {

  const {
    data: devicesVehiclesData,
    isPending: isDevicesVehiclesPending,
    isError: isDevicesVehiclesError,
    refetch: refetchDevicesVehicles
  } = useGetDeviceVehicles();

  const {
    data: devicesData,
    isPending: isDevicesPending,
    isError: isDevicesError,
    refetch: refetchDevices
  } = useGetDevices();

  const {
    data: vehiclesData,
    isPending: isVehiclePening,
    isError: isVehicleError,
    refetch: refetchVehicles
  } = useGetVehicles();


  const handleRetry = () => {
    // Trigger all three fetches again
    refetchDevicesVehicles();
    refetchDevices();
    refetchVehicles();
  };



  const [selectedDeviceVehicles, setSelectedDeviceVehicles] = React.useState<DeviceVehicleApplicationT | null>(null);



  const { availableDevices, availableVehicles, mappedData } = useMemo(() => {
    if (!devicesVehiclesData || !devicesData || !vehiclesData) {
      return { availableDevices: [], availableVehicles: [], mappedData: [] };
    }

    // 1. Identify "Active" assignments (where removeDate is null)
    // These are the devices/vehicles that are currently "In Use"
    const activeDeviceIds = new Set(
      devicesVehiclesData
        .filter((dv: DeviceVehicleApplicationT) => dv.removeDate === null)
        .map((dv: DeviceVehicleApplicationT) => dv.device_Id)
    );

    const activeVehicleIds = new Set(
      devicesVehiclesData
        .filter((dv: DeviceVehicleApplicationT) => dv.removeDate === null)
        .map((dv: DeviceVehicleApplicationT) => dv.vehicle_Id)
    );

    // 2. Filter for available (NOT in the active Sets)
    // If we are EDITING, we should also include the ID of the item currently being edited
    const availableDevices = devicesData.filter((device: DeviceApplicationT) => {
      const isAssigned = activeDeviceIds.has(device.deviceId);
      const isCurrentlySelected = selectedDeviceVehicles?.device_Id === device.deviceId;
      return !isAssigned || isCurrentlySelected;
    });

    const availableVehicles = vehiclesData.filter((vehicle: VehicleApplicationT) => {
      const isAssigned = activeVehicleIds.has(vehicle.vehicleId);
      const isCurrentlySelected = selectedDeviceVehicles?.vehicle_Id === vehicle.vehicleId;
      return !isAssigned || isCurrentlySelected;
    });

    // 3. Create display data
    const mappedData = devicesVehiclesData.map((junction: DeviceVehicleApplicationT): dataShapeToShow => {
      const device = devicesData.find((d) => d.deviceId === junction.device_Id);
      const vehicle = vehiclesData.find((v) => v.vehicleId === junction.vehicle_Id);

      return {
        deviceSerialNumber: device?.serialNumber || null,
        vehiclePlate: vehicle?.plate || null,
        installDate: junction?.installDate?.split('T')[0] || null,
        removeDate: junction?.removeDate?.split('T')[0] || null,
        vehicle_Id: junction?.vehicle_Id || null,
        device_Id: junction?.device_Id || null,
        connectionId: junction?.connectionId || null,
        isRoleToBlockage: junction?.isRoleToBlockage || null,
      };
    });

    return { availableDevices, availableVehicles, mappedData };
    // Add selectedDeviceVehicles to dependency array so filters update when modal opens
  }, [vehiclesData, devicesData, devicesVehiclesData, selectedDeviceVehicles]);





  const mutationDelete = useDeleteDeviceVehicle()
  const mutationUpdate = useUpdateDeviceVehicle()
  const mutationAdd = useCreateDeviceVehicle()

  // 1. State to manage the Modal
  const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
  const [deleteModalVisiblity, setDeleteModalVisibility] = React.useState(false);
  const [errorModalVisibility, setErrorModalVisibility] = React.useState(false)


  // const [selectedVehicle, setSelectedVehicle] = React.useState<VehicleApplicationT | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // 1. Add state to track the ID specifically for deletion
  const [deviceVehiclesToDelete, setDeviceVehiclesToDelete] = React.useState<DeviceVehicleApplicationT | null>(null);



  const handleDelete = (item: DeviceVehicleApplicationT) => {
    setDeviceVehiclesToDelete(item);
    setDeleteModalVisibility(true);
  };


  // 2. Handlers
  const handleEdit = (driverVehicle: DeviceVehicleApplicationT) => {
    setSelectedDeviceVehicles(driverVehicle);
    setSaveModalVisibility(true);
  };

  const handleAddNew = () => {
    setSelectedDeviceVehicles(null);
    setSaveModalVisibility(true);
  };


  const confirmDelete = () => {
    if (deviceVehiclesToDelete?.connectionId) {
      console.log(deviceVehiclesToDelete)
      mutationDelete.mutate(deviceVehiclesToDelete?.connectionId, {
        onSuccess: () => {
          setDeleteModalVisibility(false);
          setDeviceVehiclesToDelete(null);
        },
        onError: (error: NormalizedErrorT) => {
          setDeleteModalVisibility(false)
          setErrorModalVisibility(true)
          setDeviceVehiclesToDelete(null)
          setErrorMessage(error.message)
        }
      });
    }
  };
  const confirmAddandUpdate = (data: any, method: 'put' | 'post') => {
    console.log('hello from add ')
    console.log('method : ', method, "data", data)
    if (method === 'put') {
      const updatePayload = { ...data, connectionId: selectedDeviceVehicles?.connectionId }
      // We pass ONE object containing id and the rest of the data
      console.log("the data sended for update", updatePayload)
      mutationUpdate.mutate(
        updatePayload,
        {
          onSuccess: () => {
            setSaveModalVisibility(false);
            // TODO: Add toast success message here
          },
          onError: (error: NormalizedErrorT) => {

            setErrorModalVisibility(true)
            console.log(error.message)
            setErrorMessage(error.message)
          }
        }
      );
    } else {
      mutationAdd.mutate(data, {
        onSuccess: () => {
          setSaveModalVisibility(false);
          // TODO: Add toast success message here
        },
        onError: () => {
          setErrorModalVisibility(true)
        }
      });
    }
  };



  // {isPending&&<SplashScreen/>}
  if (isDevicesVehiclesPending || isVehiclePening || isDevicesPending) return (
    <SplashScreen />
  )

  if (isDevicesVehiclesError || isDevicesError || isVehicleError) return (
    <ErrorScreen onRetry={handleRetry} />
  )

  // Manually define your columns to map labels to specific object keys
  const columns: ColumnConfig<dataShapeToShow>[] = [
    { label: 'devicesPage.deviceSerialNumber', key: 'deviceSerialNumber' },
    { label: 'vehiclesPage.vehiclePlate', key: 'vehiclePlate' },
    { label: 'common.addingDate', key: 'installDate' },
    { label: 'common.deletingDate', key: "removeDate" },
    { label: 'blockage', key: "isRoleToBlockage" }
  ];

  return (
    <>
      <View
        style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5 }}>

        <LucideIconButton
          icon={"Plus"}
          text={'vehicleConnectedDevicePage.addVehicleToDevice'}
          onPress={handleAddNew}
        />
      </View>

      <ResponsiveTable data={mappedData} columns={columns} uniqueKey='connectionId' handleEdit={handleEdit} handleDelete={handleDelete} />

      <DeviceVehiclesModal
        visible={saveModalVisibility}
        onClose={() => setSaveModalVisibility(false)}
        onSubmit={confirmAddandUpdate}
        initialData={selectedDeviceVehicles}
        // Logic: The list should be "Available" PLUS the "Current" one being edited
        vehicles={availableVehicles.map(item => ({ value: item.vehicleId, label: ` ${item.plate}  ` }))}
        devices={availableDevices.map(item => ({ value: item.deviceId, label: `${item.serialNumber} ` }))}
      />


      <DeleteConfirmationModal
        visible={deleteModalVisiblity}
        onClose={() => {
          setDeleteModalVisibility(false);
          setDeviceVehiclesToDelete(null);
        }}
        onConfirm={confirmDelete}
        isDeleting={mutationDelete.isPending}



      />

      <ErrorModal
        visible={errorModalVisibility}
        onClose={() => {
          setErrorModalVisibility(false)
        }}
        message={errorMessage}
      />
    </>
  );
};





export default DevicesVehicles;