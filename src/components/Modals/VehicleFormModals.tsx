import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { X } from 'lucide-react-native';
import { VehicleApplicationT } from '@/types/vehicles';

interface VehicleFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleApplicationT, method: "put" | 'post') => void;
  initialData?: VehicleApplicationT | null;
}

const VehicleFormModal = ({ visible, onClose, onSubmit, initialData }: VehicleFormModalProps) => {


  const [method, setMethod] = useState<"put" | "post">('post')
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleApplicationT>({
    defaultValues: {
      make: '',
      model: '',
      year: 2026,
      vin: '',
      firstKilometer: 0,
      plate: '',
      isItForRent: false,
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
          make: '',
          model: '',
          year: 2026,
          vin: '',
          firstKilometer: 0,
          plate: '',
          isItForRent: false,
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
            <Text style={styles.title}>{initialData ? 'Edit Vehicle' : 'Add Vehicle'}</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#333" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Plate Number */}
            <Text style={styles.label}>Plate Number</Text>
            <Controller
              control={control}
              name="plate"
              rules={{ required: 'Plate is required' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.plate && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="34 ABC 123"
                />
              )}
            />

            <View style={styles.row}>
              {/* Make */}
              <View style={styles.flex1}>
                <Text style={styles.label}>Make</Text>
                <Controller
                  control={control}
                  name="make"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="Toyota" />
                  )}
                />
              </View>
              <View style={{ width: 15 }} />
              {/* Model */}
              <View style={styles.flex1}>
                <Text style={styles.label}>Model</Text>
                <Controller
                  control={control}
                  name="model"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput style={styles.input} value={value}
                      onChangeText={onChange}
                      placeholder="Corolla" />
                  )}
                />
              </View>
            </View>

            {/* VIN */}
            <Text style={styles.label}> Chassis No</Text>
            <Controller
              control={control}
              name="vin"
              render={({ field: { onChange, value } }) => (
                <TextInput style={styles.input} value={value} onChangeText={onChange} />
              )}
            />

            <View style={styles.row}>
              {/* Year */}
              <View style={styles.flex1}>
                <Text style={styles.label}>Year</Text>
                <Controller
                  control={control}
                  name="year"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={String(value)}
                      onChangeText={(val) => onChange(Number(val))}
                    />
                  )}
                />
              </View>
              <View style={{ width: 15 }} />
              {/* Kilometers */}
              <View style={styles.flex1}>
                <Text style={styles.label}>Initial KM</Text>
                <Controller
                  control={control}
                  name="firstKilometer"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={String(value)}
                      onChangeText={(val) => onChange(Number(val))}
                    />
                  )}
                />
              </View>
            </View>

            {/* Boolean Switch (Is For Rent) */}
            <Text style={styles.label}>Is it for Rent?</Text>
            <Controller
              control={control}
              name="isItForRent"
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerContainer}>
                  <TouchableOpacity
                    style={[styles.radioBtn, value === true && styles.radioBtnActive]}
                    onPress={() => onChange(true)}
                  >
                    <Text style={[styles.radioText, value === true && styles.radioTextActive]}>YES</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.radioBtn, value === false && styles.radioBtnActive]}
                    onPress={() => onChange(false)}
                  >
                    <Text style={[styles.radioText, value === false && styles.radioTextActive]}>NO</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </ScrollView>

          <TouchableOpacity style={styles.saveButton}
            onPress={handleSubmit(data => onSubmit(data, method))}>

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
});