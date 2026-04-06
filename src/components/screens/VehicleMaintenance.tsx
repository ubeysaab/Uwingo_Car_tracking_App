import ResponsiveTable from '@/components/ResponsiveTable/ResponsiveTable';
import { NormalizedErrorT } from '@/types/auth';
import React from 'react';
import { View } from 'react-native';


import LucideIconButton from '@/components/IconButton/LucideIconButton';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal';
import SplashScreen from '@/components/Screens/SplashScreen';
import ErrorModal from '@/components/Modals/ErrorModal';
import ErrorScreen from '@/components/Screens/ErrorScreen';
import { ColumnConfig } from '@/components/ResponsiveTable/types';

import VehicleMaintenanceFormModal from '@/components/Modals/forms/VehicleMaintenanceFormModal';
import { useCreateVehicleMaintenance, useDeleteVehicleMaintenance, useGetVehicleMaintenances, useUpdateVehicleMaintenance } from '@/store/server/useVehicleMaintainance';
import { useGetVehicles } from '@/store/server/useVehicles';
import { VehicleMaintenanceApplicationT } from '@/types/comingData/vehicleMaintenance';

import { useTranslation } from 'react-i18next';

interface dataShapeToShow {
  periodicMaintenanceId: number | null,
  vehicle_Id: number | null,
  vehicle: string | null,
  lastMaintenanceDate: string | null,
  periodInMonths: number | null,
  periodInKilometers: number | null,
  kilometer: number | null,
  nextMaintenanceDate: string | null,
  performedBy: string | null,
  description: string | null,
  images: string[] | [],

}



const VehicleMaintenance = () => {




  const { t } = useTranslation();

  const { data: vehicleMaintenanceData, isPending: vehicleMaintenanceIsPending, isError: isErrorVehicleMaintenance, refetch: refetchVehicleMaintenance, error: maintenanceError } = useGetVehicleMaintenances();
  const { data: vehiclesData, isPending: vehiclesIsPending, isError: isVehiclesError, refetch: refetchVehicles, error: vehicleError } = useGetVehicles()
  const mutationDelete = useDeleteVehicleMaintenance()
  const mutationUpdate = useUpdateVehicleMaintenance()
  const mutationAdd = useCreateVehicleMaintenance()

  // 1. State to manage the Modal
  const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
  const [deleteModalVisiblity, setDeleteModalVisibility] = React.useState(false);
  const [errorModalVisibility, setErrorModalVisibility] = React.useState(false)


  const [selectedVehicleMaintenance, setSelectedVehicleMaintenance] = React.useState<VehicleMaintenanceApplicationT | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // 1. Add state to track the ID specifically for deletion
  const [vehicleMaintenanceToDelete, setVehicleMaintenanceToDelete] = React.useState<VehicleMaintenanceApplicationT | null>(null);



  const handleDelete = (id: any) => {
    setVehicleMaintenanceToDelete(id);
    setDeleteModalVisibility(true);
  };


  // 2. Handlers
  const handleEdit = (vehicleMaintenance: VehicleMaintenanceApplicationT) => {
    const payload = {
      ...vehicleMaintenance,
      lastMaintenanceDate: new Date(vehicleMaintenance?.lastMaintenanceDate).toISOString().split('.')[0],
      nextMaintenanceDate: new Date(vehicleMaintenance?.nextMaintenanceDate).toISOString().split('.')[0]

    }
    setSelectedVehicleMaintenance(payload);
    setSaveModalVisibility(true);
  };

  const handleAddNew = () => {
    // console.log(data)
    setSelectedVehicleMaintenance(null);
    setSaveModalVisibility(true);
  };



  // TODO : BURADA VEHICLES ICIN BIR FILTER OLACAK GIBI . 

  const mappedData = React.useMemo(() => {
    if (!vehiclesData || !vehicleMaintenanceData) {
      return [];
    }

    const theFilteredData: dataShapeToShow[] = vehicleMaintenanceData.map((junction: VehicleMaintenanceApplicationT): dataShapeToShow => {
      const vehicle = vehiclesData.find((v) => v?.vehicleId === junction?.vehicle_Id);

      return {
        periodicMaintenanceId: junction?.periodicMaintenanceId || null,
        vehicle_Id: junction?.vehicle_Id || null,
        periodInMonths: junction?.periodInMonths || null,
        periodInKilometers: junction?.periodInKilometers || null,
        lastMaintenanceDate: junction?.lastMaintenanceDate.split('T')[0] || null,
        nextMaintenanceDate: junction?.nextMaintenanceDate.split('T')[0] || null,
        description: junction?.description || null,
        vehicle: vehicle?.plate || null,
        kilometer: junction?.kilometer || null,
        performedBy: junction?.performedBy || null,
        images: junction?.images || []
      }
    })
    return theFilteredData
  }, [vehicleMaintenanceData, vehiclesData])


  const confirmDelete = () => {
    console.log('hyello ')
    console.log(vehicleMaintenanceToDelete)

    if (vehicleMaintenanceToDelete?.periodicMaintenanceId) {
      console.log(vehicleMaintenanceToDelete)
      mutationDelete.mutate(vehicleMaintenanceToDelete?.periodicMaintenanceId, {
        onSuccess: () => {
          setDeleteModalVisibility(false);
          setVehicleMaintenanceToDelete(null);
        },
        onError: (error: NormalizedErrorT) => {
          setDeleteModalVisibility(false)
          setErrorModalVisibility(true)
          setVehicleMaintenanceToDelete(null)
          setErrorMessage(error.message)
        }
      });
    }
  };
  const confirmAddandUpdate = (data: Partial<VehicleMaintenanceApplicationT>, method: 'put' | 'post') => {
    console.log('hello from add ')
    console.log('method : ', method, "data", data)


    if (method === 'put') {
      // We pass ONE object containing id and the rest of the data
      const payloadData = {
        ...data,
        // Ensure the date is valid or null/undefined if missing

        // Direct assignment with optional chaining
        periodicMaintenanceId: selectedVehicleMaintenance?.periodicMaintenanceId
      };


      mutationUpdate.mutate(
        payloadData,
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
        onError: (error: NormalizedErrorT) => {
          setErrorModalVisibility(true)
          setErrorMessage(error.message)

        }
      });
    }
  };

  function refetch() {
    refetchVehicles()
    refetchVehicleMaintenance()
  }



  if (vehicleMaintenanceIsPending || vehiclesIsPending) return (
    <SplashScreen />
  )

  if (isVehiclesError || isErrorVehicleMaintenance) return (
    <ErrorScreen onRetry={refetch} message={vehicleError?.message || maintenanceError?.message} />
  )

  // Manually define your columns to map labels to specific object keys
  const columns: ColumnConfig<dataShapeToShow>[] = [
    { label: 'vehicleConnectedDevicePage.selectVehicle', key: 'vehicle' },
    { label: 'vehicleMaintenancePage.lastMaintenanceDate', key: 'lastMaintenanceDate' },
    { label: 'vehicleMaintenancePage.periodInMonths', key: 'periodInMonths' },
    { label: 'vehicleMaintenancePage.periodInKiloMeters', key: 'periodInKilometers' },
    { label: 'vehicleMaintenancePage.nextMaintenanceDate', key: 'nextMaintenanceDate' },
    { label: 'common.kilometer', key: 'kilometer' },
    { label: 'vehicleMaintenancePage.performedBy', key: 'performedBy' },
    { label: 'common.description', key: 'description' },
  ];

  return (
    <>
      <View
        style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5 }}>

        <LucideIconButton
          icon={"Plus"}
          text={'vehicleMaintenancePage.addVehicleMaintenance'}
          onPress={handleAddNew}
        />
      </View>

      <ResponsiveTable data={mappedData} columns={columns} uniqueKey='periodicMaintenanceId' handleEdit={handleEdit} handleDelete={handleDelete} />

      <VehicleMaintenanceFormModal
        visible={saveModalVisibility}
        initialData={selectedVehicleMaintenance}
        onClose={() => setSaveModalVisibility(false)}
        onSubmit={(data, method) => confirmAddandUpdate(data, method)}
        vehiclesData={vehiclesData
          ?.filter((item) => item?.vehicleId !== undefined)
          .map((item) => ({
            label: item.plate,
            value: item.vehicleId as number
          }))}
      />


      <DeleteConfirmationModal
        visible={deleteModalVisiblity}
        onClose={() => {
          setDeleteModalVisibility(false);
          setVehicleMaintenanceToDelete(null);
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



export default VehicleMaintenance;