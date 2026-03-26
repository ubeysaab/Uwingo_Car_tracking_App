import { ENDPOINTS } from '@/api/endpoints';
import { getAddressFromCoords } from '@/utils/getAddressFromCoords';


import MapControls from '@/components/Map/MapControls';
import MapLayerSwitcher from '@/components/Map/MapLayerSwitcher';
import ErrorModal from '@/components/Modals/ErrorModal';
import DetailsCard from '@/components/screens/AllDetailsWithStreetView/DetailsCard';
import ErrorScreen from '@/components/screens/ErrorScreen';
import { RootDrawerParamList } from '@/navigation/types';
import { useGetVehicleDetails } from '@/store/server/useVehicleDetails';
import { VehicleDetails } from '@/types/ui';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';
// import Geolocation from '@react-native-community/geolocation';

const { width, height } = Dimensions.get('window');



const detailedMap = require("/assets/streetViewMap.html")



// Types
interface DetailItem {
  title: string;
  value: string;
}

type Props = {
  route: RouteProp<RootDrawerParamList, 'All Details With Street View'>;
  navigation: DrawerNavigationProp<RootDrawerParamList, 'All Details With Street View'>;
};





const AllDetailsWithStreetView: React.FC<Props> = ({
  route, navigation
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const { item } = route.params;

  // if (!item.vehicleId) return <ErrorScreen message='There Is No Id Selected' onRetry={() => navigation.navigate("Home")} />

  const { data, isLoading, isError, error, refetch } = useGetVehicleDetails(item?.vehicleId ?? 0);
  // 3. Set initial map values from the item





  const [zoomInfo, setZoomInfo] = useState({
    current: 15,
    min: 0,
    max: 20
  });

  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<'osm' | 'satellite' | 'topo'>('osm');

  const scrollY = useRef(new Animated.Value(0)).current;
  const webViewRef = useRef<WebView>(null);

  const vehicle = data as VehicleDetails | undefined;



  // Replace individual location/speed states with this:
  const [trackingData, setTrackingData] = useState<{
    lat: number;
    lng: number;
    speed: number
  } | null>(null);

  const handleLayerChange = (layerKey: string) => {
    const js = `window.switchLayer('${layerKey}');`;
    webViewRef.current?.injectJavaScript(js);
  };

  const handleTrafficToggle = (enabled: boolean) => {
    const js = `window.toggleTraffic(${enabled});`;
    webViewRef.current?.injectJavaScript(js);
  };



  // Use a ref to store the latest data to avoid dependency cycles in useEffect
  const vehicleRef = useRef(vehicle);


  const [address, setAddress] = useState("Loading address...");



  const fetchAddress = async (lat: any, lon: any) => {

    const res = await getAddressFromCoords(lat, lon);
    setAddress(res);

  };

  useEffect(() => { vehicleRef.current = vehicle; }, [vehicle]);

  useEffect(() => {
    if (!vehicle?.serialNumber) return;

    async function fetchTrackingData() {
      try {
        const mongoRes = await fetch(ENDPOINTS.Others.getBySrnLastList, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([vehicleRef.current?.serialNumber]),
        });
        const result = await mongoRes.json();
        console.log(
          'result of mongo', result
        )

        // Update everything at once
        setTrackingData({
          lat: result[0].latitude,
          lng: result[0].longitude,
          speed: result[0].speed
        });

        await fetchAddress(result[0].latitude, result[0].longitude)


        webViewRef.current?.postMessage(JSON.stringify({
          type: 'Update_Location',
          data: {
            lat: result[0].latitude,
            lng: result[0].longitude,
            serialNumber: result[0].serialNumber
          }
        }))
      } catch (error) {
        setErrorMessage("Could not connect to tracking server.");
        setIsModalVisible(true);
      }
    }

    fetchTrackingData();
    const intervalId = setInterval(fetchTrackingData, 30000);
    return () => clearInterval(intervalId);
  }, [vehicle?.serialNumber]);






  console.log('DATA CURRENT : ', JSON.stringify(trackingData))


  const details = React.useMemo(() => {
    if (!vehicle) return [];
    const f = (val: any) => (val && val !== "Bilinmiyor" ? val : "N/A");

    return [
      // --- Vehicle Info ---
      { title: 'vehiclesPage.brand', value: f(vehicle.make) },
      { title: 'vehiclesPage.model', value: f(vehicle.modelVehicle) },
      { title: 'vehiclesPage.modelYear', value: vehicle.year ? String(vehicle.year) : "N/A" },
      // { title: 'vehiclesPage.vehicleId', value: String(vehicle.vehicleId || "N/A") },
      { title: 'vehiclesPage.chassisNo', value: f(vehicle.vin) },
      { title: 'vehiclesPage.vehiclePlate', value: f(vehicle.plate) },
      { title: 'devicesPage.deviceSerialNumber', value: f(vehicle.serialNumber) },
      { title: 'devicesPage.deviceModel', value: f(vehicle.modelDevice) },
      { title: 'devicesPage.devicePacketType', value: f(vehicle.packetType) },
      { title: 'devicesPage.connectedVehicle', value: vehicle.isConnectedVehicles !== undefined ? (vehicle.isConnectedVehicles ? `yes` : `no`) : 'N/A' },

      // --- Maintenance ---
      { title: 'vehicleMaintenancePage.lastMaintenanceDate', value: !vehicle?.lastMaintenanceDate ? "N/A" : vehicle.lastMaintenanceDate.split('T')[0] },
      { title: 'vehicleMaintenancePage.nextMaintenanceDate', value: !vehicle.nextMaintenanceDate ? "N/A" : vehicle.nextMaintenanceDate.split('T')[0] },
      { title: 'common.daysRemaining', value: vehicle.days !== undefined ? `${vehicle.days} ` : "N/A" },

      // --- Driver ---
      { title: 'driversPage.driverName', value: f(vehicle.driverName) },
      { title: 'driversPage.driverCode', value: f(vehicle.driverCode) },

      // --- Insurance ---
      { title: 'vehicleCascoPage.policyNumber', value: f(vehicle.policyNumber) },
      { title: 'vehicleCascoPage.insuranceCompany', value: f(vehicle.insuranceCompany) },
      { title: 'vehicleCascoPage.startDate', value: !vehicle.startDate ? "N/A" : vehicle.startDate.split('T')[0] },
      { title: 'vehicleCascoPage.endDate', value: !vehicle.endDate ? "N/A" : vehicle.endDate.split('T')[0] },
      { title: 'vehicleInspectionPage.inspectionDate', value: !vehicle.inspectionDate ? "N/A" : vehicle.inspectionDate.split('T')[0] },
      { title: 'vehicleInspectionPage.expiryDate', value: !vehicle.expiryDate ? "N/A" : vehicle.expiryDate.split('T')[0] },
      { title: 'common.description', value: f(vehicle.notes) }, // Assuming notes are descriptions

      // --- Repair ---
      { title: 'vehicleRepairPage.repairDate', value: !vehicle.repairDate ? "N/A" : vehicle.repairDate.split('T')[0] },
      { title: 'vehicleRepairPage.faultType', value: f(vehicle.faultType) },
      { title: 'vehicleRepairPage.faultDescription', value: f(vehicle.faultDescription) },
      { title: 'vehicleRepairPage.repairAction', value: f(vehicle.repairAction) },
      { title: 'vehicleMaintenancePage.performedBy', value: f(vehicle.performedBy) },
      { title: 'vehicleRepairPage.repairCost', value: vehicle.repairCost !== undefined ? `${vehicle.repairCost} TL` : "N/A" },
      { title: 'common.description', value: f(vehicle.repairNotes) },
    ];
  }, [vehicle]);


  const allDetails = React.useMemo(() => {
    return [
      { title: 'common.speed', value: trackingData?.speed },
      ...details,
    ]
  }, [trackingData, details])



  const debugging = React.useMemo(() => `
  const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(
    JSON.stringify({
      'type': 'console', 
      'data': log ? String(log) : 'undefined'
    })
  );
  
  // Override console methods BEFORE any other scripts run
  console = {
    log: (...args) => consoleLog('log', args.join(' ')),
    debug: (...args) => consoleLog('debug', args.join(' ')),
    info: (...args) => consoleLog('info', args.join(' ')),
    warn: (...args) => consoleLog('warn', args.join(' ')),
    error: (...args) => consoleLog('error', args.join(' ')),
  };
  
  // Also hook into window.onerror for uncaught errors
  window.onerror = function(message, source, lineno, colno, error) {
    consoleLog('error', \`Uncaught: \${message} at \${source}:\${lineno}:\${colno}\`);
    return false;
  };
  
  // Confirm injection worked
  console.log('[Debug] Console injected successfully');
`, []);





  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [60, 50],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.8, 0.6],
    extrapolate: 'clamp',
  });

  //  TODO : Get current location  ( WILL BE SENDED FROM THE PREVIOUS COMPONENT OR WE GONNA FETCH)


  // Handle WebView messages
  const handleWebViewMessage = (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'mapLoaded') {
        setMapLoaded(true);


        webViewRef.current?.postMessage(
          JSON.stringify({
            type: "Vehicle_Data",
            data: item
          })
        )
      } else if (msg.type === 'zoomLevel') {
        console.log(msg)
        setZoomInfo({
          current: msg.data.zoom,
          min: msg.data.minZoom,
          max: msg.data.maxZoom
        });
      }
      else if (msg.type === "console") { // lowercase to match
        console.info(`[WebView  ${msg.type}]`, msg.data.log || msg.data);
      } else {
        console.log('Unknown message type:', msg.type, msg.data);
      }
    } catch (error) {
      console.log('Error parsing WebView message:', error);
    }
  };

  if (!item.vehicleId) {
    return (
      <ErrorScreen
        message="There Is No Id Selected"
        onRetry={() => navigation.navigate("Home")}
      />
    );
  }

  if (isLoading) {
    return <Text>Loading vehicle details...</Text>;
  }

  if (isError) {
    return <ErrorScreen onRetry={refetch} message={error.message} />;
  }
  if (!vehicle) {
    return (
      <ErrorScreen
        message="There Is No Id Selected"
        onRetry={() => navigation.navigate("Home")}
      />
    );
  }



  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Animated Header */}
      <Animated.View style={[styles.header, {
        height: headerHeight,
        opacity: headerOpacity,
      }]}>
        <Text style={styles.headerTitle}>Vehicle Dashboard</Text>
        {trackingData?.lat && trackingData?.lng && <View style={styles.headerLocation}>
          <View style={styles.locationDot} />
          <Text style={styles.headerLocationText}>
            {trackingData ?
              `${trackingData.lat.toFixed(4)}, ${trackingData.lng.toFixed(4)}` :
              'Getting location...'
            }
          </Text>
        </View>}
      </Animated.View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        {!mapLoaded && (
          <View style={styles.mapLoading}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.mapLoadingText}>Loading map...</Text>
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={detailedMap}
          style={styles.map}
          injectedJavaScript={debugging}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.mapLoading}>
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          )}
        />

        <MapLayerSwitcher
          onLayerChange={handleLayerChange}
          onTrafficToggle={handleTrafficToggle}
          position='bottomLeft'
        />

        {/* Map Controls */}
        {webViewRef.current && <MapControls
          item={{ lat: item?.lat, lng: item?.lng }}
          webViewRef={webViewRef}
          zoomInfo={zoomInfo}
          circles={false}

        />}

      </View>

      {/* Details Section */}
      <Animated.ScrollView
        style={styles.detailsContainer}
        contentContainerStyle={styles.detailsContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          <Text style={styles.sectionSubtitle}>Real-time information</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.addressLabel}>Current Location :</Text>
          <Text style={styles.addressText} numberOfLines={2}>{address}</Text>
        </View>

        {
          allDetails.map((item, index) => (
            <DetailsCard key={`${item.value}-${item.title}-${index}`} item={item} />
          ))
        }

        {/* Stats Summary */}
        {/* <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Summary</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{details.length}</Text>
              <Text style={styles.statLabel}>Total Metrics</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>Monitoring</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>100%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
          </View>
        </View> */}
      </Animated.ScrollView>

      <ErrorModal
        visible={isModalVisible}
        message={errorMessage}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: '#ffffff',
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
    padding: 8,
    flex: 1,
    justifyContent: 'center',
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginRight: 8,
  },
  headerLocationText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  mapContainer: {
    height: height * 0.4,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapLoading: {

    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLoadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
  },
  layerSelector: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  layerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  layerButtonActive: {
    backgroundColor: '#3b82f6',
  },
  layerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  layerButtonTextActive: {
    color: '#ffffff',
  },
  mapControls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  mapControlText: {
    fontSize: 20,
    color: '#3b82f6',
  },
  detailsContainer: {
    flex: 1,
  },
  detailsContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIconText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b82f6',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    flex: 1,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f1f3f5',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardUpdated: {
    fontSize: 14,
    color: '#adb5bd',
    fontWeight: '500',
  },
  cardAction: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
  },
  cardActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
});

export default AllDetailsWithStreetView;