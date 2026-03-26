import ResponsiveTable from '@/components/ResponsiveTable/ResponsiveTable';
import { NormalizedErrorT } from '@/types/auth';
import React from 'react';
import { View } from 'react-native';


import LucideIconButton from '@/components/IconButton/LucideIconButton';
import ErrorModal from '@/components/Modals/ErrorModal';
import ErrorScreen from '@/components/Screens/ErrorScreen';
import { ColumnConfig } from '@/components/ResponsiveTable/types';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal';
import SplashScreen from '@/components/Screens/SplashScreen';

import { useGetVehicles } from '@/store/server/useVehicles';
import { useCreateVehicleInsurance, useDeleteVehicleInsurance, useGetVehicleInsurance, useUpdateVehicleInsurance } from '@/store/server/useVehicleInsurance';

import { VehicleInsuranceApplicationT } from '@/types/comingData/vehicleInsurance';
import VehicleInsuranceFormModel from '@/components/Modals/forms/VehicleInsuranceFormModal';

interface dataShapeToShow {
  vehicleInsuranceId: number | null;
  vehicleId: number | null;
  vehicle: string | null
  policyNumber: string | null;
  insuranceCompany: string | null;
  startDate: string | null; // ISO String format
  endDate: string | null;   // ISO String format

}



const VehicleInsurance = () => {

  const { data: vehicleInsuranceData, isPending: vehicleInsuranceIsPending, isError: isErrorVehicleInsurance, refetch: refetchVehicleInsurance, error: insuranceError } = useGetVehicleInsurance();
  const { data: vehiclesData, isPending: vehiclesIsPending, isError: isVehiclesError, refetch: refetchVehicles, error: vehicleError } = useGetVehicles()
  const mutationDelete = useDeleteVehicleInsurance()
  const mutationUpdate = useUpdateVehicleInsurance()
  const mutationAdd = useCreateVehicleInsurance()

  // 1. State to manage the Modal
  const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
  const [deleteModalVisiblity, setDeleteModalVisibility] = React.useState(false);
  const [errorModalVisibility, setErrorModalVisibility] = React.useState(false)


  const [selectedVehicleInsurance, setSelectedVehicleInsurance
  ] = React.useState<VehicleInsuranceApplicationT | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // 1. Add state to track the ID specifically for deletion
  const [vehicleInsuranceToDelete, setVehicleInsuranceToDelete] = React.useState<VehicleInsuranceApplicationT | null>(null);



  const handleDelete = (id: any) => {
    setVehicleInsuranceToDelete(id);
    setDeleteModalVisibility(true);
  };


  // 2. Handlers
  const handleEdit = (vehicleInsurance: VehicleInsuranceApplicationT) => {
    console.log(vehicleInsurance)
    setSelectedVehicleInsurance(vehicleInsurance);
    setSaveModalVisibility(true);
  };

  const handleAddNew = () => {
    // console.log(data)
    setSelectedVehicleInsurance(null);
    setSaveModalVisibility(true);
  };



  const mappedData = React.useMemo(() => {
    if (!vehiclesData || !vehicleInsuranceData) {
      return [];
    }

    const theFilteredData: dataShapeToShow[] = vehicleInsuranceData.map((junction: VehicleInsuranceApplicationT): dataShapeToShow => {
      const vehicle = vehiclesData.find((v) => v?.vehicleId === junction?.vehicleId);

      return {
        vehicleInsuranceId: junction?.vehicleInsuranceId || null,
        vehicleId: junction?.vehicleId || null,
        policyNumber: junction?.policyNumber || null,
        insuranceCompany: junction?.insuranceCompany || null,
        startDate: junction?.startDate?.split('T')[0] || null,
        endDate: junction?.endDate?.split('T')[0] || null,
        vehicle: `${vehicle?.plate} (${vehicle?.make} ${vehicle?.model})` || null,


      }
    })
    return theFilteredData
  }, [vehicleInsuranceData, vehiclesData])


  const confirmDelete = () => {
    if (vehicleInsuranceToDelete?.vehicleInsuranceId) {
      // console.log(packetToDelete)
      mutationDelete.mutate(vehicleInsuranceToDelete?.vehicleInsuranceId, {
        onSuccess: () => {
          setDeleteModalVisibility(false);
          setVehicleInsuranceToDelete(null);
        },
        onError: (error: NormalizedErrorT) => {
          setDeleteModalVisibility(false)
          setErrorModalVisibility(true)
          setVehicleInsuranceToDelete(null)
          setErrorMessage(error.message)
        }
      });
    }
  };
  const confirmAddandUpdate = (data: Partial<VehicleInsuranceApplicationT>, method: 'put' | 'post') => {
    console.log('hello from add ')
    console.log('method : ', method, "data", data)

    if (method === 'put') {
      // We pass ONE object containing id and the rest of the data
      console.log("the data sended for update", data)
      // const { fieldName, description, packet_Id } = data;
      const payloadData = {
        ...data,
        vehicleInsuranceId: selectedVehicleInsurance?.vehicleInsuranceId
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
    refetchVehicleInsurance()
  }


  // {isPending&&<SplashScreen/>}
  if (vehicleInsuranceIsPending || vehiclesIsPending) return (
    <SplashScreen />
  )

  if (isVehiclesError || isErrorVehicleInsurance) return (
    <ErrorScreen onRetry={refetch} message={insuranceError?.message || vehicleError?.message} />
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
          text={'vehicleInsurancePage.addVehicleInsurance'}
          onPress={handleAddNew}
        />
      </View>

      <ResponsiveTable data={mappedData}
        columns={columns}
        uniqueKey='vehicleInsuranceId'
        handleEdit={handleEdit}
        handleDelete={handleDelete} />

      <VehicleInsuranceFormModel
        visible={saveModalVisibility}
        initialData={selectedVehicleInsurance}
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
          setVehicleInsuranceToDelete(null);
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



export default VehicleInsurance;