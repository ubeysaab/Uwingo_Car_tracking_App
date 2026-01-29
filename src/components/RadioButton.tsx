import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next';
export default function RadioButton({ value, onChange }: { value: boolean, onChange: (val: boolean) => void }) {
  const { t } = useTranslation()
  return (

    <View style={styles.pickerContainer}>
      <TouchableOpacity
        style={[styles.radioBtn, value === true && styles.radioBtnActive]}
        onPress={() => onChange(true)}
      >
        <Text style={[styles.radioText, value === true && styles.radioTextActive]}>{t("common.yes")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.radioBtn, value === false && styles.radioBtnActive]}
        onPress={() => onChange(false)}
      >
        <Text style={[styles.radioText, value === false && styles.radioTextActive]}>{t("common.no")}</Text>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  pickerContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  radioBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center' },
  radioBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  radioText: { fontWeight: '600', color: '#666' },
  radioTextActive: { color: 'white' },

});