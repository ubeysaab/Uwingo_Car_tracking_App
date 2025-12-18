import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';

export type MenuItemProps = {
  title: number;
  onPress?: () => void;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  disabled?: boolean;
  dense?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

const MenuItem = ({
  title,
  onPress,
  leadingIcon,
  trailingIcon,
  disabled,
  dense,
  style,
  titleStyle,
  contentStyle,
  testID,
}: MenuItemProps) => {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: 'rgba(0, 0, 0, .1)' }}
      style={({ pressed }) => [
        styles.container,
        dense && styles.dense,
        disabled && styles.disabled,
        // Manual opacity feedback for iOS
        Platform.OS === 'ios' && pressed && styles.iosPressed,
        style,
      ]}
    >
      <View style={[styles.row, contentStyle]}>
        {/* Leading Icon */}
        {leadingIcon && (
          <View style={styles.iconContainer}>
            {leadingIcon}
          </View>
        )}

        {/* Title Content */}
        <View style={styles.titleWrapper}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              disabled && styles.disabledText,
              titleStyle,
            ]}
          >
            {title}
          </Text>
        </View>

        {/* Trailing Icon */}
        {trailingIcon && (
          <View style={styles.iconContainer}>
            {trailingIcon}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 120,
    maxWidth: 280,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  dense: {
    height: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWrapper: {
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 16,
    color: '#1C1B1F', // Default MD3 Neutral color
    textAlign: 'left',
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.38,
  },
  disabledText: {
    color: '#1C1B1F',
  },
  iosPressed: {
    backgroundColor: 'rgba(0, 0, 0, .05)',
  },
});

export default MenuItem;