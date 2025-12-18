
import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  ColorValue,
} from 'react-native';

// Lucide ikonlarını içeri aktarın
// Bu kütüphaneyi kurduğunuzdan emin olun: npm install lucide-react-native
import { LucideIcon, icons } from 'lucide-react-native';

// --- TİP TANIMLARI ---

// Lucide'ın tüm ikon adlarının string tipinde güvenli bir şekilde kullanımı
export type LucideIconName = keyof typeof icons;

interface IconButtonProps {
  /** Görüntülenecek Lucide ikonunun adı (örn: "Camera", "Heart"). */
  icon: LucideIconName;
  text?: string | number,
  /** İkonun rengi. */
  iconColor?: ColorValue;
  /** Arka plan rengi (düğme kabı rengi). */
  containerColor?: ColorValue;
  /** İkonun boyutu (piksel). */
  size?: number;
  /** Düğmeye tıklandığında çalışacak fonksiyon. */
  onPress?: (e: GestureResponderEvent) => void;
  /** Düğmenin devre dışı olup olmadığı. */
  disabled?: boolean;
  /** Yüklenme göstergesinin görünüp görünmeyeceği. */
  loading?: boolean;
  /** Dış View bileşeni için stil. */
  style?: StyleProp<ViewStyle>;
  /** Düğmenin accessibility etiketi. */
  accessibilityLabel?: string;
}

// --- BİLEŞEN ---

export const LucideIconButton = React.forwardRef<View, IconButtonProps>(
  (
    {
      icon,
      iconColor = '#007AFF', // Varsayılan siyah
      containerColor = 'transparent', // Varsayılan şeffaf
      size = 24,
      onPress,
      disabled = false,
      loading = false,
      style,
      accessibilityLabel,
      text = ''
    },
    ref
  ) => {
    // Lucide ikonunun kendisini bul
    const LucideIconComponent = icons[icon] as LucideIcon;

    // Düğme boyutu, ikon boyutuna göre padding eklenerek hesaplanır
    const buttonSize = size + 16; // 8 sol + 8 sağ padding

    return (
      <View
        ref={ref}
        style={[
          styles.container,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            backgroundColor: containerColor,
          },
          disabled && styles.disabled, // Devre dışı stili
          style, // Dışarıdan gelen stil
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
      >
        <Pressable
          onPress={onPress}
          disabled={disabled || loading}
          // Basıldığında şeffaflığı azaltarak basit bir 'ripple' benzeri etki yaratabiliriz.
          style={({ pressed }) => [
            styles.pressable,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          {loading && (
            // Yüklenme Durumu
            <ActivityIndicator size={size} color={iconColor} />
          )}
          {text ? (
            <Text>
              <LucideIconComponent
                color={iconColor as string}
                size={size}
              />
            </Text>
          ) : (
            // İkon Durumu
            <LucideIconComponent
              color={iconColor as string}
              size={size}
            // İhtiyaç duyarsanız, ikonun kendi stilini de buraya ekleyebilirsiniz
            />
          )}



        </Pressable>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    margin: 6,
    // Gölge (isteğe bağlı)
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  pressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});

export default LucideIconButton;