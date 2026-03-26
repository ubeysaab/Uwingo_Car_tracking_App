import ResponsiveTable from '@/components/ResponsiveTable/ResponsiveTable';
import { NormalizedErrorT } from '@/types/auth';
import React from 'react';
import { View } from 'react-native';
import LucideIconButton from '../IconButton/LucideIconButton';
import DeleteConfirmationModal from '../Modals/DeleteConfirmationModal';
import ErrorModal from '../Modals/ErrorModal';
import { ColumnConfig } from '../ResponsiveTable/types';
import ErrorScreen from './ErrorScreen';
import SplashScreen from './SplashScreen';



import DevicesFormModal from '@/components/Modals/forms/DevicesFormModal';
import { useCreateDevice, useDeleteDevice, useGetDevices, useUpdateDevice } from '@/store/server/useDevices';
import { useGetPackets } from '@/store/server/usePackets';
import { DeviceApplicationT } from '@/types/comingData/devices';





const Devices = () => {

  const { data: devicesData, isPending: DevicesIsPending, isError: isErrorDevices, refetch: refetchVehicleDevices, error: devicesError } = useGetDevices();
  const { data: packetsData, isPending: packetsIsPending, isError: isPacketsError, refetch: refetchPackets, error: packetsError } = useGetPackets()
  const mutationDelete = useDeleteDevice()
  const mutationUpdate = useUpdateDevice()
  const mutationAdd = useCreateDevice()

  // 1. State to manage the Modal
  const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
  const [deleteModalVisiblity, setDeleteModalVisibility] = React.useState(false);
  const [errorModalVisibility, setErrorModalVisibility] = React.useState(false)


  const [selectedDevice, setSelectedDevice
  ] = React.useState<DeviceApplicationT | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // 1. Add state to track the ID specifically for deletion
  const [DeviceToDelete, setVehicleCascoToDelete] = React.useState<DeviceApplicationT | null>(null);



  const handleDelete = (id: any) => {
    setVehicleCascoToDelete(id);
    setDeleteModalVisibility(true);
  };


  // 2. Handlers
  const handleEdit = (device: DeviceApplicationT) => {
    setSelectedDevice(device);
    setSaveModalVisibility(true);
  };

  const handleAddNew = () => {
    // console.log(data)
    setSelectedDevice(null);
    setSaveModalVisibility(true);
  };






  const confirmDelete = () => {
    if (DeviceToDelete?.deviceId) {
      // console.log(packetToDelete)
      mutationDelete.mutate(DeviceToDelete?.deviceId, {
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
  const confirmAddandUpdate = (data: Partial<DeviceApplicationT>, method: 'put' | 'post') => {
    console.log('hello from add ')
    console.log('method : ', method, "data", data)

    if (method === 'put') {
      // We pass ONE object containing id and the rest of the data
      console.log("the data sended for update", data)
      // const { fieldName, description, packet_Id } = data;
      const payloadData = {
        ...data,
        deviceId: selectedDevice?.deviceId
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
    refetchPackets()
    refetchVehicleDevices()
  }


  // {isPending&&<SplashScreen/>}
  if (DevicesIsPending || packetsIsPending) return (
    <SplashScreen />
  )

  if (isPacketsError || isErrorDevices) return (
    <ErrorScreen onRetry={refetch} message={devicesError?.message || packetsError?.message
    } />
  )

  // Manually define your columns to map labels to specific object keys
  const columns: ColumnConfig<DeviceApplicationT>[] = [
    { label: 'devicesPage.deviceSerialNumber', key: 'serialNumber' },
    { label: 'devicesPage.deviceModel', key: 'model' },
    { label: 'devicesPage.devicePacketType', key: 'packetType' },
    { label: 'devicesPage.connectedVehicle', key: 'isConnectedVehicles' },
    { label: 'devicesPage.devicePhoneNumber', key: 'devicePhoneNumber' },

  ];

  return (
    <>
      <View
        style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5 }}>

        <LucideIconButton
          icon={"Plus"}
          text="devicesPage.addDevice"
          onPress={handleAddNew}
        />
      </View>

      <ResponsiveTable data={devicesData} columns={columns} uniqueKey='deviceId' handleEdit={handleEdit} handleDelete={handleDelete} />

      <DevicesFormModal
        visible={saveModalVisibility}
        initialData={selectedDevice}
        onClose={() => setSaveModalVisibility(false)}
        onSubmit={(data, method) => confirmAddandUpdate(data, method)}
        packetsData={packetsData
          ?.filter((item) => item?.packetId !== undefined)
          .map((item) => ({
            label: item.packetType ?? 'Unknown type',
            value: item.packetType // Casting is safe here because of the filter
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



export default Devices;