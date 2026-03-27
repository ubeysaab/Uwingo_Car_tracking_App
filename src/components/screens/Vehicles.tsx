import LucideIconButton from '@/components/IconButton/LucideIconButton';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal';
import ErrorModal from '@/components/Modals/ErrorModal';
import VehicleFormModal from '@/components/Modals/forms/VehicleFormModal';
import ResponsiveTable from '@/components/ResponsiveTable/ResponsiveTable';
import { ColumnConfig } from '@/components/ResponsiveTable/types';
import ErrorScreen from '@/components/screens/ErrorScreen';
import SplashScreen from '@/components/screens/SplashScreen';
import { useCreateVehicle, useDeleteVehicle, useGetVehicles, useUpdateVehicle } from '@/store/server/useVehicles';
import { NormalizedErrorT } from '@/types/auth';
import { VehicleApplicationT } from '@/types/comingData/vehicles';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';



const Vehicles = () => {

  const { data, isPending, isError, refetch, error } = useGetVehicles();
  const mutationDelete = useDeleteVehicle()
  const mutationUpdate = useUpdateVehicle()
  const mutationAdd = useCreateVehicle()


  // 1. State to manage the Modal
  const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
  const [deleteModalVisiblity, setDeleteModalVisibility] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState<VehicleApplicationT | null>(null);

  const [errorModalVisibility, setErrorModalVisibility] = React.useState(false)

  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // 1. Add state to track the ID specifically for deletion
  const [vehicleToDelete, setVehicleToDelete] = React.useState<VehicleApplicationT | null>(null);





  // 2. Handlers
  const handleEdit = (vehicle: VehicleApplicationT) => {
    setSelectedVehicle(vehicle); // Set the vehicle to be edited
    setSaveModalVisibility(true);       // Open modal
  };


  const handleDelete = (vehicle: VehicleApplicationT) => {
    setVehicleToDelete(vehicle);
    setDeleteModalVisibility(true);
  };

  const handleAddNew = () => {
    setSelectedVehicle(null);    // No vehicle means "Add Mode"
    setSaveModalVisibility(true);
  };


  const confirmDelete = () => {
    if (vehicleToDelete?.vehicleId) {
      console.log(vehicleToDelete)
      mutationDelete.mutate(vehicleToDelete?.vehicleId, {
        onSuccess: () => {
          setDeleteModalVisibility(false);
          setVehicleToDelete(null);
        },
        onError: (error: NormalizedErrorT) => {
          setDeleteModalVisibility(false)
          setErrorModalVisibility(true)
          setVehicleToDelete(null)
          setErrorMessage(error.message)
        }
      });
    }
  };
  const confirmAddandUpdate = (data: any, method: 'put' | 'post') => {
    if (method === 'put') {
      // We pass ONE object containing id and the rest of the data
      console.log("the data sended for update", data)
      const payloadData: VehicleApplicationT = {
        ...data,
        vehicleId: selectedVehicle?.vehicleId,
        companyApplicationId: selectedVehicle?.companyApplicationId
      }
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


  if (isPending) return (
    <SplashScreen />
  )

  if (isError) return (
    <ErrorScreen message={error.message} onRetry={refetch} />
  )

  const columns: ColumnConfig<VehicleApplicationT>[] = [
    { label: 'vehiclesPage.vehiclePlate', key: 'plate' },
    { label: 'vehiclesPage.brand', key: 'make' },
    { label: 'vehiclesPage.model', key: 'model' },
    { label: 'vehiclesPage.modelYear', key: 'year' },
    { label: 'vehiclesPage.chassisNo', key: 'vin' },
    { label: 'vehiclesPage.initialKM', key: 'firstKilometer' },
    { label: 'vehiclesPage.hasDriver', key: 'isThereDriver' },
    { label: 'vehiclesPage.forRent', key: 'isItForRent' },
  ];




  return (
    <>
      <View
        style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5 }}>
        <LucideIconButton
          icon={"Plus"}
          text={"vehiclesPage.addVehicle"}
          onPress={handleAddNew}
        />
      </View>

      <ResponsiveTable data={data} columns={columns} uniqueKey='plate' handleEdit={handleEdit} handleDelete={handleDelete} />

      <VehicleFormModal
        visible={saveModalVisibility}
        initialData={selectedVehicle}
        onClose={() => setSaveModalVisibility(false)}
        onSubmit={(data: any, method: "put" | "post") => confirmAddandUpdate(data, method)}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisiblity}
        onClose={() => {
          setDeleteModalVisibility(false);
          setVehicleToDelete(null);
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


export default Vehicles;