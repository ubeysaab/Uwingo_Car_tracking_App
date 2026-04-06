import LoginScreen from "@/components/Screens/LoginScreen";
import SplashScreen from "@/components/Screens/SplashScreen";
import RootStack from "@/navigation/DrawerNavigator";

/**
 * 
 * if i do it inside app : 
  -  New component identity every render
  -  React Navigation may remount trees
  -  State loss between auth transitions
 */

type WorkingStackProps = {
  status: "booting" | "authenticated" | "unauthenticated";
};

export default function WorkingStack({ status }: WorkingStackProps) {
  if (status === "booting") return <SplashScreen />;
  if (status === "authenticated") return <RootStack />;
  return <LoginScreen />
}
