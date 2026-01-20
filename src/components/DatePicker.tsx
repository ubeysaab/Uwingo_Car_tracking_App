import React, { useState } from 'react';
import { View, Platform, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LucideIconButton from '@/components/IconButton/LucideIconButton';

interface Props {
  onChange: (value: any) => void;
  value: any;
  label?: string;
}

export const DatePickerComponent = ({ value, onChange }: Props) => {


  console.log("the coming value to datePicker", value)
  const [show, setShow] = useState(false);

  const dateToDisplay = value ? new Date(value) : new Date();
  // Ensure we have a valid Date object for the picker
  // const dateValue = value instanceof Date ? value : new Date();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // 1. Log the entire event to see the 'type' (set or dismissed)
    console.log("Picker Event Type:", event.type);

    // 2. This is the value you are looking for!
    console.log("Selected Date Object:", selectedDate);

    if (Platform.OS === 'android') {
      setShow(false);
    }

    if (event.type === 'set' && selectedDate) {
      // 3. Log what you are sending back to React Hook Form
      console.log("Sending to Form State:", selectedDate);
      onChange(
        selectedDate.toISOString()
      );
    } else {
      console.log("Selection cancelled or invalid");
    }
  };


  return (
    <View style={styles.outerContainer}>
      <View style={styles.inputWrapper}>
        {/* The "Input" Area */}
        <TouchableOpacity
          style={styles.dateDisplay}
          onPress={() => setShow(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.dateText}>
            {/* Value varsa tarihi göster, yoksa placeholder */}
            {value ? value.split('T')[0] : "YYYY-MM-DD"}
          </Text>
        </TouchableOpacity>

        {/* The Icon Button */}
        <View style={styles.iconContainer}>
          <LucideIconButton
            icon='Calendar'
            size={20}
            onPress={() => setShow(true)}
            containerColor="transparent"
            iconColor="#666"
          />
        </View>
      </View>

      {show && (
        <DateTimePicker
          value={dateToDisplay}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 50, // Match your TextInput height
  },
  dateDisplay: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
    height: '100%',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  iconContainer: {
    paddingRight: 5,
  }
});