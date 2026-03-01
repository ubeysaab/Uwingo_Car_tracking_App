import ResponsiveTable from '@/components/ResponsiveTable/ResponsiveTable';
import { NormalizedErrorT } from '@/types/auth';
import { DriverVehiclesApplicationT } from '@/types/comingData/driverVehicles';
import * as React from 'react';
import { View } from 'react-native';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal';
import ErrorModal from '@/components/Modals/ErrorModal';
import ErrorScreen from '@/components/Screens/ErrorScreen';
import LucideIconButton from '@/components/IconButton/LucideIconButton';
import { ColumnConfig } from '@/components/ResponsiveTable/types';
import SplashScreen from '@/components/Screens/SplashScreen';
import { useCreateDriverVehicles, useDeleteDriverVehicles, useGetDriverVehicles, useUpdateDriverVehicles } from '@/store/server/useDriverVehicles';
import DriverVehiclesModal from '@/components/Modals/forms/DriverVehiclesModal';
import { useGetDrivers } from '@/store/server/useDrivers';
import { useGetVehicles } from '@/store/server/useVehicles';
import { useMemo } from 'react';


interface dataShapeToShow {
  driverName: string,
  vehiclePlate: string,
  startDate: Date | null,
  terminationDate: Date | null,
  vehicle_Id: number | undefined,
  drivers_Id: number | undefined,
  driverVehicleId: number | undefined
}



const DriverVehicles = () => {

  const {
    data: driverVehiclesData,
    isPending: isDriverVehiclesPending,
    isError: isDriverVehiclesError,
    refetch: refetchDriverVehicles
  } = useGetDriverVehicles();

  const {
    data: driversData,
    isPending: isDriverPending,
    isError: isDriverError,
    refetch: refetchDrivers
  } = useGetDrivers();

  const {
    data: vehiclesData,
    isPending: isVehiclePening,
    isError: isVehicleError,
    refetch: refetchVehicles
  } = useGetVehicles();


  const handleRetry = () => {
    // Trigger all three fetches again
    refetchDriverVehicles();
    refetchDrivers();
    refetchVehicles();
  };



  const { availableDrivers, mappedData } = useMemo(() => {
    // 1. Safety check
    if (!driverVehiclesData || !driversData || !vehiclesData) {
      return { availableDrivers: [], availableVehicles: [], mappedData: [] };
    }

    // 2. Get Sets of IDs already in use (Filtering out terminated ones)
    // We use flatMap so we don't include 'undefined' in our Set
    const assignedDriverIds = new Set(
      driverVehiclesData.flatMap((dv: DriverVehiclesApplicationT) =>
        (dv.drivers_Id && !dv.terminationDate) ? [dv.drivers_Id] : []
      )
    );



    // 3. Filter for available (those NOT in the active Sets)
    const availableDrivers = driversData.filter(
      (driver) => !assignedDriverIds.has(driver.driverId)
    );



    // 4. Create your display data
    const mappedData = driverVehiclesData.map((junction) => {
      const driver = driversData.find((d) => d.driverId === junction.drivers_Id);
      const vehicle = vehiclesData.find((v) => v.vehicleId === junction.vehicle_Id);

      return {
        driverName: driver?.driverName || 'Unknown Driver',
        vehiclePlate: vehicle?.plate || 'Unknown Plate',
        startDate: junction?.identificationDate?.split('T')[0] || null,
        terminationDate: junction?.terminationDate?.split('T')[0] || null,
        vehicle_Id: junction?.vehicle_Id || null,
        drivers_Id: junction?.drivers_Id || null,
        driverVehicleId: junction?.driverVehicleId || null
      };
    });

    return { availableDrivers, mappedData };
  }, [vehiclesData, driversData, driverVehiclesData]);





  const mutationDelete = useDeleteDriverVehicles()
  const mutationUpdate = useUpdateDriverVehicles()
  const mutationAdd = useCreateDriverVehicles()

  // 1. State to manage the Modal
  const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
  const [deleteModalVisiblity, setDeleteModalVisibility] = React.useState(false);
  const [errorModalVisibility, setErrorModalVisibility] = React.useState(false)


  const [selectedDriverVehicles, setSelectedDriverVehicles] = React.useState<DriverVehiclesApplicationT | null>(null);

  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // 1. Add state to track the ID specifically for deletion
  const [driverVehiclesToDelete, setDriverVehiclesToDelete] = React.useState<DriverVehiclesApplicationT | null>(null);



  const handleDelete = (item: DriverVehiclesApplicationT) => {
    setDriverVehiclesToDelete(item);
    setDeleteModalVisibility(true);
  };


  // 2. Handlers
  const handleEdit = (driverVehicle: DriverVehiclesApplicationT) => {
    setSelectedDriverVehicles(driverVehicle);
    setSaveModalVisibility(true);
  };

  const handleAddNew = () => {

    setSelectedDriverVehicles(null);
    setSaveModalVisibility(true);
  };


  const confirmDelete = () => {
    if (driverVehiclesToDelete?.driverVehicleId) {
      console.log(driverVehiclesToDelete)
      mutationDelete.mutate(driverVehiclesToDelete?.driverVehicleId, {
        onSuccess: () => {
          setDeleteModalVisibility(false);
          setDriverVehiclesToDelete(null);
        },
        onError: (error: NormalizedErrorT) => {
          setDeleteModalVisibility(false)
          setErrorModalVisibility(true)
          setDriverVehiclesToDelete(null)
          setErrorMessage(error.message)
        }
      });
    }
  };
  const confirmAddandUpdate = (data: any, method: 'put' | 'post') => {
    console.log('hello from add ')
    console.log('method : ', method, "data", data)
    if (method === 'put') {
      const updatePayload = { ...data, driverVehicleId: selectedDriverVehicles?.driverVehicleId }
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
  if (isDriverVehiclesPending || isVehiclePening || isDriverPending) return (
    <SplashScreen />
  )

  if (isDriverVehiclesError || isDriverError || isVehicleError) return (
    <ErrorScreen onRetry={handleRetry} />
  )

  // Manually define your columns to map labels to specific object keys
  const columns: ColumnConfig<dataShapeToShow>[] = [
    { label: 'driversPage.driverName', key: 'driverName' },
    { label: 'vehiclesPage.vehiclePlate', key: 'vehiclePlate' },
    { label: 'common.addingDate', key: 'startDate' },
    { label: 'common.deletingDate', key: "terminationDate" }
  ];

  return (
    <>
      <View
        style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5 }}>

        <LucideIconButton
          icon={"Plus"}
          text={'vehicleConnectedDriverPage.addVehicleToDriver'}
          onPress={handleAddNew}
        />
      </View>

      <ResponsiveTable data={mappedData} columns={columns} uniqueKey='driverVehicleId' handleEdit={handleEdit} handleDelete={handleDelete} />

      <DriverVehiclesModal
        visible={saveModalVisibility}
        onClose={() => setSaveModalVisibility(false)}
        onSubmit={confirmAddandUpdate}
        initialData={selectedDriverVehicles}
        // Logic: The list should be "Available" PLUS the "Current" one being edited
        vehicles={vehiclesData.map(item => ({ value: item.vehicleId, label: item.plate }))}
        drivers={availableDrivers.map(item => ({ value: item.driverId, label: item.driverName }))}
      />


      <DeleteConfirmationModal
        visible={deleteModalVisiblity}
        onClose={() => {
          setDeleteModalVisibility(false);
          setDriverVehiclesToDelete(null);
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


export default DriverVehicles;