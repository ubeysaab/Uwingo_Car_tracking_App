import DropdownComponent from "@/components/DropDown";
import LucideIconButton from "@/components/IconButton/LucideIconButton";
import InputErrorMessage from "@/components/InputErrorMessage";
import SaveButton from "@/components/TouchableRipple/SaveButton";
import { PacketContentsApplicationSchema, PacketContentsApplicationT } from "@/types/comingData/packetContents";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";




interface PacketContentsFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PacketContentsApplicationT>, method: "put" | 'post') => void;
  initialData?: PacketContentsApplicationT | null;
  packetsData: { label: string, value: number }[] | undefined

}

const PacketContentsFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  packetsData = []

}: PacketContentsFormModalProps) => {

  const { t } = useTranslation();
  const [method, setMethod] = useState<"put" | "post">('post')
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    // Using .partial() or .pick() here so it doesn't complain about missing fields
    resolver: zodResolver(PacketContentsApplicationSchema.pick({
      fieldName: true,
      description: true,
      packet_Id: true
    })),
    defaultValues: {
      fieldName: "",
      description: "",
      packet_Id: undefined
    },
  });





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
          fieldName: "",
          description: "",
          packet_Id: undefined
        });
      }
    }
  }, [initialData, visible, reset]);




  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={'padding'} style={styles.modalContainer}>

          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? t('packetContents.editPacketContent') : t('packetContents.addPacketContent')}</Text>

            <LucideIconButton
              icon='X'
              size={24}
              iconColor={'#333'}
              containerColor={'transparent'}
              onPress={onClose}
            />
          </View>
          <ScrollView style={styles.form}>

            <Text style={styles.label}>{t("packetContents.fieldName")}</Text>
            <Controller
              control={control}
              name="fieldName"
              render={({ field: { onChange, value } }) => (
                <>

                  <TextInput
                    style={[styles.input, errors.fieldName && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="field name"
                    placeholderTextColor="#999"
                  />

                  {
                    errors.fieldName && (
                      <InputErrorMessage errorMessage={errors?.fieldName?.message} />
                    )
                  }
                </>

              )}
            />

            <Text style={styles.label}> {t("packetContents.packetContentDescription")}</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (

                <>


                  <TextInput
                    style={[styles.input, errors.description && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="description"
                    placeholderTextColor="#999"
                  />

                  {
                    errors?.description && (
                      <InputErrorMessage errorMessage={errors?.description?.message} />
                    )
                  }

                </>

              )} />

            <Text style={styles.label}>{t("packetContents.packetName")}</Text>
            <Controller
              control={control}
              name="packet_Id"
              render={({ field: { onChange, value } }) => (

                <>


                  <DropdownComponent
                    value={value}
                    onChange={onChange}
                    data={packetsData}
                  />

                  {
                    errors?.packet_Id && (
                      <InputErrorMessage errorMessage={errors?.packet_Id?.message} />
                    )
                  }

                </>

              )} />



          </ScrollView>

          <SaveButton
            label='packetContents.savePacketContent'
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

export default PacketContentsFormModal



const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8, padding: 12, fontSize: 16 }, inputError: { borderColor: '#FF3B30' },

});