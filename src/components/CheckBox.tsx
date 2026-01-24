import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

const Checkbox = ({ label, value, onChange }: { label: string, value: boolean, onChange: (newval: boolean) => void }) => {
  return (
    <Pressable
      style={styles.container}
      onPress={() => onChange(!value)}
    >
      <View style={[styles.box, value && styles.checkedBox]}>
        {value && <Check size={18} color="white" />}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  box: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkedBox: {
    backgroundColor: '#007AFF',
  },
  label: {
    fontSize: 16,
  },
});

export default Checkbox;