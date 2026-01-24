import DropdownComponent from "@/components/DropDown";
import LucideIconButton from "@/components/IconButton/LucideIconButton";
import { DriverVehiclesApplicationT, DriverVehiclesSchema } from "@/types/comingData/driverVehicles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DropdownItem {
  value: number | undefined;
  label: string; // "Plate" for vehicles, "Name" for drivers
}

interface DriverVehiclesModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any, method: "put" | 'post') => void;
  initialData?: DriverVehiclesApplicationT | null;
  vehicles: DropdownItem[]; // e.g., [{id: 1, label: 'ABC-123'}]
  drivers: DropdownItem[];  // e.g., [{id: 10, label: 'John Doe'}]
}

const DriverVehiclesModal = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  vehicles,
  drivers
}: DriverVehiclesModalProps) => {


  const [method, setMethod] = useState<"put" | "post">('post')
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    // Using .partial() or .pick() here so it doesn't complain about missing fields
    resolver: zodResolver(DriverVehiclesSchema.pick({
      drivers_Id: true,
      vehicle_Id: true
    })),
    defaultValues: {
      drivers_Id: undefined,
      vehicle_Id: undefined
    },
  });





  useEffect(() => {
    console.log('inital data', initialData)

    if (visible) {
      if (initialData) {
        setMethod('put')
        console.log('here even if its ', initialData)
        reset(initialData);
      } else {
        setMethod('post')
        reset({
          drivers_Id: 0,
          vehicle_Id: 0,
        });
      }
    }
  }, [initialData, visible, reset]);




  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>

          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? 'Edit Driver-Vehicle' : 'Add Driver-Vehicle'}</Text>
            {/* <TouchableOpacity onPress={onClose}>
              <X color="#333" size={24} />
            </TouchableOpacity> */}
            <LucideIconButton
              icon='X'
              size={24}
              iconColor={'#333'}
              containerColor={'transparent'}
              onPress={onClose}
            />
          </View>
          <ScrollView style={styles.form}>

            {/* 1. Vehicle Dropdown (Plate) */}
            <Text style={styles.label}>Select Vehicle (Plate)</Text>
            <Controller
              control={control}
              name="vehicle_Id"
              render={({ field: { onChange, value } }) => (

                <DropdownComponent
                  data={vehicles}
                  onChange={onChange
                  }
                  value={value}
                />
              )}
            />

            {/* 2. Driver Dropdown (Name) */}
            <Text style={styles.label}>Select Driver</Text>
            <Controller
              control={control}
              name="drivers_Id"
              render={({ field: { onChange, value } }) => (

                <DropdownComponent
                  data={drivers}
                  onChange={onChange
                  }
                  value={value}
                />
              )}
            />

          </ScrollView>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit(
              (data) => onSubmit(data, method),
              (error) => console.log(error)
            )}
          >
            <Text style={styles.saveButtonText}>Save Details</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default DriverVehiclesModal


const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  inputError: { borderColor: '#FF3B30' },
  row: { flexDirection: 'row' },
  flex1: { flex: 1 },
  pickerContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  radioBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center' },
  radioBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  radioText: { fontWeight: '600', color: '#666' },
  radioTextActive: { color: 'white' },
  saveButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 30 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: '#ff3b30', fontSize: 16 },
  pickerWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  itemCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  itemCardSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  itemText: {
    color: '#333',
    fontWeight: '500',
  },
  itemTextSelected: {
    color: 'white',
  },
});