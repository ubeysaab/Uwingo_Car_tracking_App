import { DatePickerComponent } from "@/components/DatePicker";
import DropdownComponent from "@/components/DropDown";
import LucideIconButton from "@/components/IconButton/LucideIconButton";
import InputErrorMessage from "@/components/InputErrorMessage";
import { VehicleMaintenanceApplicationSchema, VehicleMaintenanceApplicationT } from "@/types/comingData/vehicleMaintenance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import SaveButton from "@/components/TouchableRipple/SaveButton";
import { buildPeriodInMonthData } from "@/utils/periodInMonths";
import { useTranslation } from "react-i18next";









interface VehicleMaintenanceFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<VehicleMaintenanceApplicationT>, method: "put" | 'post') => void;
  initialData?: VehicleMaintenanceApplicationT | null;
  vehiclesData: { label: string, value: number }[] | undefined

}

const VehicleMaintenanceFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  vehiclesData = []

}: VehicleMaintenanceFormModalProps) => {

  const { t } = useTranslation();

  const [method, setMethod] = useState<"put" | "post">('post')
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    // Using .partial() or .pick() here so it doesn't complain about missing fields
    resolver: zodResolver(VehicleMaintenanceApplicationSchema.pick({
      vehicle_Id: true,
      lastMaintenanceDate: true,
      periodInMonths: true,
      periodInKilometers: true,
      kilometer: true,
      performedBy: true,
      description: true,

    })),
    defaultValues: {
      vehicle_Id: undefined,
      lastMaintenanceDate: undefined,
      periodInMonths: undefined,
      periodInKilometers: 0,
      kilometer: 0,
      performedBy: undefined,
      description: undefined,
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
          vehicle_Id: undefined,
          lastMaintenanceDate: new Date().toISOString().split('.')[0],
          periodInMonths: 1,
          periodInKilometers: 0,
          kilometer: 0,
          performedBy: "",
          description: "",
        });
      }
    }
  }, [initialData, visible, reset]);


  const periodInMonthData = useMemo(
    () => buildPeriodInMonthData(t, 12),
    [t]
  );


  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={true}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={'padding'} style={styles.modalContainer}>

          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? t('vehicleMaintenancePage.editVehicleMaintenance') : t('vehicleMaintenancePage.addVehicleMaintenance')}</Text>
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
            <Text style={styles.label}></Text>{t('vehicleConnectedDevicePage.selectVehicle')}
            <Controller
              control={control}
              name="vehicle_Id"
              render={({ field: { onChange, value } }) => (

                <>


                  <DropdownComponent
                    value={value}
                    onChange={onChange}
                    data={vehiclesData}
                  />

                  {
                    errors?.vehicle_Id && (
                      <InputErrorMessage errorMessage={errors?.vehicle_Id?.message} />
                    )
                  }

                </>

              )} />

            {/* last maintenance */}
            <Text style={styles.label}> {t('vehicleMaintenancePage.lastMaintenanceDate')}</Text>
            <Controller
              control={control}
              name="lastMaintenanceDate"
              render={({ field: { onChange, value } }) => (
                <DatePickerComponent value={value} onChange={(val) => onChange(val.split(".")[0])} />
              )}
            />

            {/* Period In Month */}

            <Text style={styles.label}>{t('vehicleMaintenancePage.periodInMonths')}</Text>
            <Controller
              control={control}
              name="periodInMonths"
              render={({ field: { onChange, value } }) => (

                <>


                  <DropdownComponent
                    value={value}
                    onChange={onChange}
                    data={periodInMonthData}
                  />

                  {
                    errors?.vehicle_Id && (
                      <InputErrorMessage errorMessage={errors?.periodInMonths?.message} />
                    )
                  }

                </>

              )} />




            {/* Period In KM */}
            <Text style={styles.label}>{t('vehicleMaintenancePage.periodInKiloMeters')}</Text>
            <Controller
              control={control}
              name="periodInKilometers"
              render={({ field: { onChange, value } }) => (
                <>

                  <TextInput
                    placeholderTextColor="#999"
                    style={[styles.input, errors.periodInKilometers && styles.inputError]}
                    value={String(value)}
                    onChangeText={(val) => onChange(Number(val))}
                    placeholder="Period In Kilometers"
                    keyboardType="numeric"
                  />

                  {
                    errors.periodInKilometers && (
                      <InputErrorMessage errorMessage={errors?.periodInKilometers?.message} />
                    )
                  }
                </>

              )}
            />

            {/* KM */}
            <Text style={styles.label}> {t("common.kilometer")}</Text>
            <Controller
              control={control}
              name="kilometer"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    placeholderTextColor="#999"
                    style={[styles.input, errors.kilometer && styles.inputError]}
                    value={String(value)}
                    onChangeText={(val) => onChange(Number(val))}
                    placeholder="kilometer"
                  />

                  {
                    errors?.kilometer && (
                      <InputErrorMessage errorMessage={errors?.kilometer?.message} />
                    )
                  }

                </>

              )} />


            {/* Performed By  */}

            <Text style={styles.label}> {t("vehicleMaintenancePage.performedBy")}</Text>
            <Controller
              control={control}
              name="performedBy"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    placeholderTextColor="#999"
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

            {/* Description */}
            <Text style={styles.label}> {t('common.description')}</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    placeholderTextColor="#999"
                    style={[styles.input, errors.description && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="description"
                  />

                  {
                    errors?.description && (
                      <InputErrorMessage errorMessage={errors?.description?.message} />
                    )
                  }

                </>

              )} />





          </ScrollView>


          <SaveButton
            label="vehicleMaintenancePage.saveVehicleMaintenance"
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

export default VehicleMaintenanceFormModal



const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8, padding: 12, fontSize: 16 }, inputError: { borderColor: '#FF3B30' },

});