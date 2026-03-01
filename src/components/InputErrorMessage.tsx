import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function InputErrorMessage({
  errorMessage = "An Error Occurd please try again"
}: { errorMessage: string | undefined }) {
  return (
    <View>
      <Text style={styles.errorText}>{errorMessage}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  errorText: { color: '#ff3b30', fontSize: 16, marginBottom: 4 }

})