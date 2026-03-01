import Checkbox from "@/components/CheckBox";
import DropdownComponent from "@/components/DropDown";
import LucideIconButton from "@/components/IconButton/LucideIconButton";
import SaveButton from "@/components/TouchableRipple/SaveButton";
import { deviceVehicleApplicationSchema, DeviceVehicleApplicationT } from "@/types/comingData/deviceVehicle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
interface DropdownItem {
  value: number | string | undefined;
  label: string;
}

interface DeviceVehiclesModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any, method: "put" | 'post') => void;
  initialData?: DeviceVehicleApplicationT | null;
  vehicles: DropdownItem[];
  devices: DropdownItem[];
}

const DeviceVehiclesModal = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  vehicles,
  devices,
}: DeviceVehiclesModalProps) => {


  const [method, setMethod] = useState<"put" | "post">('post')
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(deviceVehicleApplicationSchema.pick({
      device_Id: true,
      vehicle_Id: true,
      isRoleToBlockage: true
    })),
    defaultValues: {
      device_Id: undefined,
      vehicle_Id: undefined
      , isRoleToBlockage: false
    },
  });


  const { t } = useTranslation()


  useEffect(() => {
    console.log('inital data', initialData)

    if (visible) {
      if (initialData) {
        setMethod('put')
        console.log('here even if its ', initialData)
        reset({
          ...initialData,
          isRoleToBlockage: initialData.isRoleToBlockage ?? false
        });
      } else {
        setMethod('post')
        reset({
          device_Id: undefined,
          vehicle_Id: undefined
          , isRoleToBlockage: false
        });
      }
    }
  }, [initialData, visible, reset]);




  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={'padding'} style={styles.modalContainer}>

          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? 'Edit Device-Vehicle' : 'Add Device-Vehicle'}</Text>

            <LucideIconButton
              icon='X'
              size={24}
              iconColor={'#333'}
              containerColor={'transparent'}
              onPress={onClose}
            />
          </View>
          <ScrollView style={styles.form}>


            <Text style={styles.label}>{t('vehicleConnectedDevicePage.selectVehicle')}</Text>
            <Controller
              control={control}
              name="vehicle_Id"
              render={({ field: { onChange, value } }) => (

                <DropdownComponent
                  data={vehicles}
                  value={value}
                  onChange={onChange}
                />
              )}
            />


            <Text style={styles.label}>{t('vehicleConnectedDevicePage.selectDevice')}</Text>
            <Controller
              control={control}
              name="device_Id"
              render={({ field: { onChange, value } }) => (
                <DropdownComponent
                  data={devices}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            <Text style={styles.label}>{t('vehicleConnectedDevicePage.blockageVehicle')}
            </Text>
            <Controller
              control={control}
              name="isRoleToBlockage"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  label=""
                  value={value}
                  onChange={onChange}
                />

              )}
            />

          </ScrollView>


          <SaveButton
            onPress={handleSubmit(
              (data) => onSubmit(data, method),
              (error) => console.log(error)
            )}
            label="vehicleConnectedDevicePage.saveVehicleToDevice"
          />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default DeviceVehiclesModal


const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 4, marginTop: 6 },
});