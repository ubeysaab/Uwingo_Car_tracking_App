import ResponsiveTable from '@/components/ResponsiveTable/ResponsiveTable';
import { NormalizedErrorT } from '@/types/auth';
import React from 'react';
import { View } from 'react-native';
import LucideIconButton from '@/components/IconButton/LucideIconButton';
import ErrorScreen from '@/components/Screens/ErrorScreen';
import ErrorModal from '@/components/Modals/ErrorModal';
import SplashScreen from '@/components/Screens/SplashScreen';
import { ColumnConfig } from '@/components/ResponsiveTable/types';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal';


import VehicleSpeedLimitFormModal from '@/components/Modals/forms/VehicleSpeedLimitFormModal';
import { useCreateVehicleSpeedLimit, useDeleteVehicleSpeedLimit, useGetVehicleSpeedLimit, useUpdateVehicleSpeedLimit } from '@/store/server/useVehicleSpeedLimit';
import { useGetVehicles } from '@/store/server/useVehicles';
import { VehicleSpeedLimitApplicationT } from '@/types/comingData/vehicleSpeedLimit';

interface dataShapeToShow {
  vehicleSpeedLimitId: number | null;
  vehicleId: number | null;
  vehicle: string | null
  description: string | null;
  speedLimit: number | null;
  startDate: string | null; // ISO String format
  endDate: string | null;   // ISO String format

}



const VehicleSpeedLimit = () => {

  const { data: vehicleSpeedLimitData, isPending: vehicleSpeedLimitIsPending, isError: isErrorVehicleSpeedLimit, refetch: refetchVehicleSpeedLimit, error: vehicleSpeedLimitError } = useGetVehicleSpeedLimit();
  const { data: vehiclesData, isPending: vehiclesIsPending, isError: isVehiclesError, refetch: refetchVehicles, error: vehiclesError } = useGetVehicles()
  const mutationDelete = useDeleteVehicleSpeedLimit()
  const mutationUpdate = useUpdateVehicleSpeedLimit()
  const mutationAdd = useCreateVehicleSpeedLimit()

  // 1. State to manage the Modal
  const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
  const [deleteModalVisiblity, setDeleteModalVisibility] = React.useState(false);
  const [errorModalVisibility, setErrorModalVisibility] = React.useState(false)


  const [selectedVehicleSpeedLimit, setSelectedVehicleSpeedLimit
  ] = React.useState<VehicleSpeedLimitApplicationT | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // 1. Add state to track the ID specifically for deletion
  const [vehicleSpeedLimitToDelete, setVehicleSpeedLimitToDelete] = React.useState<VehicleSpeedLimitApplicationT | null>(null);



  const handleDelete = (id: any) => {
    setVehicleSpeedLimitToDelete(id);
    setDeleteModalVisibility(true);
  };


  // 2. Handlers
  const handleEdit = (vehicleSpeedLimit: VehicleSpeedLimitApplicationT) => {
    setSelectedVehicleSpeedLimit(vehicleSpeedLimit);
    setSaveModalVisibility(true);
  };

  const handleAddNew = () => {
    // console.log(data)
    setSelectedVehicleSpeedLimit(null);
    setSaveModalVisibility(true);
  };



  const mappedData = React.useMemo(() => {
    if (!vehiclesData || !vehicleSpeedLimitData) {
      return [];
    }

    const theFilteredData: dataShapeToShow[] = vehicleSpeedLimitData.map((junction: VehicleSpeedLimitApplicationT): dataShapeToShow => {
      const vehicle = vehiclesData.find((v) => v?.vehicleId === junction?.vehicleId);

      return {
        vehicleSpeedLimitId: junction?.vehicleSpeedLimitId || null,
        vehicleId: junction?.vehicleId || null,
        description: junction?.description || null,
        startDate: junction?.startDate.split('T')[0] || null,
        endDate: junction?.endDate.split('T')[0] || null,
        speedLimit: junction?.speedLimit || null,

        vehicle: `${vehicle?.plate} (${vehicle?.make} ${vehicle?.model})` || null,


      }
    })
    return theFilteredData
  }, [vehicleSpeedLimitData, vehiclesData])


  const confirmDelete = () => {
    if (vehicleSpeedLimitToDelete?.vehicleSpeedLimitId) {
      // console.log(packetToDelete)
      mutationDelete.mutate(vehicleSpeedLimitToDelete?.vehicleSpeedLimitId, {
        onSuccess: () => {
          setDeleteModalVisibility(false);
          setVehicleSpeedLimitToDelete(null);
        },
        onError: (error: NormalizedErrorT) => {
          setDeleteModalVisibility(false)
          setErrorModalVisibility(true)
          setVehicleSpeedLimitToDelete(null)
          setErrorMessage(error.message)
        }
      });
    }
  };
  const confirmAddandUpdate = (data: Partial<VehicleSpeedLimitApplicationT>, method: 'put' | 'post') => {
    console.log('hello from add ')
    console.log('method : ', method, "data", data)

    if (method === 'put') {
      // We pass ONE object containing id and the rest of the data
      console.log("the data sended for update", data)
      // const { fieldName, description, packet_Id } = data;
      const payloadData = {
        ...data,
        vehicleSpeedLimitId: selectedVehicleSpeedLimit?.vehicleSpeedLimitId
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
    refetchVehicleSpeedLimit()
  }


  // {isPending&&<SplashScreen/>}
  if (vehicleSpeedLimitIsPending || vehiclesIsPending) return (
    <SplashScreen />
  )

  if (isVehiclesError || isErrorVehicleSpeedLimit) return (
    <ErrorScreen onRetry={refetch} message={vehiclesError?.message || vehicleSpeedLimitError?.message} />
  )

  // Manually define your columns to map labels to specific object keys
  const columns: ColumnConfig<dataShapeToShow>[] = [
    { label: 'vehiclesPage.vehiclePlate', key: 'vehicle' },
    { label: 'vehicleSpeedLimitPage.speedLimit', key: 'speedLimit' },
    { label: 'vehicleSpeedLimitPage.startDate', key: 'startDate' },
    { label: 'vehicleSpeedLimitPage.endDate', key: 'endDate' },
    { label: 'common.description', key: 'description' },

  ];

  return (
    <>
      <View
        style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5 }}>

        <LucideIconButton
          icon={"Plus"}
          text={'vehicleSpeedLimitPage.addVehicleSpeedLimit'}
          onPress={handleAddNew}
        />
      </View>

      <ResponsiveTable data={mappedData} columns={columns} uniqueKey='vehicleSpeedLimitId' handleEdit={handleEdit} handleDelete={handleDelete} />

      <VehicleSpeedLimitFormModal
        visible={saveModalVisibility}
        initialData={selectedVehicleSpeedLimit}
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
          setVehicleSpeedLimitToDelete(null);
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



export default VehicleSpeedLimit;