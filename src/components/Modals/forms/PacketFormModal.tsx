import LucideIconButton from "@/components/IconButton/LucideIconButton";
import InputErrorMessage from "@/components/InputErrorMessage";
import SaveButton from "@/components/TouchableRipple/SaveButton";
import { PacketApplicationSchema, PacketApplicationT } from "@/types/comingData/packets";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
interface DropdownItem {
  id: number;
  label: string; // "Plate" for vehicles, "Name" for drivers
}

interface PacketFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any, method: "put" | 'post') => void;
  initialData?: PacketApplicationT | null;

}

const PacketFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialData,

}: PacketFormModalProps) => {

  const { t } = useTranslation()
  const [method, setMethod] = useState<"put" | "post">('post')
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    // Using .partial() or .pick() here so it doesn't complain about missing fields
    resolver: zodResolver(PacketApplicationSchema.pick({
      packetType: true,
      description: true
    })),
    defaultValues: {
      packetType: "",
      description: ""
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
          packetType: "",
          description: ""
        });
      }
    }
  }, [initialData, visible, reset]);




  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={'padding'} style={styles.modalContainer}>

          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? t("packetsPage.editPacket") : t("packetsPage.addPacket")}</Text>
            {/* <TouchableOpacity onPress={onClose}>
              <X color="#333" size={24} />
            </TouchableOpacity> */}
            <LucideIconButton
              icon='X'
              size={24}
              iconColor={'#333'}
              containerColor={'transparent'}
              onPress={onClose}
            />
          </View>
          <ScrollView style={styles.form}>

            <Text style={styles.label}>{t('packetsPage.packetType')}</Text>
            <Controller
              control={control}
              name="packetType"
              render={({ field: { onChange, value } }) => (

                <>
                  <TextInput
                    style={[styles.input, errors.packetType && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="34 ABC 123"
                    placeholderTextColor="#999"
                  />
                  {
                    errors.packetType && (
                      <InputErrorMessage errorMessage={errors?.packetType?.message} />
                    )
                  }


                </>

              )}
            />

            <Text style={styles.label}>{t('packetsPage.packetDescription')}</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (




                <>
                  <TextInput
                    style={[styles.input, errors.description && styles.inputError]}
                    value={value}
                    placeholderTextColor="#999"
                    onChangeText={onChange}
                    placeholder="34 ABC 123"
                  />

                  {
                    errors.description && (
                      <InputErrorMessage errorMessage={errors?.description?.message} />
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
            label="packetsPage.savePacket"
          />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default PacketFormModal



const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 8, padding: 12, fontSize: 16 }, inputError: { borderColor: '#FF3B30' },

});