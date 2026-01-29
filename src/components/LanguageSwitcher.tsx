import DropdownComponent from '@/components/DropDown';
import { useLanguageStore } from '@/store/local/languageStore';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

export const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();


  const languages = useMemo(() => {


    return ([
      { label: 'English', value: "en", },
      { label: 'Turkish', value: "tr", },
      { label: 'Kurdish', value: "kr", },


    ])
  }, [])



  return (
    <View style={styles.button} >

      <DropdownComponent

        data={languages}
        onChange={setLanguage}
        value={language}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    // color: '#fff',
    width: 100, // Increased slightly for longer labels
    // backgroundColor: '#6366f1',
    borderRadius: 8,

    // Position logic
    position: 'absolute',
    top: 0,    // Space from the top of the screen (adjust for notch/status bar)
    right: 0,  // Space from the right edge

    // Depth logic
    zIndex: 9999,      // Ensures it stays on top of other components
    elevation: 10,     // Required for Android "on top" behavior
  },
  text: { color: 'white', fontWeight: 'bold' }
});