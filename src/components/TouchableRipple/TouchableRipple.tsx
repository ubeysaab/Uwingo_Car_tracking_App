import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  ColorValue,
  GestureResponderEvent,
} from 'react-native';

export type TouchableRippleProps = {
  children: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  rippleColor?: ColorValue;
  underlayColor?: ColorValue;
  style?: StyleProp<ViewStyle>;
  borderless?: boolean;
  testID?: string;
};

const TouchableRipple = ({
  children,
  onPress,
  disabled,
  rippleColor = 'rgba(0, 0, 0, .1)',
  underlayColor = 'rgba(0, 0, 0, .05)',
  style,
  borderless = false,
  testID,
  ...rest
}: TouchableRippleProps) => {
  return (
    <Pressable
      {...rest}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      android_ripple={{
        color: rippleColor,
        borderless: borderless,
      }}
      style={({ pressed }) => [
        style,
        borderless && styles.overflowHidden,
        Platform.OS === 'ios' && pressed && { backgroundColor: underlayColor },
      ]}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overflowHidden: {
    overflow: 'hidden',
  },
});

export default TouchableRipple;