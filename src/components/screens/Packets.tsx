import ResponsiveTable from '@/components/ResponsiveTable/ResponsiveTable';

import { NormalizedErrorT } from '@/types/auth';
import * as React from 'react';
import { View } from 'react-native';
import LucideIconButton from '../IconButton/LucideIconButton';
import DeleteConfirmationModal from '../Modals/DeleteConfirmationModal';
import ErrorModal from '../Modals/ErrorModal';
import { ColumnConfig } from '../ResponsiveTable/types';
import ErrorScreen from './ErrorScreen';
import SplashScreen from './SplashScreen';



import PacketFormModal from '@/components/Modals/forms/PacketFormModal';
import { useCreatePacket, useDeletePacket, useGetPackets, useUpdatePacket } from '@/store/server/usePackets';
import { PacketApplicationT } from '@/types/comingData/packets';





const Packets = () => {

  const { data, isPending, isError, refetch } = useGetPackets();
  const mutationDelete = useDeletePacket()
  const mutationUpdate = useUpdatePacket()
  const mutationAdd = useCreatePacket()

  // 1. State to manage the Modal
  const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
  const [deleteModalVisiblity, setDeleteModalVisibility] = React.useState(false);
  const [errorModalVisibility, setErrorModalVisibility] = React.useState(false)


  const [selectedPacket, setSelectedPacket] = React.useState<PacketApplicationT | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // 1. Add state to track the ID specifically for deletion
  const [packetToDelete, setPacketToDelete] = React.useState<PacketApplicationT | null>(null);



  const handleDelete = (id: any) => {
    setPacketToDelete(id);
    setDeleteModalVisibility(true);
  };


  // 2. Handlers
  const handleEdit = (packet: PacketApplicationT) => {
    setSelectedPacket(packet); // Set the vehicle to be edited
    setSaveModalVisibility(true);       // Open modal
  };

  const handleAddNew = () => {
    // console.log(data)
    setSelectedPacket(null);    // No vehicle means "Add Mode"
    setSaveModalVisibility(true);
  };


  const confirmDelete = () => {
    if (packetToDelete?.packetId) {
      // console.log(packetToDelete)
      mutationDelete.mutate(packetToDelete?.packetId, {
        onSuccess: () => {
          setDeleteModalVisibility(false);
          setPacketToDelete(null);
        },
        onError: (error: NormalizedErrorT) => {
          setDeleteModalVisibility(false)
          setErrorModalVisibility(true)
          setPacketToDelete(null)
          setErrorMessage(error.message)
        }
      });
    }
  };
  const confirmAddandUpdate = (data: any, method: 'put' | 'post') => {
    console.log('hello from add ')
    console.log('method : ', method, "data", data)

    if (method === 'put') {
      // We pass ONE object containing id and the rest of the data
      console.log("the data sended for update", data)
      const payloadData = {
        ...data,
        packetId: selectedPacket?.packetId,
        // companyApplicationId: selectedPacket?.companyApplicationId
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



  // {isPending&&<SplashScreen/>}
  if (isPending) return (
    <SplashScreen />
  )

  if (isError) return (
    <ErrorScreen onRetry={refetch} />
  )

  // Manually define your columns to map labels to specific object keys
  const columns: ColumnConfig<PacketApplicationT>[] = [
    { label: 'Packet Type', key: 'packetType' },
    { label: 'Packet Description', key: 'description' },
  ];

  return (
    <>
      <View
        style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5 }}>

        <LucideIconButton
          icon={"Plus"}
          text={'Create'}
          onPress={handleAddNew}
        />
      </View>

      <ResponsiveTable data={data} columns={columns} uniqueKey='packetId' handleEdit={handleEdit} handleDelete={handleDelete} />

      <PacketFormModal
        visible={saveModalVisibility}
        initialData={selectedPacket}
        onClose={() => setSaveModalVisibility(false)}
        onSubmit={(data, method) => confirmAddandUpdate(data, method)}
      />


      <DeleteConfirmationModal
        visible={deleteModalVisiblity}
        onClose={() => {
          setDeleteModalVisibility(false);
          setPacketToDelete(null);
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



export default Packets;