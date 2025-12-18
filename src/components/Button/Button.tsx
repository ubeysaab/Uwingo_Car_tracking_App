import * as React from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
  View,
  GestureResponderEvent,
  ColorValue,
  Text,
} from 'react-native';

// --- TİP TANIMLARI (Sadeleştirilmiş) ---

type SimpleButtonMode = 'text' | 'outlined' | 'contained';

interface SimpleButtonProps {
  /** Düğmenin modu: text (yassı), outlined (çerçeveli), contained (dolgu). */
  mode?: SimpleButtonMode;
  /** Düğme arka plan rengi. */
  buttonColor?: ColorValue;
  /** Metin rengi. */
  textColor?: ColorValue;
  /** Butona basıldığında çalışacak fonksiyon. */
  onPress?: (e: GestureResponderEvent) => void;
  /** Buton uzun süre basıldığında çalışacak fonksiyon. */
  onLongPress?: (e: GestureResponderEvent) => void;
  /** Düğmenin devre dışı olup olmadığı. */
  disabled?: boolean;
  /** Düğme metni. */
  children: React.ReactNode;
  /** Ana View bileşenine uygulanacak stil. */
  style?: StyleProp<ViewStyle>;
  /** Metin bileşenine uygulanacak stil. */
  labelStyle?: StyleProp<TextStyle>;
}

// --- SABİT DEĞERLER ---

const DEFAULT_COLOR = '#6200EE'; // Paper'ın varsayılan birincil rengine benzer
const DISABLED_OPACITY = 0.3;
const ROUNDNESS = 4;

// --- YARDIMCI FONKSİYONLAR ---

const getColors = ({
  mode,
  disabled,
  buttonColor,
  textColor,
}: Pick<SimpleButtonProps, 'mode' | 'disabled' | 'buttonColor' | 'textColor'>) => {
  if (disabled) {
    // Devre dışı stil
    return {
      backgroundColor: mode === 'contained' ? '#E0E0E0' : 'transparent',
      color: '#A0A0A0',
      borderColor: '#A0A0A0',
      borderWidth: mode === 'outlined' ? 1 : 0,
    };
  }

  const baseColor = buttonColor || DEFAULT_COLOR;
  const contentColor = textColor || (mode === 'contained' ? 'white' : baseColor);

  switch (mode) {
    case 'contained':
      return {
        backgroundColor: baseColor,
        color: contentColor,
        borderColor: baseColor,
        borderWidth: 0,
      };
    case 'outlined':
      return {
        backgroundColor: 'transparent',
        color: contentColor,
        borderColor: baseColor,
        borderWidth: 1,
      };
    case 'text':
    default:
      return {
        backgroundColor: 'transparent',
        color: contentColor,
        borderColor: 'transparent',
        borderWidth: 0,
      };
  }
};

// --- BİLEŞEN ---

const Button: React.FC<SimpleButtonProps> = React.forwardRef(
  (
    {
      mode = 'text',
      onPress,
      onLongPress,
      disabled = false,
      children,
      buttonColor,
      textColor,
      style,
      labelStyle,
    },
    ref: React.ForwardedRef<View>
  ) => {
    // Renkleri ve kenarlığı al
    const { backgroundColor, color, borderColor, borderWidth } = getColors({
      mode,
      disabled,
      buttonColor,
      textColor,
    });

    // Animasyon ve Yükselme (Elevation) Mantığı (Sadece 'contained' modunda)
    const isElevated = !disabled && mode === 'contained';
    const initialElevation = 2;
    const activeElevation = 8;

    // Animated.Value oluştur
    const { current: elevation } = React.useRef(
      new Animated.Value(isElevated ? initialElevation : 0)
    );

    // Düğme basıldığında yükselt
    const handlePressIn = (e: GestureResponderEvent) => {
      if (isElevated) {
        Animated.timing(elevation, {
          toValue: activeElevation,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    };

    // Düğme serbest bırakıldığında eski haline döndür
    const handlePressOut = (e: GestureResponderEvent) => {
      if (isElevated) {
        Animated.timing(elevation, {
          toValue: initialElevation,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    };

    // Basma efektini (Pressable) kullanarak dinamik stili yönetiriz
    return (
      <Animated.View
        ref={ref}
        style={[
          styles.buttonContainer,
          {
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: borderWidth,
            opacity: disabled ? DISABLED_OPACITY : 1,
            // Sadece isElevated true ise elevation'ı uygula
            elevation: isElevated ? elevation : 0,
            shadowOpacity: isElevated ? elevation.interpolate({
              inputRange: [0, 8],
              outputRange: [0.20, 0.40],
            }) : 0,
            shadowRadius: isElevated ? elevation.interpolate({
              inputRange: [0, 8],
              outputRange: [1.41, 4.65],
            }) : 0,
            shadowOffset: {
              width: 0, height: isElevated ? elevation.interpolate({
                inputRange: [0, 8],
                outputRange: [1, 4],
              }) : 0
            },
          },
          style,
        ]}
      >
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          style={styles.pressableContent}
          accessibilityRole="button"
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.label,
                { color: color, opacity: pressed && !disabled && mode !== 'contained' ? 0.7 : 1 },
                labelStyle,
              ]}
            >
              {children}
            </Text>
          )}
        </Pressable>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  buttonContainer: {
    minWidth: 64,
    height: 40,
    borderRadius: ROUNDNESS,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6, // Biraz boşluk bırakmak iyi olur
  },
  pressableContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
    marginHorizontal: 16,
    // Temel tipografi ayarları
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default Button