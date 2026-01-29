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
import { useTranslation } from 'react-i18next';


const Stack = createDrawerNavigator();

export default function RootStack() {


  const { t } = useTranslation()


  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          // TODO : NEED TO CHANGE THE COLOR 
          backgroundColor: "#007AFF",
        },
        headerTintColor: 'white'
      }}

    >

      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name='Vehicles' options={{ title: t("common.vehicles") }} component={Vehicles} />
      <Stack.Screen name="Devices" options={{ title: t("common.devices") }} component={Devices} />
      <Stack.Screen name="Drivers" options={{ title: t("common.drivers") }} component={Drivers} />
      <Stack.Screen name="Vehicle Connected Devices" options={{ title: t("common.vehicleConnectedDevice") }} component={DevicesVehicles} />
      <Stack.Screen name="Vehicle Connected Driver" options={{ title: t("common.vehicleConnectedDriver") }} component={DriverVehicles} />
      <Stack.Screen name="Packets" options={{ title: t("common.packets") }} component={Packets} />
      <Stack.Screen name="Packet Contents" options={{ title: t("common.packetContents") }} component={PacketContents} />
      <Stack.Screen name="Vehicle Maintenance" options={{ title: t("common.vehicleMaintenance") }} component={VehicleMaintenance} />
      <Stack.Screen name="Vehicle Casco" options={{ title: t("common.vehicleCasco") }} component={VehicleCasco} />
      <Stack.Screen name="Vehicle Inspection" options={{ title: t("common.vehicleInspection") }} component={VehicleInspection} />
      <Stack.Screen name="Vehicle Insurance" options={{ title: t("common.vehicleInsurance") }} component={VehicleInsurance} />
      <Stack.Screen name="Vehicle Repair" options={{ title: t("common.vehicleRepair") }} component={VehicleRepair} />
      <Stack.Screen name="Vehicle Speed Limit" options={{ title: t("common.vehicleSpeedLimit") }} component={VehicleSpeedLimit} />

    </Stack.Navigator>
  );
}