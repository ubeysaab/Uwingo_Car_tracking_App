import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@/constants';
interface Props {
  data: { label: string; value: any }[];
  onChange: (value: any) => void;
  value: any;
  label?: string;
}

const DropdownComponent = ({ data, onChange, value, label = "" }: Props) => {
  const [isFocus, setIsFocus] = useState(false);
  console.log("DROPDOWN CURRENT VALUE:", value);

  const { t } = useTranslation()
  const dropdownKey = value ? `dropdown-${value}` : 'dropdown-empty';
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}


      {!data || data.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>{t("common.noSelectableItems")}</Text>
        </View>
      ) : (
        <Dropdown
          key={dropdownKey}
          style={[styles.dropdown, isFocus && { borderColor: COLORS.primary }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? t('common.selectItem') : '...'}
          searchPlaceholder={t('common.search')}
          value={value === undefined ? null : value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            onChange(item.value);
            setIsFocus(false);
          }}
        />
      )}
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: { padding: 5 },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  label: { marginBottom: 8, fontSize: 14, fontWeight: 'bold' },
  placeholderStyle: { fontSize: 16, color: '#999' },
  selectedTextStyle: { fontSize: 16 },
  inputSearchStyle: { height: 40, fontSize: 16 },
  noDataContainer: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  noDataText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center'
  },
});