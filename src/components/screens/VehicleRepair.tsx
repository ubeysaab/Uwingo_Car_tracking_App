import ResponsiveTable from '@/components/ResponsiveTable/ResponsiveTable';
import { NormalizedErrorT } from '@/types/auth';
import React from 'react';
import { View } from 'react-native';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal';
import SplashScreen from '@/components/Screens/SplashScreen';
import ErrorModal from '@/components/Modals/ErrorModal';
import ErrorScreen from '@/components/Screens/ErrorScreen';
import { ColumnConfig } from '@/components/ResponsiveTable/types';
import LucideIconButton from '@/components/IconButton/LucideIconButton';



import { useGetVehicles } from '@/store/server/useVehicles';
import { useCreateVehicleRepair, useDeleteVehicleRepair, useGetVehicleRepair, useUpdateVehicleRepair } from '@/store/server/useVehicleRepair';
import { VehicleRepairApplicationT } from '@/types/comingData/vehicleRepair';
import VehicleRepairFormModal from '@/components/Modals/forms/VehicleRepairFormModal';

interface dataShapeToShow {
  vehicleRepairId: number | null;
  vehicleId: number | null;
  vehicle: string | null
  repairDate: string | null; // ISO String format
  faultType: string | null;
  faultDescription: string | null;
  repairAction: string | null;
  performedBy: string | null;
  repairCost: number | null;
  notes: string | null;
  images: string[] | []
}



const VehicleRepair = () => {

  const { data: vehicleRepairData, isPending: vehicleRepairIsPending, isError: isErrorVehicleRepair, refetch: refetchVehicleRepair, error: vehiclesRepairError } = useGetVehicleRepair();
  const { data: vehiclesData, isPending: vehiclesIsPending, isError: isVehiclesError, refetch: refetchVehicles, error: vehiclesError } = useGetVehicles()
  const mutationDelete = useDeleteVehicleRepair()
  const mutationUpdate = useUpdateVehicleRepair()
  const mutationAdd = useCreateVehicleRepair()

  // 1. State to manage the Modal
  const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
  const [deleteModalVisiblity, setDeleteModalVisibility] = React.useState(false);
  const [errorModalVisibility, setErrorModalVisibility] = React.useState(false)


  const [selectedVehicleRepair, setSelectedVehicleRepair
  ] = React.useState<VehicleRepairApplicationT | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // 1. Add state to track the ID specifically for deletion
  const [vehicleRepairToDelete, setVehicleRepairToDelete] = React.useState<VehicleRepairApplicationT | null>(null);


  // 2. Handlers

  const handleDelete = (id: any) => {
    setVehicleRepairToDelete(id);
    setDeleteModalVisibility(true);
  };



  const handleEdit = (vehicleRepair: VehicleRepairApplicationT) => {
    setSelectedVehicleRepair(vehicleRepair);
    setSaveModalVisibility(true);
  };

  const handleAddNew = () => {
    // console.log(data)
    setSelectedVehicleRepair(null);
    setSaveModalVisibility(true);
  };



  const mappedData = React.useMemo(() => {
    if (!vehiclesData || !vehicleRepairData) {
      return [];
    }

    const theFilteredData: dataShapeToShow[] = vehicleRepairData.map((junction: VehicleRepairApplicationT): dataShapeToShow => {
      const vehicle = vehiclesData.find((v) => v?.vehicleId === junction?.vehicleId);

      return {
        vehicleRepairId: junction?.vehicleRepairId || null,
        vehicleId: junction?.vehicleId || null,
        repairDate: junction?.repairDate?.split('T')[0] || null,
        faultType: junction?.faultType || null,
        faultDescription: junction?.faultDescription || null,
        repairAction: junction?.repairAction || null,
        performedBy: junction?.performedBy || null,
        repairCost: junction?.repairCost || null,
        vehicle: `${vehicle?.plate} (${vehicle?.make} ${vehicle?.model})` || null,
        notes: junction?.notes || null,
        images: junction?.images || []

      }
    })
    return theFilteredData
  }, [vehicleRepairData, vehiclesData])


  const confirmDelete = () => {
    if (vehicleRepairToDelete?.vehicleRepairId) {
      // console.log(packetToDelete)
      mutationDelete.mutate(vehicleRepairToDelete?.vehicleRepairId, {
        onSuccess: () => {
          setDeleteModalVisibility(false);
          setVehicleRepairToDelete(null);
        },
        onError: (error: NormalizedErrorT) => {
          setDeleteModalVisibility(false)
          setErrorModalVisibility(true)
          setVehicleRepairToDelete(null)
          setErrorMessage(error.message)
        }
      });
    }
  };
  const confirmAddandUpdate = (data: Partial<VehicleRepairApplicationT>, method: 'put' | 'post') => {
    console.log('hello from add ')
    console.log('method : ', method, "data", data)

    if (method === 'put') {
      console.log("the data sended for update", data)
      const payloadData = {
        ...data,
        vehicleRepairId: selectedVehicleRepair?.vehicleRepairId
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
    refetchVehicleRepair()
  }


  // {isPending&&<SplashScreen/>}
  if (vehicleRepairIsPending || vehiclesIsPending) return (
    <SplashScreen />
  )

  if (isVehiclesError || isErrorVehicleRepair) return (
    <ErrorScreen onRetry={refetch} message={vehiclesError?.message || vehiclesRepairError?.message} />
  )

  // Manually define your columns to map labels to specific object keys
  const columns: ColumnConfig<dataShapeToShow>[] = [
    { label: 'vehiclesPage.vehiclePlate', key: 'vehicle' },
    { label: 'vehicleRepairPage.repairDate', key: 'repairDate' },
    { label: 'vehicleRepairPage.faultType', key: 'faultType' },
    { label: 'vehicleRepairPage.faultDescription', key: 'faultDescription' },
    { label: 'vehicleRepairPage.repairAction', key: 'repairAction' },
    { label: 'vehicleMaintenancePage.performedBy', key: 'performedBy' },
    { label: 'vehicleRepairPage.repairCost', key: 'repairCost' },


  ];

  return (
    <>
      <View
        style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5 }}>

        <LucideIconButton
          icon={"Plus"}
          text={'vehicleRepairPage.addVehicleRepair'}
          onPress={handleAddNew}
        />
      </View>

      <ResponsiveTable data={mappedData} columns={columns} uniqueKey='vehicleRepairId' handleEdit={handleEdit} handleDelete={handleDelete} />

      <VehicleRepairFormModal
        visible={saveModalVisibility}
        initialData={selectedVehicleRepair}
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
          setVehicleRepairToDelete(null);
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



export default VehicleRepair;