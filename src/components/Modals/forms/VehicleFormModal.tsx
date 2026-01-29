import LucideIconButton from '@/components/IconButton/LucideIconButton';
import InputErrorMessage from '@/components/InputErrorMessage';
import RadioButton from '@/components/RadioButton';
import SaveButton from '@/components/TouchableRipple/SaveButton';
import { VehicleApplicationSchema, VehicleApplicationT } from '@/types/comingData/vehicles';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

interface VehicleFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<VehicleApplicationT>, method: "put" | 'post') => void;
  initialData?: VehicleApplicationT | null;
}


const VehicleFormModal = ({ visible, onClose, onSubmit, initialData }: VehicleFormModalProps) => {
  const { t } = useTranslation()


  const [method, setMethod] = useState<"put" | "post">('post')
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(VehicleApplicationSchema.pick({
      make: true,
      model: true,
      year: true,
      vin: true,
      firstKilometer: true,
      plate: true,
      isItForRent: true
    })),

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
          behavior={'padding'}
          style={styles.modalContainer}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? t('vehiclesPage.editVehicle') : t('vehiclesPage.addVehicle')}</Text>
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
            <Text style={styles.label}>{t('vehiclesPage.vehiclePlate')}</Text>
            <Controller
              control={control}
              name="plate"

              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={[styles.input, errors.plate && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="34 ABC 123"
                  />

                  {
                    errors.plate && (
                      <InputErrorMessage errorMessage={errors?.plate?.message} />
                    )
                  }
                </>
              )}
            />

            <View style={styles.row}>
              {/* Make */}
              <View style={styles.flex1}>
                <Text style={styles.label}>{t('vehiclesPage.brand')}</Text>
                <Controller
                  control={control}
                  name="make"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <>

                      <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="Toyota" />
                      {
                        errors.make && (
                          <InputErrorMessage errorMessage={errors?.make?.message} />
                        )
                      }
                    </>

                  )}
                />
              </View>
              <View style={{ width: 15 }} />
              {/* Model */}
              <View style={styles.flex1}>
                <Text style={styles.label}>{t('vehiclesPage.model')}</Text>
                <Controller
                  control={control}
                  name="model"

                  render={({ field: { onChange, value } }) => (

                    <>
                      <TextInput style={styles.input} value={value}
                        onChangeText={onChange}
                        placeholder="Corolla" />

                      {
                        errors.model && (
                          <InputErrorMessage errorMessage={errors?.model?.message} />
                        )
                      }
                    </>

                  )}
                />
              </View>
            </View>

            {/* VIN */}
            <Text style={styles.label}> {t('vehiclesPage.chassisNo')}</Text>
            <Controller
              control={control}
              name="vin"
              render={({ field: { onChange, value } }) => (

                <>
                  <TextInput style={styles.input} value={value} onChangeText={onChange} />
                  {
                    errors.vin && (
                      <InputErrorMessage errorMessage={errors?.vin?.message} />
                    )
                  }
                </>
              )}
            />

            <View style={styles.row}>
              {/* Year */}
              <View style={styles.flex1}>
                <Text style={styles.label}>{t('vehiclesPage.modelYear')}</Text>
                <Controller
                  control={control}
                  name="year"
                  render={({ field: { onChange, value } }) => (

                    <>
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(value)}
                        onChangeText={(val) => onChange(Number(val))}
                      />
                      {
                        errors.year && (
                          <InputErrorMessage errorMessage={errors?.year?.message} />
                        )
                      }
                    </>

                  )}
                />
              </View>
              <View style={{ width: 15 }} />
              {/* Kilometers */}
              <View style={styles.flex1}>
                <Text style={styles.label}>{t("vehiclesPage.initialKM")}</Text>
                <Controller
                  control={control}
                  name="firstKilometer"
                  render={({ field: { onChange, value } }) => (

                    <>
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(value)}
                        onChangeText={(val) => onChange(Number(val))}
                      />

                      {
                        errors.firstKilometer && (
                          <InputErrorMessage errorMessage={errors?.firstKilometer?.message} />
                        )
                      }
                    </>
                  )}
                />
              </View>
            </View>

            {/* Boolean Switch (Is For Rent) */}
            <Text style={styles.label}>{t("vehiclesPage.forRent")}</Text>
            <Controller
              control={control}
              name="isItForRent"
              render={({ field: { onChange, value } }) => (

                <RadioButton
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </ScrollView>

          <SaveButton
            label={"vehiclesPage.saveVehicle"}
            onPress={handleSubmit(
              (data) => onSubmit(data, method)
            )}
          />

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
});