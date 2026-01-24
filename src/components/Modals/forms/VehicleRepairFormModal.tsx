import { DatePickerComponent } from "@/components/DatePicker";
import DropdownComponent from "@/components/DropDown";
import LucideIconButton from "@/components/IconButton/LucideIconButton";
import InputErrorMessage from "@/components/InputErrorMessage";
import { vehicleRepairApplicationSchema, VehicleRepairApplicationT } from "@/types/comingData/vehicleRepair";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";



// TODO : END DATE SHOULDN'T BE SMALLER THAN THE START DATE THERE IS A WRONG WITH ZOD SCHEME 

interface vehicleRepairFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<VehicleRepairApplicationT>, method: "put" | 'post') => void;
  initialData?: VehicleRepairApplicationT | null;
  vehiclesData: { label: string, value: number }[] | undefined

}

const vehicleRepairFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  vehiclesData = []

}: vehicleRepairFormModalProps) => {


  const [method, setMethod] = useState<"put" | "post">('post')
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    // Using .partial() or .pick() here so it doesn't complain about missing fields
    resolver: zodResolver(vehicleRepairApplicationSchema.pick({
      // vehicleRepairId: ZodNumber;
      vehicleId: true,
      repairDate: true,
      faultType: true,
      faultDescription: true,
      repairAction: true,
      performedBy: true,
      repairCost: true,
      notes: true,


    })),
    defaultValues: {
      vehicleId: undefined,
      repairDate: new Date().toISOString().split('.')[0],
      faultType: "",
      faultDescription: "",
      repairAction: "",
      performedBy: "",
      repairCost: 0,
      notes: "",

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
          repairDate: new Date().toISOString().split('.')[0],
          faultType: "",
          faultDescription: "",
          repairAction: "",
          performedBy: "",
          repairCost: 0,
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
            <Text style={styles.title}>{initialData ? 'Edit Repair Information' : 'Add Repair Information'}</Text>
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

            <Text style={styles.label}> Fault Type</Text>
            <Controller
              control={control}
              name="faultType"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    style={[styles.input, errors.faultType && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="faultType"
                  />

                  {
                    errors?.faultType && (
                      <InputErrorMessage errorMessage={errors?.faultType?.message} />
                    )
                  }

                </>

              )} />


            <Text style={styles.label}> Fault Description</Text>
            <Controller
              control={control}
              name="faultDescription"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    style={[styles.input, errors.faultDescription && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="faultDescription"
                  />

                  {
                    errors?.faultDescription && (
                      <InputErrorMessage errorMessage={errors?.faultDescription?.message} />
                    )
                  }

                </>

              )} />

            <Text style={styles.label}> Repair Action</Text>
            <Controller
              control={control}
              name="repairAction"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    style={[styles.input, errors.repairAction && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="repairAction"
                  />

                  {
                    errors?.repairAction && (
                      <InputErrorMessage errorMessage={errors?.repairAction?.message} />
                    )
                  }

                </>

              )} />


            <Text style={styles.label}> Performed By</Text>
            <Controller
              control={control}
              name="performedBy"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    style={[styles.input, errors.performedBy && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="performedBy"
                  />

                  {
                    errors?.performedBy && (
                      <InputErrorMessage errorMessage={errors?.performedBy?.message} />
                    )
                  }

                </>

              )} />
            <Text style={styles.label}> Repair Cost</Text>
            <Controller
              control={control}
              name="repairCost"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    style={[styles.input, errors.repairCost && styles.inputError]}
                    value={String(value)}
                    onChangeText={val => onChange(Number(val))}
                    placeholder="repairCost"
                  />

                  {
                    errors?.repairCost && (
                      <InputErrorMessage errorMessage={errors?.repairCost?.message} />
                    )
                  }

                </>

              )} />



            <Text style={styles.label}> Repair Date</Text>

            <Controller
              control={control}
              name="repairDate"
              render={({ field: { onChange, value } }) => (
                <>


                  <DatePickerComponent value={value} onChange={(val) => onChange(val.split(".")[0])} />
                  {
                    errors?.repairDate && (<InputErrorMessage errorMessage={errors.repairDate?.message} />)
                  }

                </>
              )}
            />

            {/* Description */}
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

export default vehicleRepairFormModal



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