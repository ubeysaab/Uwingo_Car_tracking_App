import AllDetailsWithStreetView from '@/components/Screens/AllDetailsWithStreetView/AllDetailsWithStreetView';
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
import CustomDrawerContent from '@/navigation/CustomDrawerContent';
import { RootDrawerParamList } from '@/navigation/types';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@/constants';

import {
  Box,
  Car,
  ClipboardList,
  FileCheck,
  Gauge,
  Hammer,
  Home,
  Link,
  Map,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  User,
  Wrench
} from 'lucide-react-native';





const Drawer = createDrawerNavigator<RootDrawerParamList>();



export default function RootStack() {
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.primaryLight,
        // Styling for the Drawer Items
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.inactive,
        drawerActiveBackgroundColor: COLORS.primaryLight, // Light tint of your brand color
        drawerLabelStyle: {
          marginLeft: -8, // Pull text closer to icon
          fontWeight: '600',
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t("common.home"),
          drawerIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />

      <Drawer.Screen
        name='Vehicles'
        component={Vehicles}
        options={{
          title: t("common.vehicles"),
          drawerIcon: ({ color, size }) => <Car color={color} size={size} />
        }}
      />

      <Drawer.Screen
        name="Devices"
        component={Devices}
        options={{
          title: t("common.devices"),
          drawerIcon: ({ color, size }) => <Smartphone color={color} size={size} />
        }}
      />

      <Drawer.Screen
        name="Drivers"
        component={Drivers}
        options={{
          title: t("common.drivers"),
          drawerIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />

      <Drawer.Screen
        name="Vehicle Connected Devices"
        component={DevicesVehicles}
        options={{
          title: t("common.vehicleConnectedDevice"),
          drawerIcon: ({ color, size }) => <Link color={color} size={size} />
        }}
      />

      <Drawer.Screen
        name="Vehicle Connected Driver"
        component={DriverVehicles}
        options={{
          title: t("common.vehicleConnectedDriver"),
          drawerIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />

      <Drawer.Screen
        name="Packets"
        component={Packets}
        options={{
          title: t("common.packets"),
          drawerIcon: ({ color, size }) => <Box color={color} size={size} />
        }}
      />

      <Drawer.Screen
        name="Packet Contents"
        component={PacketContents}
        options={{
          title: t("common.packetContents"),
          drawerIcon: ({ color, size }) => <ClipboardList color={color} size={size} />
        }}
      />

      <Drawer.Screen
        name="Vehicle Maintenance"
        component={VehicleMaintenance}
        options={{
          title: t("common.vehicleMaintenance"),
          drawerIcon: ({ color, size }) => <Wrench color={color} size={size} />
        }}
      />

      <Drawer.Screen
        name="Vehicle Casco"
        component={VehicleCasco}
        options={{
          title: t("common.vehicleCasco"),
          drawerIcon: ({ color, size }) => <ShieldCheck color={color} size={size} />
        }}
      />

      <Drawer.Screen
        name="Vehicle Inspection"
        component={VehicleInspection}
        options={{
          title: t("common.vehicleInspection"),
          drawerIcon: ({ color, size }) => <FileCheck color={color} size={size} />
        }}
      />

      <Drawer.Screen
        name="Vehicle Insurance"
        component={VehicleInsurance}
        options={{
          title: t("common.vehicleInsurance"),
          drawerIcon: ({ color, size }) => <ShieldAlert color={color} size={size} />
        }}
      />

      <Drawer.Screen
        name="Vehicle Repair"
        component={VehicleRepair}
        options={{
          title: t("common.vehicleRepair"),
          drawerIcon: ({ color, size }) => <Hammer color={color} size={size} />

        }}
      />

      <Drawer.Screen
        name="Vehicle Speed Limit"
        component={VehicleSpeedLimit}
        options={{
          title: t("common.vehicleSpeedLimit"),
          drawerIcon: ({ color, size }) => <Gauge color={color} size={size} />
        }}
      />

      <Drawer.Screen
        name='All Details With Street View'
        component={AllDetailsWithStreetView}
        options={{
          drawerItemStyle: { display: 'none' },
          drawerIcon: ({ color, size }) => <Map color={color} size={size} />
        }}
      />
    </Drawer.Navigator>
  );
}








// export default function RootStack() {
//   const { t } = useTranslation();

//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: "#E77803",
//         },
//         headerTintColor: 'white',
//       }}
//     >
//       <Drawer.Screen name="Home" component={HomeScreen} />
//       <Drawer.Screen name='Vehicles' options={{ title: t("common.vehicles") }} component={Vehicles} />
//       <Drawer.Screen name="Devices" options={{ title: t("common.devices") }} component={Devices} />
//       <Drawer.Screen name="Drivers" options={{ title: t("common.drivers") }} component={Drivers} />
//       <Drawer.Screen name="Vehicle Connected Devices" options={{ title: t("common.vehicleConnectedDevice") }} component={DevicesVehicles} />
//       <Drawer.Screen name="Vehicle Connected Driver" options={{ title: t("common.vehicleConnectedDriver") }} component={DriverVehicles} />
//       <Drawer.Screen name="Packets" options={{ title: t("common.packets") }} component={Packets} />
//       <Drawer.Screen name="Packet Contents" options={{ title: t("common.packetContents") }} component={PacketContents} />
//       <Drawer.Screen name="Vehicle Maintenance" options={{ title: t("common.vehicleMaintenance") }} component={VehicleMaintenance} />
//       <Drawer.Screen name="Vehicle Casco" options={{ title: t("common.vehicleCasco") }} component={VehicleCasco} />
//       <Drawer.Screen name="Vehicle Inspection" options={{ title: t("common.vehicleInspection") }} component={VehicleInspection} />
//       <Drawer.Screen name="Vehicle Insurance" options={{ title: t("common.vehicleInsurance") }} component={VehicleInsurance} />
//       <Drawer.Screen name="Vehicle Repair" options={{ title: t("common.vehicleRepair") }} component={VehicleRepair} />
//       <Drawer.Screen name="Vehicle Speed Limit" options={{ title: t("common.vehicleSpeedLimit") }} component={VehicleSpeedLimit} />

//       {/* Fixed: Changed Drawer.Screen to Stack.Screen and fixed the options for hiding from Drawer */}
//       <Drawer.Screen
//         name='All Details With Street View'
//         component={AllDetailsWithStreetView}
//         options={{
//           drawerItemStyle: { display: 'none' } // Correct way to hide item from Drawer menu
//         }}
//       />


//     </Drawer.Navigator>
//   );
// }
