import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'

export default function SaveButton({ label = 'saveDetails', onPress }: { label?: string, onPress: () => void }) {


  const { t } = useTranslation()

  return (
    <TouchableOpacity
      style={styles.saveButton}
      onPress={onPress}
    >
      <Text style={styles.saveButtonText}>{t(label)}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  saveButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 30 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
})