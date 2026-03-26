import { DatePickerComponent } from "@/components/DatePicker";
import DropdownComponent from "@/components/DropDown";
import LucideIconButton from "@/components/IconButton/LucideIconButton";
import InputErrorMessage from "@/components/InputErrorMessage";
import SaveButton from "@/components/TouchableRipple/SaveButton";
import { vehicleRepairApplicationSchema, VehicleRepairApplicationT } from "@/types/comingData/vehicleRepair";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { useTranslation } from "react-i18next";


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


  const { t } = useTranslation();
  const [method, setMethod] = useState<"put" | "post">('post')
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(vehicleRepairApplicationSchema),
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
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={true}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={'padding'} style={styles.modalContainer}>

          <View style={styles.header}>
            <Text style={styles.title}>
              {initialData ? t("vehicleRepairPage.editVehicleRepair") : t("vehicleRepairPage.addVehicleRepair")}



            </Text>
            <LucideIconButton
              icon='X'
              size={24}
              iconColor={'#333'}
              containerColor={'transparent'}
              onPress={onClose}
            />
          </View>
          <ScrollView style={styles.form}>

            <Text style={styles.label}>

              {
                t("vehiclesPage.vehiclePlate")
              }
            </Text>
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

            <Text style={styles.label}>
              {
                t("vehicleRepairPage.faultType")
              }
            </Text>
            <Controller
              control={control}
              name="faultType"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    placeholderTextColor="#999"
                    style={[styles.input, errors.faultType && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={t("vehicleRepairPage.faultType")}
                  />

                  {
                    errors?.faultType && (
                      <InputErrorMessage errorMessage={errors?.faultType?.message} />
                    )
                  }

                </>

              )} />


            <Text style={styles.label}>


              {t("vehicleRepairPage.faultDescription")}
            </Text>
            <Controller
              control={control}
              name="faultDescription"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    placeholderTextColor="#999"
                    style={[styles.input, errors.faultDescription && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={t("vehicleRepairPage.faultDescription")}
                  />

                  {
                    errors?.faultDescription && (
                      <InputErrorMessage errorMessage={errors?.faultDescription?.message} />
                    )
                  }

                </>

              )} />

            <Text style={styles.label}>
              {
                t('vehicleRepairPage.repairAction')
              }


            </Text>
            <Controller
              control={control}
              name="repairAction"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    placeholderTextColor="#999"
                    style={[styles.input, errors.repairAction && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={t('vehicleRepairPage.repairAction')}
                  />

                  {
                    errors?.repairAction && (
                      <InputErrorMessage errorMessage={errors?.repairAction?.message} />
                    )
                  }

                </>

              )} />


            <Text style={styles.label}>
              {
                t('vehicleMaintenancePage.performedBy')
              }

            </Text>
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
                    placeholder={t('vehicleMaintenancePage.performedBy')}
                  />

                  {
                    errors?.performedBy && (
                      <InputErrorMessage errorMessage={errors?.performedBy?.message} />
                    )
                  }

                </>

              )} />
            <Text style={styles.label}>
              {
                t('vehicleRepairPage.repairCost')
              }




            </Text>
            <Controller
              control={control}
              name="repairCost"
              render={({ field: { onChange, value } }) => (

                <>
                  <TextInput
                    placeholderTextColor="#999"
                    style={[styles.input, errors.repairCost && styles.inputError]}
                    value={String(value)}
                    onChangeText={val => onChange(Number(val))}
                    placeholder={
                      t('vehicleRepairPage.repairCost')
                    }
                    keyboardType="numeric"
                  />

                  {
                    errors?.repairCost && (
                      <InputErrorMessage errorMessage={errors?.repairCost?.message} />
                    )
                  }

                </>

              )} />



            <Text style={styles.label}>


              {t("vehicleRepairPage.repairDate")}
            </Text>

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


            <Text style={styles.label}>
              {
                t('common.notes')
              }
            </Text>
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    placeholderTextColor="#999"
                    style={[styles.input, errors.notes && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={
                      t('common.notes')
                    }
                  />

                  {
                    errors?.notes && (
                      <InputErrorMessage errorMessage={errors?.notes?.message} />
                    )
                  }

                </>

              )} />

          </ScrollView>

          <SaveButton
            label="Save Details"
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

export default vehicleRepairFormModal



const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8, padding: 12, fontSize: 16 }, inputError: { borderColor: '#FF3B30' },

});