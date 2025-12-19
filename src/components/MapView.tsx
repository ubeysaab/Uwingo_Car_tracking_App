import { fetchFinalMapData } from "../api/services/map/fetchPipeLine";
import type { FinalMapDTO } from "../types/forMap";
import React, { useEffect, useRef, useState } from "react";
import { AppState, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

// Make sure this path is correct relative to this file!
// If MapView is in src/components, and HTML is in src/assets:
const mapHtmlFile = require("../../assets/mapView.html");


// TODO :  ADD BUTTON THAT SHOWS ALL POPU UP IN ORDER TO FIND VEHICLES FASTER( NOW YOU NEED TO CLICK ON IT IN ORDER TO SEE THE VALUES) ( BETTER UX)


type OutVehicle = {
  serialNumber: string;
  lat: number;
  lng: number;
  plate: string;
  speed: number;
  isWorking: boolean;
};

export default function MapView() {
  const webviewRef = useRef<WebView | null>(null);
  const timerRef = useRef<number | null>(null); // Fixed type for timer
  const [isMapReady, setIsMapReady] = useState(false); // Track if map is loaded

  // Store latest vehicles here so we can send them as soon as map is ready
  const latestVehiclesRef = useRef<OutVehicle[]>([]);


  // TODO : transform determine the shape of the data that gonna send to weview
  function transform(dto: FinalMapDTO[]): OutVehicle[] {
    return dto
      .map((x) => {
        // ... your existing logic ...
        const serialNumber: string = String(
          x.trackingData?.SerialNumber

        );

        const lat = Number(x.trackingData?.Latitude);
        const lng = Number(x.trackingData?.Longitude);

        return {
          serialNumber,
          lat,
          lng,
          plate: String(x.vehicles?.Plate),
          speed: Number(x.trackingData?.speed),
          isWorking: x?.trackingData?.WorkingStatus
        };
      })
      .filter((v) => isFinite(v.lat) && isFinite(v.lng));
  }

  function postFullUpdateToWebView(vehicles: OutVehicle[]) {
    // Save latest data
    latestVehiclesRef.current = vehicles;

    // Only send if the WebView has told us it's ready
    if (isMapReady && webviewRef.current) {
      const payload = JSON.stringify({ type: "FULL_UPDATE", data: vehicles });
      webviewRef.current.postMessage(payload);
    }
  }

  // Add to your component to test if WebView is receiving messages
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



  useEffect(() => {
    let mounted = true;

    async function fetchAndSend() {
      try {
        const dto = await fetchFinalMapData();
        if (!mounted) return;

        const vehicles = transform(dto);
        // console.log(vehicles)
        postFullUpdateToWebView(vehicles);
      } catch (err) {
        console.log("Fetch error:", err);
      }
    }

    // Initial fetch
    fetchAndSend();

    // Interval
    timerRef.current = setInterval(fetchAndSend, 60000);

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
      } else if (msg.type === "console") { // lowercase to match
        console.info(`[WebView Console ${msg.type}]`, msg.data.log || msg.data);
      } else {
        console.log('Unknown message type:', msg.type, msg.data);
      }
    } catch (err) {
      console.error('Failed to parse WebView message:', err, e.nativeEvent.data);
    }
  }

  const debugging = `
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
`;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        // KEY FIX: Use source={require(...)} or source={{ html: ... }}
        source={mapHtmlFile}
        onMessage={onMessage}
        onError={(e) => console.log("WebView error:", e.nativeEvent)}
        // originWhitelist is crucial for local HTML loading

        webviewDebuggingEnabled={true}

        setBuiltInZoomControls={false}
        injectedJavaScript={debugging}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        mixedContentMode="always"
        style={styles.webview}
        injectedJavaScriptBeforeContentLoaded={debugging}
        onLoadEnd={() => console.log("WebView fully loaded")}
        onLoadStart={() => console.log("WebView starting to load")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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