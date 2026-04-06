import ResponsiveTable from '@/components/ResponsiveTable/ResponsiveTable';
import { NormalizedErrorT } from '@/types/auth';
import React from 'react';
import { View } from 'react-native';

import LucideIconButton from '@/components/IconButton/LucideIconButton';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal';
import SplashScreen from '@/components/Screens/SplashScreen';
import ErrorScreen from '@/components/Screens/ErrorScreen';
import ErrorModal from '@/components/Modals/ErrorModal';
import { ColumnConfig } from '@/components/ResponsiveTable/types';


import VehicleCascoFormModal from '@/components/Modals/forms/VehicleCascoFormModal';
import { useCreateVehicleCasco, useDeleteVehicleCasco, useGetVehicleCasco, useUpdateVehicleCasco } from '@/store/server/useVehicleCasco';
import { useGetVehicles } from '@/store/server/useVehicles';
import { VehicleCascoApplicationT } from '@/types/comingData/vehicleCasco';


interface dataShapeToShow {
  vehicleCascoId: number | null;
  vehicleId: number | null;
  vehicle: string | null
  policyNumber: string | null;
  insuranceCompany: string | null;
  startDate: string | null; // ISO String format
  endDate: string | null;   // ISO String format

}



const VehicleCasco = () => {


  const { data: vehicleCascoData, isPending: vehicleCascoIsPending, isError: isErrorVehicleCasco, refetch: refetchVehicleCasco, error: vehicleCascoError } = useGetVehicleCasco();
  const { data: vehiclesData, isPending: vehiclesIsPending, isError: isVehiclesError, refetch: refetchVehicles, error: vehicleError } = useGetVehicles()
  const mutationDelete = useDeleteVehicleCasco()
  const mutationUpdate = useUpdateVehicleCasco()
  const mutationAdd = useCreateVehicleCasco()

  // 1. State to manage the Modal
  const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
  const [deleteModalVisiblity, setDeleteModalVisibility] = React.useState(false);
  const [errorModalVisibility, setErrorModalVisibility] = React.useState(false)


  const [selectedVehicleCasco, setSelectedVehicleCasco
  ] = React.useState<VehicleCascoApplicationT | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // 1. Add state to track the ID specifically for deletion
  const [vehicleCascoToDelete, setVehicleCascoToDelete] = React.useState<VehicleCascoApplicationT | null>(null);



  const handleDelete = (id: any) => {
    setVehicleCascoToDelete(id);
    setDeleteModalVisibility(true);
  };


  // 2. Handlers
  const handleEdit = (vehicleCasco: VehicleCascoApplicationT) => {
    const payload = {
      ...vehicleCasco,
      startDate: new Date(vehicleCasco?.startDate).toISOString().split('.')[0],
      endDate: new Date(vehicleCasco?.endDate).toISOString().split('.')[0]

    }
    setSelectedVehicleCasco(payload);
    // setSelectedVehicleCasco(vehicleCasco);
    setSaveModalVisibility(true);
  };

  const handleAddNew = () => {
    // console.log(data)
    setSelectedVehicleCasco(null);
    setSaveModalVisibility(true);
  };



  const mappedData = React.useMemo(() => {
    if (!vehiclesData || !vehicleCascoData) {
      return [];
    }

    const theFilteredData: dataShapeToShow[] = vehicleCascoData.map((junction: VehicleCascoApplicationT): dataShapeToShow => {
      const vehicle = vehiclesData.find((v) => v?.vehicleId === junction?.vehicleId);

      return {
        vehicleCascoId: junction?.vehicleCascoId || null,
        vehicleId: junction?.vehicleId || null,
        policyNumber: junction?.policyNumber || null,
        insuranceCompany: junction?.insuranceCompany || null,
        startDate: junction?.startDate.split('T')[0] || null,
        endDate: junction?.endDate.split('T')[0] || null,

        vehicle: `${vehicle?.plate} (${vehicle?.make} ${vehicle?.model})` || null,


      }
    })
    return theFilteredData
  }, [vehicleCascoData, vehiclesData])


  const confirmDelete = () => {
    if (vehicleCascoToDelete?.vehicleCascoId) {
      // console.log(packetToDelete)
      mutationDelete.mutate(vehicleCascoToDelete?.vehicleCascoId, {
        onSuccess: () => {
          setDeleteModalVisibility(false);
          setVehicleCascoToDelete(null);
        },
        onError: (error: NormalizedErrorT) => {
          setDeleteModalVisibility(false)
          setErrorModalVisibility(true)
          setVehicleCascoToDelete(null)
          setErrorMessage(error.message)
        }
      });
    }
  };
  const confirmAddandUpdate = (data: Partial<VehicleCascoApplicationT>, method: 'put' | 'post') => {
    console.log('hello from add ')
    console.log('method : ', method, "data", data)

    if (method === 'put') {
      // We pass ONE object containing id and the rest of the data
      console.log("the data sended for update", data)
      // const { fieldName, description, packet_Id } = data;
      const payloadData = {
        ...data,
        vehicleCascoId: selectedVehicleCasco?.vehicleCascoId
      }
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
    refetchVehicleCasco()
  }


  // {isPending&&<SplashScreen/>}
  if (vehicleCascoIsPending || vehiclesIsPending) return (
    <SplashScreen />
  )

  if (isVehiclesError || isErrorVehicleCasco) return (
    <ErrorScreen onRetry={refetch} message={vehicleError?.message || vehicleCascoError?.message} />
  )

  // Manually define your columns to map labels to specific object keys
  const columns: ColumnConfig<dataShapeToShow>[] = [
    { label: 'vehiclesPage.vehiclePlate', key: 'vehicle' },
    { label: 'vehicleCascoPage.policyNumber', key: 'policyNumber' },
    { label: 'vehicleCascoPage.startDate', key: 'startDate' },
    { label: 'vehicleCascoPage.endDate', key: 'endDate' },
    { label: 'vehicleCascoPage.insuranceCompany', key: 'insuranceCompany' },

  ];

  return (
    <>
      <View
        style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5 }}>

        <LucideIconButton
          icon={"Plus"}
          text={'vehicleCascoPage.addVehicleCasco'}
          onPress={handleAddNew}
        />
      </View>

      <ResponsiveTable data={mappedData} columns={columns} uniqueKey='vehicleCascoId' handleEdit={handleEdit} handleDelete={handleDelete} />

      <VehicleCascoFormModal
        visible={saveModalVisibility}
        initialData={selectedVehicleCasco}
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
          setVehicleCascoToDelete(null);
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



export default VehicleCasco;