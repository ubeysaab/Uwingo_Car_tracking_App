import DropdownComponent from "@/components/DropDown";
import LucideIconButton from "@/components/IconButton/LucideIconButton";
import InputErrorMessage from "@/components/InputErrorMessage";
import SaveButton from "@/components/TouchableRipple/SaveButton";
import { DeviceApplicationSchema, DeviceApplicationT } from "@/types/comingData/devices";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { useTranslation } from "react-i18next";

// TODO : END DATE SHOULDN'T BE SMALLER THAN THE START DATE THERE IS A WRONG WITH ZOD SCHEME 

interface DevicesFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<DeviceApplicationT>, method: "put" | 'post') => void;
  initialData?: DeviceApplicationT | null;
  packetsData: { label: string, value: string }[] | undefined

}

const DevicesFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  packetsData = []

}: DevicesFormModalProps) => {

  const { t } = useTranslation()
  const [method, setMethod] = useState<"put" | "post">('post')
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(DeviceApplicationSchema.pick({
      serialNumber: true,
      model: true,
      packetType: true,
      devicePhoneNumber: true,

    })),
    defaultValues: {
      serialNumber: "",
      model: "",
      packetType: "",
      devicePhoneNumber: "",

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
          serialNumber: "",
          model: "",
          packetType: "",
          devicePhoneNumber: "",
        });
      }
    }
  }, [initialData, visible, reset]);




  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={'padding'} style={styles.modalContainer}>

          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? t('devicesPage.editDevice') : t("devicesPage.addDevice")}</Text>
            <LucideIconButton
              icon='X'
              size={24}
              iconColor={'#333'}
              containerColor={'transparent'}
              onPress={onClose}
            />
          </View>
          <ScrollView style={styles.form}>

            <Text style={styles.label}>{t('devicesPage.devicePacketType')}</Text>
            <Controller
              control={control}
              name="packetType"
              render={({ field: { onChange, value } }) => (

                <>


                  <DropdownComponent
                    value={value}
                    onChange={onChange}
                    data={packetsData}
                  />

                  {
                    errors?.packetType && (
                      <InputErrorMessage errorMessage={errors?.packetType?.message} />
                    )
                  }

                </>

              )} />

            <Text style={styles.label}> {t('devicesPage.deviceModel')}</Text>
            <Controller
              control={control}
              name="model"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    style={[styles.input, errors.model && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={t('devicesPage.deviceModel')}
                    placeholderTextColor="#999"
                  />

                  {
                    errors?.model && (
                      <InputErrorMessage errorMessage={errors?.model?.message} />
                    )
                  }

                </>

              )} />






            <Text style={styles.label}> {t('devicesPage.deviceSerialNumber')}</Text>
            <Controller
              control={control}
              name="serialNumber"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    style={[styles.input, errors.serialNumber && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={t('devicesPage.deviceSerialNumber')}
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />

                  {
                    errors?.serialNumber && (
                      <InputErrorMessage errorMessage={errors?.serialNumber?.message} />
                    )
                  }

                </>

              )} />



            <Text style={styles.label}> {t('devicesPage.devicePhoneNumber')}</Text>
            <Controller
              control={control}
              name="devicePhoneNumber"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    style={[styles.input, errors.devicePhoneNumber && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={t('devicesPage.devicePhoneNumber')}
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />

                  {
                    errors?.devicePhoneNumber && (
                      <InputErrorMessage errorMessage={errors?.devicePhoneNumber?.message} />
                    )
                  }

                </>

              )} />
          </ScrollView>

          <SaveButton
            label="devicesPage.saveDevice"
            onPress={handleSubmit(
              (data) => onSubmit(data, method),
              (error) => console.log(error)
            )}
          />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default DevicesFormModal


const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8, padding: 12, fontSize: 16 }, inputError: { borderColor: '#FF3B30' },

});