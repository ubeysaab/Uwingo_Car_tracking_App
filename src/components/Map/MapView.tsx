import { fetchFinalMapData } from "@/api/services/map/fetchPipeLine";
import MapControls from "@/components/Map/MapControls";
import MapLayerSwitcher from "@/components/Map/MapLayerSwitcher";
import MapLegend from "@/components/Map/MapLegend";
import MapSearchOverlay from "@/components/Map/MapSearchOverLay/MapSearchOverlay";
import AnimatedMapSkeleton from "@/components/Map/MapSkeletonLoader";
import ErrorScreen from "@/components/Screens/ErrorScreen";
import { RootDrawerParamList } from "@/navigation/types";
import { NormalizedErrorT } from "@/types/auth";
import { CreateInstantDataEndpoint_whatGet } from "@/types/forMap";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppState, Modal, Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";




const mapSource = Platform.OS === 'android'
  ? { uri: 'file:///android_asset/mapView.html' }
  : { uri: 'mapView.html' };


export interface ReshapedData {
  vehicleId: string | number;
  dailyKM: number;
  serialNumber: string;
  lat: number;
  lng: number;
  plate: string;
  speed: number;
  isWorking: boolean;
  speedLimit: number;
  coordinate: string; // assuming coordinatesJson is a JSON string
  analysisEndDate?: string; // ISO date string?
  analysisStartDate?: string; // ISO date string?
  address: string;
}







export default function MapView() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const webviewRef = useRef<WebView | null>(null);
  const timerRef = useRef<number | null>(null); // Fixed type for timer
  const [isMapReady, setIsMapReady] = useState(false); // Track if map is loaded

  const [vehiclesForOverlay, setVehiclesForOverlay] = useState<ReshapedData[]>([]);

  const [selectedLayer, setSelectedLayer] = useState<'osm' | 'satellite' | 'topo'>('osm');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [zoomInfo, setZoomInfo] = useState({
    current: 7,
    min: 0,
    max: 20
  });


  // Store latest vehicles here so we can send them as soon as map is ready
  const latestVehiclesRef = useRef<ReshapedData[]>([]);

  const [violationCount, setViolationCount] = useState(0);
  const [violationCars, setViolationCars] = useState([]);


  const handleLayerChange = (layerKey: string) => {
    const js = `window.switchLayer('${layerKey}');`;
    webviewRef.current?.injectJavaScript(js);
  };

  const handleTrafficToggle = (enabled: boolean) => {
    const js = `window.toggleTraffic(${enabled});`;
    webviewRef.current?.injectJavaScript(js);
  };





  // const { t } = useTranslation();


  // const localizationData = {
  //   vehicles: t('common.vehicles'),
  //   active: t('common.active'),
  //   violations: t('common.violations'),
  //   mapLegend: t('common.mapLegend'),
  //   purpleCircle: t('common.purpleCircle'),
  //   redCircle: t('common.redCircle'),
  //   redCircleDescription: t('common.redCircleDescription'),
  //   purpleCircleDescription: t('common.purpleCircleDescription'),
  //   speedLimit: t('common.speedLimit'),
  //   on: t('common.on'),
  //   off: t('common.off'),
  //   lastUpdate: t('common.lastUpdate'),

  //   // ... add all other strings
  // };




  async function reShapeTheDateBeforeSendToWebView(lastDataFromPipeLine: any): Promise<ReshapedData[]> {
    // Get previous data for comparison/caching
    const previousData = latestVehiclesRef.current || [];

    const promises = lastDataFromPipeLine.map(async (x: CreateInstantDataEndpoint_whatGet) => {
      const lat = Number(x?.latitude);
      const lng = Number(x?.longitude);
      const serialNumber = String(x?.serialNumber);

      // 1. Find if we already have this vehicle in our previous state
      const prevVehicle = previousData.find(v => v.serialNumber === serialNumber);

      let address = "Address not found";

      /*
        2. CACHE LOGIC: 
        If we have an old address AND the coordinates haven't changed much, reuse it.
        0.0001 equal longituede 8-  latitude 11 meters 
        0.0001° ≈ 11.1 m for latitude anywhere
        For longitude at your location: multiply 11.1 m by the cosine of your latitude
        For example, at 40° latitude: 11.1 m × cos(40°) = about 8.5 m per 0.0001° longitude

        every 200 meters in my code 
      */


      const hasMoved = prevVehicle
        ? (Math.abs(prevVehicle.lat - lat) > 0.0018 || Math.abs(prevVehicle.lng - lng) > 0.0018)
        : true;

      if (prevVehicle?.address && !hasMoved) {
        address = prevVehicle.address; // Reuse cached address
      } else if (isFinite(lat) && isFinite(lng)) {
        // Only fetch if moved or new
        address = await getAddressFromCoords(lat, lng);
      }

      return {
        vehicleId: x?.vehicleId,
        dailyKM: x?.dailyKM,
        serialNumber,
        lat,
        lng,
        plate: x?.plate,
        speed: Number(x?.speed),
        isWorking: x?.workingstatus,
        speedLimit: x?.speedLimit,
        coordinate: x?.coordinatesJson,
        analysisEndDate: x?.analysisEndDate,
        analysisStartDate: x?.analysisStartDate,
        address: address
      };
    });

    const reshapedData = await Promise.all(promises);
    return reshapedData.filter((v: any) => isFinite(v.lat) && isFinite(v.lng));
  }

  // function that send data from here to the mapview 
  // ! this function will be used when filter or search text change
  function postFullUpdateToWebView(vehicles: ReshapedData[]) {

    console.log("Filtered Vehicles", vehicles)
    // Only send if the WebView has told us it's ready
    if (isMapReady && webviewRef.current) {
      const payload = JSON.stringify({ type: "FULL_UPDATE", data: vehicles });
      webviewRef.current.postMessage(payload);
    }
  }

  //  test if WebView is receiving messages
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && webviewRef.current) {
        // Test injection
        webviewRef.current.injectJavaScript(`
        if (typeof console.log === 'function') {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({type: 'console', data: {type: 'log', log: 'Injection verified'}})
          );
        }
      `);
      }
    });

    return () => subscription.remove();
  }, []);



  async function fetchAndSend() {
    setIsError(false)
    try {
      const dto = await fetchFinalMapData();

      const vehicles = await reShapeTheDateBeforeSendToWebView(dto);

      setVehiclesForOverlay(vehicles);

      // Save latest data
      latestVehiclesRef.current = vehicles;
      postFullUpdateToWebView(vehicles);
      setIsLoading(false);
    } catch (err: any) {

      const error = err as NormalizedErrorT;
      setIsError(true)
      setErrorMessage(error?.message)
    }
  }

  useEffect(() => {
    let mounted = true;

    if (!mounted) return;


    // Initial fetch
    fetchAndSend();

    // Interval
    timerRef.current = setInterval(fetchAndSend, 50000);

    return () => {
      mounted = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isMapReady]); // Add isMapReady dependency so it retries sending if map becomes ready during a fetch



  function onMessage(e: any) {
    try {
      const msg = JSON.parse(e.nativeEvent.data);

      if (msg.type === "READY") {
        console.log("WebView map ready");
        setIsMapReady(true);

        // If we already have data waiting, send it now!
        if (latestVehiclesRef.current.length > 0) {
          const payload = JSON.stringify({
            type: "FULL_UPDATE",
            data: latestVehiclesRef.current
          });
          webviewRef.current?.postMessage(payload);
        }
      } else if (msg.type === 'VEHICLE_DETAILS') {
        console.log(msg)
        navigation.navigate("All Details With Street View", { item: msg.data })
      } else if (msg.type === 'STATS_UPDATE') {
        console.log(msg, 'violation')
        setViolationCount(msg.violationsCount);
        setViolationCars(msg.violationCars)
      }
      else if (msg.type === "console") { // lowercase to match
        console.info(`[WebView  ${msg.type}]`, msg.data.log || msg.data);
      } else {
        console.log('Unknown message type:', msg.type, msg.data);
      }
    } catch (err) {
      console.error('Failed to parse WebView message:', err, e.nativeEvent.data);
    }
  }


  //   window.ReactNativeWebView.postMessage
  // → the only official bridge from WebView JS → React Native
  // postMessage : sends only strings 
  // 
  const debugging = useMemo(() => `
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
`, [])



  const handleToggleLabels = (enabled: boolean) => {
    const js = `
    var cb = document.getElementById('toggleAllLabels');
    if(cb) { 
      cb.checked = ${enabled}; 
      updateVehicleMarkers(); 
    }
  `;
    if (isMapReady && webviewRef.current) {
      webviewRef.current.injectJavaScript(js);
    }
  };





  function onSelectVehicle(lat: number, lng: number) {
    const reLocateToSelectedVehicle = `
      (function() {
        try {
          if (window.updateLocation) {
            window.updateLocation(${lat}, ${lng});
          } else {
            console.warn("updateLocation not found on window");
          }
        } catch (e) {
          console.error("Injection failed: " + e.message);
        }
      })();
      true;
    `;
    if (isMapReady && webviewRef.current) {
      webviewRef.current.injectJavaScript(reLocateToSelectedVehicle);
    }
  }





  return (
    <View style={styles.container}>


      {isLoading && !error && (
        <Modal
          animationType="fade"
        >
          <AnimatedMapSkeleton />

        </Modal>
      )}
      {vehiclesForOverlay.length > 0 && (<MapSearchOverlay
        violationCount={violationCount}
        violationCars={violationCars}
        allVehicles={vehiclesForOverlay}
        onSelectVehicle={onSelectVehicle}
        onFilterChange={postFullUpdateToWebView}
        onToggleLabels={handleToggleLabels}
      />)
      }
      <WebView
        ref={webviewRef}
        source={mapSource}
        onMessage={onMessage}
        onError={(e) => console.log("WebView error:", e.nativeEvent)}
        webviewDebuggingEnabled={true}
        setBuiltInZoomControls={false}
        injectedJavaScript={debugging}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowFileAccessFromFileURLs={true}    // ← add this
        allowUniversalAccessFromFileURLs={true} // ← add this (lets your HTML fetch tile URLs)
        mixedContentMode="always"
        style={styles.webview}
        injectedJavaScriptBeforeContentLoaded={debugging}
        onLoadEnd={() => console.log("WebView fully loaded")}
        onLoadStart={() => console.log("WebView starting to load")}
      // KEY FIX: Use source={require(...)} or source={{ html: ... }}
      // originWhitelist is crucial for local HTML loading


      />



      {vehiclesForOverlay.length > 0 && <MapLayerSwitcher
        onLayerChange={handleLayerChange}
        onTrafficToggle={handleTrafficToggle}
        position="bottomRight"
      />}

      {webviewRef.current && vehiclesForOverlay.length > 0 && <MapControls
        webViewRef={webviewRef}
        zoomInfo={zoomInfo}
        circles
      />}



      {vehiclesForOverlay.length > 0 && <MapLegend />}


      {error && <ErrorScreen
        message={errorMessage}
        onRetry={() => fetchAndSend()}
      />}



    </View>
  );
}

const styles = StyleSheet.create({

  loadingOverlay: {
    // Covers the entire parent container
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Ensure it sits above the WebView and Overlay
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  container: {
    position: 'relative',
    flex: 1,
    borderWidth: 1, // Optional: helpful for debugging boundaries
    borderColor: "black"
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent' // Sometimes helps with rendering glitches
    , borderWidth: 1, // Optional: helpful for debugging boundaries
    borderColor: "red"
  },
});