import { useLanguageStore } from '@/store/local/languageStore';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const [modalVisible, setModalVisible] = useState(false);

  const languages = useMemo(() => [
    { label: 'English', value: "en", },
    { label: 'Türkçe', value: "tr", },
    { label: 'Kurdî', value: "kr", },
  ], []);

  const currentLanguage = languages.find(lang => lang.value === language) || languages[0];

  return (
    <>
      <TouchableOpacity
        style={styles.minimalButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.minimalFlag}>{language.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {languages.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.modalItem,
                  item.value === language && styles.modalItemSelected
                ]}
                onPress={() => {
                  setLanguage(item.value);
                  i18n.changeLanguage(item.value);
                  setModalVisible(false);
                }}
              >
                {/* <Text style={styles.modalItemFlag}>{item.flag}</Text> */}
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  minimalButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 9999,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  minimalFlag: {
    fontSize: 16,
    // fontStyle: "italic"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    width: width * 0.4,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  modalItemSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  modalItemFlag: {
    fontSize: 20,
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
});