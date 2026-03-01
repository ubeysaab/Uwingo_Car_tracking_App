import { DatePickerComponent } from "@/components/DatePicker";
import DropdownComponent from "@/components/DropDown";
import LucideIconButton from "@/components/IconButton/LucideIconButton";
import InputErrorMessage from "@/components/InputErrorMessage";

import { vehicleSpeedLimitApplicationSchema, vehicleSpeedLimitApplicationSchemaT } from "@/types/comingData/vehicleSpeedLimit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import SaveButton from "@/components/TouchableRipple/SaveButton";
import { useTranslation } from "react-i18next";

// TODO : END DATE SHOULDN'T BE SMALLER THAN THE START DATE THERE IS A WRONG WITH ZOD SCHEME 

interface vehicleSpeedLimitFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: vehicleSpeedLimitApplicationSchemaT, method: "put" | 'post') => void;
  initialData?: vehicleSpeedLimitApplicationSchemaT | null;
  vehiclesData: { label: string, value: number }[] | undefined

}

const VehicleSpeedLimitFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  vehiclesData = []

}: vehicleSpeedLimitFormModalProps) => {

  const { t } = useTranslation();


  const [method, setMethod] = useState<"put" | "post">('post')
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    // Using .partial() or .pick() here so it doesn't complain about missing fields
    resolver: zodResolver(vehicleSpeedLimitApplicationSchema),
    defaultValues: {
      vehicleId: undefined,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      description: "",
      speedLimit: 0,

    },
  });



  useEffect(() => {
    console.log('inital data', initialData)

    if (visible) {
      if (initialData && Object.keys(initialData).length > 0) {
        setMethod('put')
        console.log('here even if its ', initialData)
        reset({
          ...initialData,
          startDate: initialData.startDate,
          endDate: initialData.endDate
        })
      } else {
        setMethod('post')
        reset({
          vehicleId: undefined,
          startDate: new Date().toISOString().split('.')[0],
          endDate: new Date().toISOString().split('.')[0],
          description: "",
          speedLimit: 0,
        });
      }
    }
  }, [initialData, visible, reset]);




  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={true}>
      <View style={styles.overlay}>
        {visible && <KeyboardAvoidingView
          key={visible ? 'open' : "closed"}

          behavior={'padding'} style={styles.modalContainer}>

          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? t('vehicleSpeedLimitPage.editVehicleSpeedLimit') :

              t('vehicleSpeedLimitPage.addVehicleSpeedLimit')
            }</Text>
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
            <Text style={styles.label}>{t("vehiclesPage.vehiclePlate")}</Text>
            <Controller
              control={control}
              name="vehicleId"
              render={({ field: { onChange, value } }) => (

                <>


                  <DropdownComponent
                    value={value ?? null}
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

            <Text style={styles.label}>
              {t('vehicleSpeedLimitPage.startDate')}
            </Text>
            <Controller
              control={control}
              name="startDate"
              render={({ field: { onChange, value } }) => (
                <DatePickerComponent value={value} onChange={(val) => onChange(val.split(".")[0])} />
              )}
            />

            <Text style={styles.label}>

              {t('vehicleSpeedLimitPage.endDate')}
            </Text>
            <Controller
              control={control}
              name="endDate"
              render={({ field: { onChange, value } }) => (
                <>


                  <DatePickerComponent value={value} onChange={(val) => onChange(val.split(".")[0])} />
                  {
                    errors?.endDate && (<InputErrorMessage errorMessage={errors.endDate?.message} />)
                  }

                </>
              )}
            />




            <Text style={styles.label}>
              {t('vehicleSpeedLimitPage.speedLimit')}
            </Text>
            <Controller
              control={control}
              name="speedLimit"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    placeholderTextColor="#999"
                    style={[styles.input, errors.speedLimit && styles.inputError]}
                    value={String(value)}
                    onChangeText={val => onChange(Number(val))}
                    placeholder="speedLimit"
                  />

                  {
                    errors?.speedLimit && (
                      <InputErrorMessage errorMessage={errors?.speedLimit?.message} />
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
          />
        </KeyboardAvoidingView>}
      </View>
    </Modal>
  );
};

export default VehicleSpeedLimitFormModal



const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8, padding: 12, fontSize: 16 }, inputError: { borderColor: '#FF3B30' },

});