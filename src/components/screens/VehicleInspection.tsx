import ResponsiveTable from '@/components/ResponsiveTable/ResponsiveTable';
import { NormalizedErrorT } from '@/types/auth';
import React from 'react';
import { View } from 'react-native';


import LucideIconButton from '@/components/IconButton/LucideIconButton';
import ErrorModal from '@/components/Modals/ErrorModal';
import ErrorScreen from '@/components/Screens/ErrorScreen';
import SplashScreen from '@/components/Screens/SplashScreen';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal';
import { ColumnConfig } from '@/components/ResponsiveTable/types';

import { useCreateVehicleInspection, useDeleteVehicleInspection, useGetVehicleInspection, useUpdateVehicleInspection } from '@/store/server/useVehicleInspection';
import { VehicleInspectionApplicationT } from '@/types/comingData/vehicleInspection';

import { useGetVehicles } from '@/store/server/useVehicles';
import VehicleInspectionFormModal from '@/components/Modals/forms/VehicleInspectionFormModal';



interface dataShapeToShow {
  vehicleInspectionId: number | null;
  vehicleId: number | null;
  vehicle: string | null
  notes: string | null;
  inspectionDate: string | null; // ISO String format
  expiryDate: string | null;   // ISO String format

}



const VehicleInspection = () => {

  const { data: vehicleInpsectionData, isPending: vehicleInpsectionIsPending, isError: isErrorvehicleInpsection, refetch: refetchvehicleInpsection } = useGetVehicleInspection();
  const { data: vehiclesData, isPending: vehiclesIsPending, isError: isVehiclesError, refetch: refetchVehicles } = useGetVehicles()
  const mutationDelete = useDeleteVehicleInspection()
  const mutationUpdate = useUpdateVehicleInspection()
  const mutationAdd = useCreateVehicleInspection()

  // 1. State to manage the Modal
  const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
  const [deleteModalVisiblity, setDeleteModalVisibility] = React.useState(false);
  const [errorModalVisibility, setErrorModalVisibility] = React.useState(false)


  const [selectedvehicleInpsection, setSelectedvehicleInpsection
  ] = React.useState<VehicleInspectionApplicationT | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // 1. Add state to track the ID specifically for deletion
  const [vehicleInpsectionToDelete, setvehicleInpsectionToDelete] = React.useState<VehicleInspectionApplicationT | null>(null);



  const handleDelete = (id: any) => {
    setvehicleInpsectionToDelete(id);
    setDeleteModalVisibility(true);
  };


  // 2. Handlers
  const handleEdit = (vehicleInpsection: VehicleInspectionApplicationT) => {
    setSelectedvehicleInpsection(vehicleInpsection);
    setSaveModalVisibility(true);
  };

  const handleAddNew = () => {
    // console.log(data)
    setSelectedvehicleInpsection(null);
    setSaveModalVisibility(true);
  };



  const mappedData = React.useMemo(() => {
    if (!vehiclesData || !vehicleInpsectionData) {
      return [];
    }

    const theFilteredData: dataShapeToShow[] = vehicleInpsectionData.map((junction: VehicleInspectionApplicationT): dataShapeToShow => {
      const vehicle = vehiclesData.find((v) => v?.vehicleId === junction?.vehicleId);

      return {
        vehicleInspectionId: junction?.vehicleInspectionId || null,
        vehicleId: junction?.vehicleId || null,
        notes: junction?.notes || null,
        inspectionDate: junction?.inspectionDate?.split('T')[0] || null, // ISO String format
        expiryDate: junction?.expiryDate?.split('T')[0] || null,  // ISO String format
        vehicle: `${vehicle?.plate} (${vehicle?.make} ${vehicle?.model})` || null,



      }
    })
    return theFilteredData
  }, [vehicleInpsectionData, vehiclesData])


  const confirmDelete = () => {
    if (vehicleInpsectionToDelete?.vehicleInspectionId) {
      // console.log(packetToDelete)
      mutationDelete.mutate(vehicleInpsectionToDelete?.vehicleInspectionId, {
        onSuccess: () => {
          setDeleteModalVisibility(false);
          setvehicleInpsectionToDelete(null);
        },
        onError: (error: NormalizedErrorT) => {
          setDeleteModalVisibility(false)
          setErrorModalVisibility(true)
          setvehicleInpsectionToDelete(null)
          setErrorMessage(error.message)
        }
      });
    }
  };
  const confirmAddandUpdate = (data: Partial<VehicleInspectionApplicationT>, method: 'put' | 'post') => {
    console.log('hello from add ')
    console.log('method : ', method, "data", data)

    if (method === 'put') {
      // We pass ONE object containing id and the rest of the data
      // const { fieldName, description, packet_Id } = data;
      const payloadData = {
        ...data,
        vehicleInspectionId: selectedvehicleInpsection?.vehicleInspectionId
      }
      console.log("the data sended for update", payloadData)
      console.log('payload data', payloadData)
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
    refetchvehicleInpsection()
  }


  // {isPending&&<SplashScreen/>}
  if (vehicleInpsectionIsPending || vehiclesIsPending) return (
    <SplashScreen />
  )

  if (isVehiclesError || isErrorvehicleInpsection) return (
    <ErrorScreen onRetry={refetch} />
  )

  // Manually define your columns to map labels to specific object keys
  const columns: ColumnConfig<dataShapeToShow>[] = [
    { label: 'vehiclesPage.vehiclePlate', key: 'vehicle' },
    { label: 'vehicleInspectionPage.inspectionDate', key: 'inspectionDate' },
    { label: 'vehicleInspectionPage.expiryDate', key: 'expiryDate' },
    { label: 'common.notes', key: 'notes' },

  ];

  return (
    <>
      <View
        style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5 }}>

        <LucideIconButton
          icon={"Plus"}
          text={'vehicleInspectionPage.addVehicleInspection'}
          onPress={handleAddNew}
        />
      </View>

      <ResponsiveTable data={mappedData} columns={columns} uniqueKey='vehicleInspectionId' handleEdit={handleEdit} handleDelete={handleDelete} />

      <VehicleInspectionFormModal
        visible={saveModalVisibility}
        initialData={selectedvehicleInpsection}
        onClose={() => setSaveModalVisibility(false)}
        onSubmit={(data, method) => confirmAddandUpdate(data, method)}
        vehiclesData={vehiclesData
          ?.filter((item) => item?.vehicleId !== undefined)
          .map((item) => ({
            label: item.plate ?? 'Unknown Plate',
            value: item.vehicleId as number // Casting is safe here because of the filter
          }))}
      />


      <DeleteConfirmationModal
        visible={deleteModalVisiblity}
        onClose={() => {
          setDeleteModalVisibility(false);
          setvehicleInpsectionToDelete(null);
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



export default VehicleInspection;