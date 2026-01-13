import { DriverApplicationT, DriverSchema, DriverSchemaT } from '@/types/comingData/drivers';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LucideIconButton from '../IconButton/LucideIconButton';
import { zodResolver } from '@hookform/resolvers/zod';

interface VehicleFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<DriverApplicationT>, method: "put" | 'post') => void;
  initialData?: DriverApplicationT | null;
}

const VehicleFormModal = ({ visible, onClose, onSubmit, initialData }: VehicleFormModalProps) => {


  const [method, setMethod] = useState<"put" | "post">('post')
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverSchemaT>({
    resolver: zodResolver(DriverSchema),
    mode: 'onBlur',
    defaultValues: {
      driverName: '',
      driverCode: '',
    },
  });

  // 2. Reset form when initialData changes or modal opens
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
          driverName: '',
          driverCode: '',
        });
      }
    }
  }, [initialData, visible, reset]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? 'Edit Driver' : 'Add Driver'}</Text>
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

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Plate Number */}
            <Text style={styles.label}>Driver Name</Text>
            <Controller
              control={control}
              name="driverName"
              render={({ field: { onChange, value } }) => (
                <>


                  <TextInput
                    style={[styles.input, errors.driverName && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Driver Name"
                  />
                  {errors.driverName && (
                    <Text style={styles.errorText}>{errors.driverName.message}</Text>
                  )}
                </>


              )}
            />

            <Text style={styles.label}>Driver Code</Text>
            <Controller
              control={control}
              name="driverCode"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={[styles.input, errors.driverCode && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Uw Driver"
                  />
                  {errors.driverCode && (
                    <Text style={styles.errorText}>{errors.driverCode?.message}</Text>
                  )}
                </>
              )}
            />








          </ScrollView>

          <TouchableOpacity style={styles.saveButton}
            onPress={handleSubmit(
              data => onSubmit(data, method),
              err => console.log("Validation Errors:", err) // This will tell you exactly why "Add" won't submit
            )}

          >

            <Text style={styles.saveButtonText}>Save Vehicle</Text>
          </TouchableOpacity>


        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default VehicleFormModal;

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
  errorText: { color: '#ff3b30', fontSize: 16 }
});