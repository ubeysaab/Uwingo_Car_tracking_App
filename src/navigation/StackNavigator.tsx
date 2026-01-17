import Devices from '@/components/Screens/Devices';
import Drivers from "@/components/Screens/Drivers";
import DriverVehicles from '@/components/Screens/DriverVehicles';
import HomeScreen from '@/components/Screens/HomeScreen';
import PacketContents from '@/components/Screens/PacketContents';
import Packets from '@/components/Screens/Packets';
import Vehicles from '@/components/Screens/Vehicles';
import { createDrawerNavigator } from '@react-navigation/drawer';

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
      <Stack.Screen name='Packets' component={Packets} />
      <Stack.Screen name='Packet Contents' component={PacketContents} />

    </Stack.Navigator>
  );
}