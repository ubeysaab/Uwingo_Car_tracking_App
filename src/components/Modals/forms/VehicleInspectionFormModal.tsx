import { DatePickerComponent } from "@/components/DatePicker";
import DropdownComponent from "@/components/DropDown";
import LucideIconButton from "@/components/IconButton/LucideIconButton";
import InputErrorMessage from "@/components/InputErrorMessage";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { VehicleInspectionApplicationT, vehicleInspectionApplicationTSchema } from "@/types/comingData/vehicleInspection";

// TODO : END DATE SHOULDN'T BE SMALLER THAN THE START DATE THERE IS A WRONG WITH ZOD SCHEME 

interface vehicleInspectionFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<VehicleInspectionApplicationT>, method: "put" | 'post') => void;
  initialData?: VehicleInspectionApplicationT | null;
  vehiclesData: { label: string, value: number }[] | undefined

}

const VehicleInspectionFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  vehiclesData = []

}: vehicleInspectionFormModalProps) => {


  const [method, setMethod] = useState<"put" | "post">('post')
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    // Using .partial() or .pick() here so it doesn't complain about missing fields
    resolver: zodResolver(vehicleInspectionApplicationTSchema.pick({
      vehicleId: true,
      inspectionDate: true,
      expiryDate: true,
      notes: true

    })),
    defaultValues: {
      vehicleId: undefined,
      inspectionDate: new Date().toISOString().split('.')[0],
      expiryDate: new Date().toISOString().split('.')[0],
      notes: ""

    },
  });



  useEffect(() => {
    console.log('inital data', initialData)

    if (visible) {
      if (initialData && Object.keys(initialData).length > 0) {
        setMethod('put')
        console.log('here even if its ', initialData)
        reset(initialData)
      } else {
        setMethod('post')
        reset({
          vehicleId: undefined,
          inspectionDate: new Date().toISOString().split('.')[0],
          expiryDate: new Date().toISOString().split('.')[0],
          notes: "",
        });
      }
    }
  }, [initialData, visible, reset]);




  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>

          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? 'Edit Vehicle Inspection' : 'Add Vehicle Inspection'}</Text>
            <LucideIconButton
              icon='X'
              size={24}
              iconColor={'#333'}
              containerColor={'transparent'}
              onPress={onClose}
            />
          </View>
          <ScrollView style={styles.form}>
            {/* vehicle plate */}
            <Text style={styles.label}>Vehicle Plate</Text>
            <Controller
              control={control}
              name="vehicleId"
              render={({ field: { onChange, value } }) => (

                <>


                  <DropdownComponent
                    value={value}
                    onChange={onChange}
                    data={vehiclesData}
                  />

                  {
                    errors?.vehicleId && (
                      <InputErrorMessage errorMessage={errors?.vehicleId?.message} />
                    )
                  }

                </>

              )} />



            <Text style={styles.label}> Inspection Date</Text>
            <Controller
              control={control}
              name="inspectionDate"
              render={({ field: { onChange, value } }) => (
                <>
                  <DatePickerComponent value={value} onChange={(val) => onChange(val.split(".")[0])} />
                  {
                    errors?.inspectionDate && (<InputErrorMessage errorMessage={errors.inspectionDate?.message} />)
                  }
                </>

              )}
            />

            <Text style={styles.label}> End Date</Text>
            <Controller
              control={control}
              name="expiryDate"
              render={({ field: { onChange, value } }) => (
                <>


                  <DatePickerComponent value={value} onChange={(val) => onChange(val.split(".")[0])} />


                </>
              )}
            />

            <Text style={styles.label}> Notes</Text>
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    style={[styles.input, errors.notes && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="notes"
                  />

                  {
                    errors?.notes && (
                      <InputErrorMessage errorMessage={errors?.notes?.message} />
                    )
                  }

                </>

              )} />








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

export default VehicleInspectionFormModal



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
});