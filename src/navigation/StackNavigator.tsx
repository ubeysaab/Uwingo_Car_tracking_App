import Devices from '@/components/Screens/Devices';
import DevicesVehicles from '@/components/Screens/DeviceVehicles';
import Drivers from "@/components/Screens/Drivers";
import DriverVehicles from '@/components/Screens/DriverVehicles';
import HomeScreen from '@/components/Screens/HomeScreen';
import PacketContents from '@/components/Screens/PacketContents';
import Packets from '@/components/Screens/Packets';
import VehicleCasco from '@/components/Screens/VehicleCasco';
import VehicleInspection from '@/components/Screens/VehicleInspection';
import VehicleInsurance from '@/components/Screens/VehicleInsurance';
import VehicleMaintenance from '@/components/Screens/VehicleMaintenance';
import VehicleRepair from '@/components/Screens/VehicleRepair';
import Vehicles from '@/components/Screens/Vehicles';
import VehicleSpeedLimit from '@/components/Screens/VehicleSpeedLimit';
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
      <Stack.Screen name='Devices' component={Devices} />
      <Stack.Screen name="drivers" component={Drivers} />
      <Stack.Screen name='Vehicle Connected Device ' component={DevicesVehicles} />
      <Stack.Screen name='Driver Connected Vehicle' component={DriverVehicles} />

      <Stack.Screen name='Packages' component={Packets} />
      <Stack.Screen name='Packet Contents' component={PacketContents} />
      <Stack.Screen name='Vehicle Maintenance' component={VehicleMaintenance} />
      <Stack.Screen name='Vehicle Casco' component={VehicleCasco} />
      <Stack.Screen name='Vehicle Inspectioon' component={VehicleInspection} />
      <Stack.Screen name='Vehicle Insurance' component={VehicleInsurance} />
      <Stack.Screen name='Vehicle Repair' component={VehicleRepair} />
      <Stack.Screen name='Vehicle Speed Limit' component={VehicleSpeedLimit} />

    </Stack.Navigator>
  );
}