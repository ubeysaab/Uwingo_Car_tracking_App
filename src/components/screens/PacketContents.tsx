import ResponsiveTable from '@/components/ResponsiveTable/ResponsiveTable';

import { NormalizedErrorT } from '@/types/auth';
import * as React from 'react';
import { View } from 'react-native';

import LucideIconButton from '@/components/IconButton/LucideIconButton';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal';
import ErrorModal from '@/components/Modals/ErrorModal';
import SplashScreen from '@/components/Screens/SplashScreen';
import ErrorScreen from '@/components/Screens/ErrorScreen';
import { ColumnConfig } from '@/components/ResponsiveTable/types';

import PacketContentsFormModal from '@/components/Modals/forms/PacketContentsFormModal';
import { useCreatePacketContents, useDeletePacketContent, useGetPacketContents, useUpdatePacketContent } from '@/store/server/usePacketContents';
import { useGetPackets } from '@/store/server/usePackets';
import { PacketContentsApplicationT } from '@/types/comingData/packetContents';
import { PacketApplicationT } from '@/types/comingData/packets';
import { useTranslation } from 'react-i18next';

interface dataShapeToShow {
  packetContentId: number | null,
  packet_Id: number | null,
  fieldName: string | null,
  description: string | null,
  packetType: string | null
}



const PacketContents = () => {

  const { t } = useTranslation();

  const { data: packetsData, isPending: packetIsPending, isError: isErrorPacket, refetch: refetchPacket, error: packetError } = useGetPackets();
  const { data, isPending, isError, refetch, error } = useGetPacketContents()
  const mutationDelete = useDeletePacketContent()
  const mutationUpdate = useUpdatePacketContent()
  const mutationAdd = useCreatePacketContents()

  // 1. State to manage the Modal
  const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
  const [deleteModalVisiblity, setDeleteModalVisibility] = React.useState(false);
  const [errorModalVisibility, setErrorModalVisibility] = React.useState(false)


  const [selectedPacketContent, setSelectedPacketContent] = React.useState<PacketContentsApplicationT | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // 1. Add state to track the ID specifically for deletion
  const [packetToDelete, setPacketToDelete] = React.useState<PacketContentsApplicationT | null>(null);



  const handleDelete = (id: any) => {
    setPacketToDelete(id);
    setDeleteModalVisibility(true);
  };


  // 2. Handlers
  const handleEdit = (packetContent: PacketContentsApplicationT) => {
    setSelectedPacketContent(packetContent); // Set the vehicle to be edited
    setSaveModalVisibility(true);       // Open modal
  };

  const handleAddNew = () => {
    // console.log(data)
    setSelectedPacketContent(null);    // No vehicle means "Add Mode"
    setSaveModalVisibility(true);
  };





  const mappedData = React.useMemo(() => {
    // 1. Safety check
    if (!data || !packetsData) {
      return [];
    }


    const mappedData = data.map((junction: PacketContentsApplicationT): dataShapeToShow => {
      const packet = packetsData.find((d: PacketApplicationT) => d?.packetId === junction?.packet_Id);

      return {
        packetContentId: junction?.packetContentId || null,
        packet_Id: packet?.packetId || null,
        fieldName: junction?.fieldName || null,
        description: junction?.description || null,
        packetType: packet?.packetType || null
      };
    });

    return mappedData;
  }, [data, packetsData]);











  const confirmDelete = () => {
    if (packetToDelete?.packetContentId) {
      // console.log(packetToDelete)
      mutationDelete.mutate(packetToDelete?.packetContentId, {
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
  const confirmAddandUpdate = (data: Partial<PacketContentsApplicationT>, method: 'put' | 'post') => {
    console.log('hello from add ')
    console.log('method : ', method, "data", data)

    if (method === 'put') {
      // We pass ONE object containing id and the rest of the data
      console.log("the data sended for update", data)
      const { fieldName, description, packet_Id } = data;
      const payloadData = {
        packetContentId: selectedPacketContent?.packetContentId,
        fieldName,
        description,
        packet_Id
      }
      console.log("the payloadData sended for update", payloadData)
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
  if (isPending || packetIsPending) return (
    <SplashScreen />
  )

  if (isError || isErrorPacket) return (
    <ErrorScreen onRetry={refetch} message={error?.message || packetError?.message} />
  )

  // Manually define your columns to map labels to specific object keys
  const columns: ColumnConfig<dataShapeToShow>[] = [
    { label: 'packetContents.packetName', key: 'packetType' },
    { label: 'packetContents.fieldName', key: 'fieldName' },
    { label: 'packetContents.packetContentDescription', key: 'description' },
  ];

  return (
    <>
      <View
        style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5 }}>

        <LucideIconButton
          icon={"Plus"}
          text={'packetContents.addPacketContent'}
          onPress={handleAddNew}
        />
      </View>

      <ResponsiveTable data={mappedData} columns={columns} uniqueKey='packetContentId' handleEdit={handleEdit} handleDelete={handleDelete} />

      <PacketContentsFormModal
        visible={saveModalVisibility}
        initialData={selectedPacketContent}
        onClose={() => setSaveModalVisibility(false)}
        onSubmit={(data, method) => confirmAddandUpdate(data, method)}
        packetsData={packetsData?.map((item: PacketApplicationT) => ({ label: item?.packetType, value: item?.packetId }))}
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



export default PacketContents;