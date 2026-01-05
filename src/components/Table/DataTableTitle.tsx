import * as React from 'react';
import {
  Animated,
  GestureResponderEvent,
  PixelRatio,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { Text } from "react-native-paper";
import type { ThemeProp } from '@/types/reactNativePaperTypes';

export type Props = React.ComponentPropsWithRef<typeof Pressable> & {
  children: React.ReactNode;
  numeric?: boolean;
  sortDirection?: 'ascending' | 'descending';
  numberOfLines?: number;
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  maxFontSizeMultiplier?: number;
  theme?: ThemeProp;
};

const DataTableTitle = ({
  numeric,
  children,
  onPress,
  sortDirection,
  textStyle,
  style,
  theme: themeOverrides,
  numberOfLines = 2, // Increased default to allow wrapping
  maxFontSizeMultiplier,
  ...rest
}: Props) => {
  const { current: spinAnim } = React.useRef<Animated.Value>(
    new Animated.Value(sortDirection === 'ascending' ? 0 : 1)
  );

  React.useEffect(() => {
    Animated.timing(spinAnim, {
      toValue: sortDirection === 'ascending' ? 0 : 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [sortDirection, spinAnim]);

  // Helper to force breaks in long strings with no spaces (e.g., long IDs or URLs)
  const renderChildren = () => {
    if (typeof children === 'string') {
      // Inserts a zero-width space after every character to allow breaking anywhere
      return children.split('').join('\u200B');
    }
    return children;
  };

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      {...rest}
      style={[styles.container, numeric && styles.numeric, style]}
    >
      <Text
        // Android: 'simple' breaks words wherever they hit the edge
        textBreakStrategy="simple"
        // iOS: 'standard' allows basic wrapping
        lineBreakStrategyIOS="standard"
        style={[
          styles.cell,
          // Removed maxHeight to allow the text to actually wrap vertically
          textStyle,
        ]}
        // numberOfLines={0} allows infinite wrapping. 
        // If you want a limit, pass it here, but it must be > 1 to wrap.
        numberOfLines={numberOfLines}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
      >
        {renderChildren()}
      </Text>
    </Pressable>
  );
};

DataTableTitle.displayName = 'DataTable.Title';

const styles = StyleSheet.create({
  container: {
    // width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 8,
    // Ensures the container can grow vertically if text wraps
    minHeight: 48,
  },
  cell: {
    flex: 1,
    lineHeight: 20, // Reduced slightly for better multi-line appearance
    fontSize: 14,
    fontWeight: '800',
    color: 'rgba(0, 0, 0, 0.87)',
    // Ensures the text engine knows it can wrap
    flexWrap: 'wrap',
  },
  numeric: {
    width: 60,
    justifyContent: 'flex-end',
  },
});

export default DataTableTitle;

// @component-docs ignore-next-line
export { DataTableTitle };
