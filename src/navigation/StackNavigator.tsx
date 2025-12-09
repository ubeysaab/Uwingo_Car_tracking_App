// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import Login from '../screens/Login';


import { createDrawerNavigator } from '@react-navigation/drawer';



const Stack = createDrawerNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName='login'
      screenOptions={{
        headerStyle: {
          // TODO : NEED TO CHANGE THE COLOR 
          backgroundColor: "tomato"
        }
      }}

    >



      <Stack.Screen name="login" component={Login} options={{ title: "login title" }} />
      <Stack.Screen name="Home" component={HomeScreen} />

    </Stack.Navigator>
  );
}