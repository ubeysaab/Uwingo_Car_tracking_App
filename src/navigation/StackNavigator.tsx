// import { createNativeStackNavigator } from '@react-navigation/native-stack';



import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '@/components/Screens/HomeScreen';
import Vehicles from '@/components/Screens/Vehicles';
import Drivers from "@/components/Screens/Drivers"
import Devices from '@/components/Screens/Devices';
import DriverVehicles from '@/components/Screens/DriverVehicles';

const Stack = createDrawerNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          // TODO : NEED TO CHANGE THE COLOR 
          backgroundColor: "tomato"
        }
      }}

    >

      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="vehicles" component={Vehicles} />
      <Stack.Screen name="drivers" component={Drivers} />
      <Stack.Screen name='Devices' component={Devices} />
      <Stack.Screen name='Driver Vehicles' component={DriverVehicles} />

    </Stack.Navigator>
  );
}