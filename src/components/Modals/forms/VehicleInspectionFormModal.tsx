import { DatePickerComponent } from "@/components/DatePicker";
import DropdownComponent from "@/components/DropDown";
import LucideIconButton from "@/components/IconButton/LucideIconButton";
import InputErrorMessage from "@/components/InputErrorMessage";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { VehicleInspectionApplicationT, vehicleInspectionApplicationTSchema } from "@/types/comingData/vehicleInspection";


import SaveButton from "@/components/TouchableRipple/SaveButton";
import { useTranslation } from "react-i18next";

// TODO : END DATE SHOULDN'T BE SMALLER THAN THE START DATE THERE IS A WRONG WITH ZOD SCHEME 

interface vehicleInspectionFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<VehicleInspectionApplicationT>, method: "put" | 'post') => void;
  initialData?: VehicleInspectionApplicationT | null;
  vehiclesData: { label: string, value: number }[] | undefined

}

const VehicleInspectionFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  vehiclesData = []

}: vehicleInspectionFormModalProps) => {

  const { t } = useTranslation();
  const [method, setMethod] = useState<"put" | "post">('post')
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    // Using .partial() or .pick() here so it doesn't complain about missing fields
    resolver: zodResolver(vehicleInspectionApplicationTSchema),
    defaultValues: {
      vehicleId: undefined,
      inspectionDate: new Date().toISOString().split('.')[0],
      expiryDate: new Date().toISOString().split('.')[0],
      notes: ""

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
          inspectionDate: new Date().toISOString().split('.')[0],
          expiryDate: new Date().toISOString().split('.')[0],
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
            <Text style={styles.title}>{initialData ? t('vehicleInspectionPage.editVehicleInspection') : t('vehicleInspectionPage.addVehicleInspection')}</Text>
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
            <Text style={styles.label}>
              {t("vehiclesPage.vehiclePlate")}
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
              {t("vehicleInspectionPage.inspectionDate")}
            </Text>
            <Controller
              control={control}
              name="inspectionDate"
              render={({ field: { onChange, value } }) => (
                <>
                  <DatePickerComponent value={value} onChange={(val) => onChange(val.split(".")[0])} />
                  {
                    errors?.inspectionDate && (<InputErrorMessage errorMessage={errors.inspectionDate?.message} />)
                  }
                </>

              )}
            />

            <Text style={styles.label}>
              {t("vehicleInspectionPage.expiryDate")}
            </Text>
            <Controller
              control={control}
              name="expiryDate"
              render={({ field: { onChange, value } }) => (
                <>



                  <DatePickerComponent value={value} onChange={(val) => onChange(val.split(".")[0])} />
                  {
                    errors?.expiryDate && (<InputErrorMessage errorMessage={errors.expiryDate?.message} />)
                  }


                </>
              )}
            />

            <Text style={styles.label}> {t('common.notes')}</Text>
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
                    placeholder={t('common.notes')}
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
            onPress={handleSubmit(
              (data) => onSubmit(data, method),
              (error) => console.log(error)
            )}

            label='vehicleInspectionPage.saveVehicleInspection'

          />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default VehicleInspectionFormModal



const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8, padding: 12, fontSize: 16 }, inputError: { borderColor: '#FF3B30' },

});