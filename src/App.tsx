// in App.js

import { useEffect } from 'react';
// Import the hook
import { useAuthStore } from './stores/authStore';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigation/StackNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  // ⭐️ CORRECT FIX: Call the hook at the top level to select the 'bootstrap' action.
  // The function you pass to useAuthStore is the selector for the data.
  const bootstrap = useAuthStore((store) => store.bootstrap);

  useEffect(() => {
    // Call the function returned by the selector
    bootstrap();

  }, [bootstrap]);
  // We include 'bootstrap' in the dependency array. Since it is a function 
  // from the Zustand store, its reference is stable across renders, so this 
  // effect will still only run once on mount.

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <RootStack />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}