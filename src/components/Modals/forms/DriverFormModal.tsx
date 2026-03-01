import LucideIconButton from '@/components/IconButton/LucideIconButton';
import InputErrorMessage from '@/components/InputErrorMessage';
import SaveButton from '@/components/TouchableRipple/SaveButton';
import { DriverApplicationSchema, DriverApplicationT } from '@/types/comingData/drivers';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useTranslation } from 'react-i18next';

interface DriverFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<DriverApplicationT>, method: "put" | 'post') => void;
  initialData?: DriverApplicationT | null;
}

const DriverFormModal = ({ visible, onClose, onSubmit, initialData }: DriverFormModalProps) => {

  const { t } = useTranslation()
  const [method, setMethod] = useState<"put" | "post">('post')
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DriverApplicationSchema.pick({
      driverName: true,
      driverCode: true,
    })),
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
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={styles.modalContainer}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? t('driversPage.editDriver') : t('driversPage.addDriver')}</Text>

            <LucideIconButton
              icon='X'
              size={24}
              iconColor={'#333'}
              containerColor={'transparent'}
              onPress={onClose}
            />
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>

            <Text style={styles.label}>{t('driversPage.driverName')}</Text>
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
                    placeholderTextColor="#999"
                  />
                  {errors.driverName && (
                    <InputErrorMessage errorMessage={errors.driverName.message} />
                  )}
                </>
              )}
            />

            <Text style={styles.label}>{t('driversPage.driverCode')}</Text>
            <Controller
              control={control}
              name="driverCode"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={[styles.input, errors.driverCode && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#999"
                    placeholder="Uw Driver"
                  />
                  {errors.driverCode && (
                    <InputErrorMessage errorMessage={errors.driverCode?.message} />
                  )}
                </>
              )}
            />


          </ScrollView>


          <SaveButton
            label='driversPage.saveDriver'
            onPress={handleSubmit(
              data => onSubmit(data, method))}

          />


        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default DriverFormModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8, padding: 12, fontSize: 16 }, inputError: { borderColor: '#FF3B30' },
});