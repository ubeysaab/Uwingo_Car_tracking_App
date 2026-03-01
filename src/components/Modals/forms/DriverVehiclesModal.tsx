import DropdownComponent from "@/components/DropDown";
import LucideIconButton from "@/components/IconButton/LucideIconButton";
import SaveButton from "@/components/TouchableRipple/SaveButton";
import { DriverVehiclesApplicationT, DriverVehiclesSchema } from "@/types/comingData/driverVehicles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";


interface DropdownItem {
  value: number | undefined;
  label: string; // "Plate" for vehicles, "Name" for drivers
}

interface DriverVehiclesModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any, method: "put" | 'post') => void;
  initialData?: DriverVehiclesApplicationT | null;
  vehicles: DropdownItem[];
  drivers: DropdownItem[];
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
    resolver: zodResolver(DriverVehiclesSchema.pick({
      drivers_Id: true,
      vehicle_Id: true
    })),
    defaultValues: {
      drivers_Id: undefined,
      vehicle_Id: undefined
    },
  });


  const { t } = useTranslation();




  useEffect(() => {
    if (visible) {
      if (initialData) {
        setMethod('put')
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
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={'padding'} style={styles.modalContainer}>

          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? t('vehicleConnectedDriverPage.editVehicleToDriver') : t('vehicleConnectedDriverPage.addVehicleToDriver')}</Text>

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
            <Text style={styles.label}>{t("vehicleConnectedDevicePage.selectVehicle")}</Text>
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
            <Text style={styles.label}>{t('vehicleConnectedDriverPage.selectDriver')}</Text>
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

          {/*todo:  handle Error Differently */}
          <SaveButton
            label="vehicleConnectedDriverPage.saveVehicleToDriver"
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

export default DriverVehiclesModal


const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 4 },
});