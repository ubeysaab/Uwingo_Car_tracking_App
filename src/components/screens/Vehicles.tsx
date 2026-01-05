import ResponsiveTable from '@/components/ResponsiveTable/ResponsiveTable';
import { useGetVehicles, useDeleteVehicle, useUpdateVehicle, useCreateVehicle } from '@/store/server/useVehicles';
import { VehicleApplicationT } from '@/types/vehicles';
import * as React from 'react';
import ErrorScreen from './ErrorScreen';
import SplashScreen from './SplashScreen';
import { ColumnConfig } from '../ResponsiveTable/types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import VehicleFormModal from '../Modals/VehicleFormModals';
import DeleteConfirmationModal from '../Modals/DeleteConfirmationModal';
import ErrorModal from '../Modals/ErrorModal';
import { NormalizedErrorT } from '@/types/auth';









const Vehicles = () => {

  const { data, isPending, isError } = useGetVehicles();
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
  const [vehicleIdToDelete, setVehicleIdToDelete] = React.useState<string | null>(null);



  const handleDelete = (id: any) => {
    setVehicleIdToDelete(id);
    setDeleteModalVisibility(true);
  };


  // 2. Handlers
  const handleEdit = (vehicle: VehicleApplicationT) => {
    setSelectedVehicle(vehicle); // Set the vehicle to be edited
    setSaveModalVisibility(true);       // Open modal
  };

  const handleAddNew = () => {
    // console.log(data)
    setSelectedVehicle(null);    // No vehicle means "Add Mode"
    setSaveModalVisibility(true);
  };


  const confirmDelete = () => {
    if (vehicleIdToDelete) {
      console.log(vehicleIdToDelete)
      mutationDelete.mutate(vehicleIdToDelete, {
        onSuccess: () => {
          setDeleteModalVisibility(false);
          setVehicleIdToDelete(null);
        },
        onError: (error: NormalizedErrorT) => {
          setDeleteModalVisibility(false)
          setErrorModalVisibility(true)
          setVehicleIdToDelete(null)
          setErrorMessage(error.message)
        }
      });
    }
  };
  const confirmAddandUpdate = (data: any, method: 'put' | 'post') => {
    if (method === 'put') {
      // We pass ONE object containing id and the rest of the data
      console.log("the data sended for update", data)
      mutationUpdate.mutate(
        data,
        {
          onSuccess: () => {
            setSaveModalVisibility(false);
            // TODO: Add toast success message here
          },
          onError: (error: NormalizedErrorT) => {
            // console.error("Update failed", error);
            // TODO: Open Error Modal here
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
        onError: () => {
          setErrorModalVisibility(true)
        }
      });
    }
  };



  // {isPending&&<SplashScreen/>}
  if (isPending) return (
    <SplashScreen />
  )

  if (isError) return (
    <ErrorScreen />
  )

  // Manually define your columns to map labels to specific object keys
  const columns: ColumnConfig<VehicleApplicationT>[] = [
    { label: 'Vehicle Plate', key: 'plate' },
    { label: 'Brand', key: 'make' },
    { label: 'Model', key: 'model' },
    { label: 'Model Year', key: 'year' }, // Ensure 'year' exists in VehicleApplicationT
    { label: 'Chassis No', key: 'vin' },
    { label: 'Initial KM', key: 'firstKilometer' },
    { label: 'Has Driver?', key: 'isThereDriver' },
    { label: 'For Rent?', key: 'isItForRent' },
  ];

  return (
    <>
      <View
        style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5 }}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleAddNew}
        >
          <Plus size={18} color="#FFF" />
          <Text style={styles.actionButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      <ResponsiveTable data={data} columns={columns} uniqueKey='plate' handleEdit={handleEdit} handleDelete={handleDelete} />

      <VehicleFormModal
        visible={saveModalVisibility}
        initialData={selectedVehicle}
        onClose={() => setSaveModalVisibility(false)}
        onSubmit={(data, method) => confirmAddandUpdate(data, method)}
      />


      <DeleteConfirmationModal
        visible={deleteModalVisiblity}
        onClose={() => {
          setDeleteModalVisibility(false);
          setVehicleIdToDelete(null);
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



const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  editButton: { backgroundColor: '#007AFF' },
  deleteButton: { backgroundColor: '#FF3B30' },
  actionButtonText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
})

export default Vehicles;