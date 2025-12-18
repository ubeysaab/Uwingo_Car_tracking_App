// in App.js

import { useEffect } from 'react';
// ⭐️  imports for conditional rendering (UI Gating)
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WorkingStack from './navigation/WorkingStack';
import { useAuthStore } from './stores/authStore';


import { PaperProvider } from 'react-native-paper';
import { AppRegistry } from 'react-native';




export default function App() {
  // 1. Select the 'bootstrap' action and the 'status' from the store
  const bootstrap = useAuthStore((state) => state.bootstrap)
  const status = useAuthStore((state) => state.status)


  console.log('app status', status)

  useEffect(() => {
    // 2. Run the bootstrap function on mount to hydrate the state
    bootstrap();

    // Note: If you don't add bootstrap to the dependency array, 
    // ESLint will complain. Adding it is safe since it's a stable
    // function reference from Zustand.
  }, [bootstrap]);






  return (
    <NavigationContainer>

      {/* TODO : USE THE PROVIDER TO HANDLE THEME  WITH   Material Design 3 default theme*/}
      <PaperProvider>
        <SafeAreaProvider>
          {/* // 3. Conditional Rendering based on Status */}
          <WorkingStack status={status} />
        </SafeAreaProvider>
      </PaperProvider >
    </NavigationContainer>
  );
}


AppRegistry.registerComponent("Uwingo", () => App);


