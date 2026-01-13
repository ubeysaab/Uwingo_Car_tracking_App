
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

import { LucideIcon, icons } from 'lucide-react-native';

// --- TİP TANIMLARI ---

export type LucideIconNames = keyof typeof icons;

interface IconButtonProps {
  /** Görüntülenecek Lucide ikonunun adı (örn: "Camera", "Heart"). */
  icon: LucideIconNames;
  text?: string | number,
  textColor?: string,
  /** İkonun rengi. */
  iconColor?: ColorValue;
  /** Arka plan rengi (düğme kabı rengi). */
  containerColor?: ColorValue;
  /** İkonun boyutu (piksel). */
  size?: number;
  borderRadius?: number;
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

const LucideIconButton = React.forwardRef<View, IconButtonProps>(
  (
    {
      icon,
      iconColor = '#FFF',
      textColor = '#FFF',
      containerColor = '#007AFF',
      size = 16,
      onPress,
      disabled = false,
      loading = false,
      style,
      borderRadius = 5,
      accessibilityLabel,
      text = ''
    },
    ref
  ) => {
    const LucideIconComponent = icons[icon] as LucideIcon;

    return (
      <View
        ref={ref}
        style={[
          styles.container,
          {
            borderRadius: borderRadius,
            backgroundColor: containerColor,
            // If there is no text, we keep it square, otherwise auto-width
            padding: 8,
          },
          disabled && styles.disabled,
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
      >
        <Pressable
          onPress={onPress}
          disabled={disabled || loading}
          style={({ pressed }) => [
            styles.pressable,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          {loading ? (
            <ActivityIndicator size={size} color={iconColor} />
          ) : (
            <View style={styles.contentRow}>
              {/* If text exists, render text and icon side by side */}
              {text ? (
                <>
                  <Text style={[styles.text, { color: textColor }]}>
                    {text}
                  </Text>
                  <View style={{ width: 6 }} />
                </>
              ) : null}

              <LucideIconComponent
                color={iconColor as string}
                size={size}
              />
            </View>
          )}
        </Pressable>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignSelf: 'flex-start',

  },
  pressable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    fontSize: 14,
  },
  disabled: {
    opacity: 0.4,
  },
});


export default LucideIconButton