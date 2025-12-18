import React, { useState, useRef, useEffect } from 'react';
import { View, Modal, StyleSheet, Animated, Dimensions, Easing, Platform, ScrollView, ViewStyle, Pressable } from 'react-native';
import MenuItem from './MenuItem';

interface ReusableMenuProps {
  visible: boolean;
  onDismiss: () => void;
  anchor: React.ReactNode;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

// 1. Define the component under a unique internal name
const MenuRoot = ({
  visible,
  onDismiss,
  anchor,
  children,
  contentStyle,
}: ReusableMenuProps) => {
  const [rendered, setRendered] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const anchorRef = useRef<View>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  const measureAnchor = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setCoords({ x, y, width, height });
    });
  };

  useEffect(() => {
    if (visible) {
      setRendered(true);
      measureAnchor();
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 200, easing: Easing.out(Easing.back(1)), useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setRendered(false));
    }
  }, [visible]);

  const { height: screenHeight } = Dimensions.get('window');
  const isBottomHalf = coords.y > screenHeight / 2;

  const menuPosition = {
    left: Math.max(8, coords.x),
    top: isBottomHalf ? undefined : coords.y + coords.height + 5,
    bottom: isBottomHalf ? screenHeight - coords.y + 5 : undefined,
  };

  return (
    <View ref={anchorRef} collapsable={false}>
      {anchor}
      <Modal visible={rendered} transparent animationType="none" onRequestClose={onDismiss}>
        <Pressable style={styles.overlay} onPress={onDismiss}>
          <Animated.View style={[styles.menuContent, menuPosition, contentStyle, { opacity, transform: [{ scale }] }]}>
            <ScrollView bounces={false}>{children}</ScrollView>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

// 2. Combine them into a single object and export that object
export const Menu = Object.assign(MenuRoot, {
  Item: MenuItem,
});

export default Menu;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'transparent' },
  menuContent: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    minWidth: 150,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 8 },
    }),
  },
});