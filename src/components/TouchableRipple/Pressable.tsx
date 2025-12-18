import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  PressableProps as NativePressableProps
} from 'react-native';

// Tekrar kullanılabilirliği artırmak için tip tanımını genişletiyoruz
interface DynamicPressableProps extends NativePressableProps {
  // Varsayılan metni veya içeriği belirlemek için
  title: string;

  // Normal ve basılı durumlar için özel arka plan renkleri
  normalColor?: string;
  pressedColor?: string;

  // Basılı durum için isteğe bağlı olarak ekstra stil tanımlama
  extraPressedStyle?: ViewStyle;
}

export const DynamicPressable: React.FC<DynamicPressableProps> = ({
  title,
  onPress,
  normalColor = '#007AFF', // Varsayılan Mavi
  pressedColor = '#005ACF', // Varsayılan Koyu Mavi
  extraPressedStyle = {},
  ...rest // Geri kalan tüm standart Pressable prop'ları (ör. accessibility, testID)
}) => {
  return (
    <Pressable
      // Geri kalan standart prop'ları aktar
      {...rest}

      onPress={onPress}

      // ✨ Basılma Durumuna Göre Dinamik Stil Mantığı ✨
      style={({ pressed }) => [
        styles.base, // Temel sabit stil
        { backgroundColor: pressed ? pressedColor : normalColor }, // Dinamik renk
        pressed && styles.pressedTransform, // Basıldığında dönüşüm efekti
        pressed && extraPressedStyle, // Dışarıdan gelen ekstra basılı stil
      ]}
    >
      {/* İçeriği sabit tutuyoruz, ancak dilerseniz burayı da
        {({ pressed }) => ...} şeklinde dinamikleştirebilirsiniz.
      */}
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    // Gölge ayarları (sabit stil)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedTransform: {
    // Basıldığında hafif küçülme efekti
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export { Pressable };
