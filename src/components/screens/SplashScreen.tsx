import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const SplashScreen = () => (
  <View style={styles.splash}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text>Loading application data...</Text>
  </View>
);


const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Your splash screen color
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


export default SplashScreen