import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Layers, Globe, Map as MapIcon, Satellite, Moon, Sun, Mountain, Palette, Car, TrainFront } from 'lucide-react-native';
import { COLORS } from '@/constants';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
interface Props {
  onLayerChange: (key: string) => void;
  onTrafficToggle: (enabled: boolean) => void;
  position: 'bottomRight' | 'bottomLeft'
}

const MapLayerSwitcher = ({ onLayerChange, onTrafficToggle, position }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [trafficEnabled, setTrafficEnabled] = useState(false);
  const [activeLayer, setActiveLayer] = useState('osm');
  const { t, i18n } = useTranslation()

  const layers = useMemo(() => {

    return ([
      { id: 'google_standard', label: 'layers.google_standard', icon: MapIcon },
      { id: 'google_transit', label: 'layers.google_transit', icon: TrainFront },
      { id: 'osm', label: 'layers.osm', icon: MapIcon },
      { id: 'satellite', label: 'layers.satellite', icon: Satellite },
      { id: 'topo', label: 'layers.topo', icon: Mountain },
      { id: 'dark', label: 'layers.dark', icon: Moon },
      { id: 'light', label: 'layers.light', icon: Sun },
      { id: 'voyager', label: 'layers.voyager', icon: Globe },
      { id: 'terrain', label: 'layers.terrain', icon: Mountain },
    ])
  }
    , [i18n])

  const positionCoordinates = position === 'bottomRight' ? { right: 10, bottom: 126, marginVertical: 4 } : { left: 15, bottom: 10 }
  const handleTrafficChange = (val: boolean) => {
    setTrafficEnabled(val);
    onTrafficToggle(val);
  };

  return (
    <View style={[styles.container, { bottom: positionCoordinates.bottom }, position == 'bottomLeft' ? { left: positionCoordinates.left } : { right: positionCoordinates.right, alignItems: "flex-end" }]}>
      {isOpen && (
        <View style={styles.menu}>
          {/* Traffic Toggle Item */}
          <View style={styles.trafficRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Car size={18} color={trafficEnabled ? COLORS.primary : "#555"} />
              <Text style={styles.trafficText}>{t('layers.traffic')}</Text>
            </View>
            <Switch
              value={trafficEnabled}
              onValueChange={handleTrafficChange}
              thumbColor={trafficEnabled ? COLORS.primaryLight : COLORS.disabled}
              
              trackColor={{ false: "#ddd", true: COLORS.primary }}
            />
          </View>

          <View style={styles.divider} />

          {/* Scrollable Layer List */}
          <ScrollView style={position === 'bottomRight' ? { maxHeight: 250 } : { maxHeight: 180 }} showsVerticalScrollIndicator={false}>
            {layers.map((layer) => (
              <TouchableOpacity
                key={layer.id}
                style={[styles.layerItem, activeLayer === layer.id && styles.activeItem]}
                onPress={() => {
                  setActiveLayer(layer.id);
                  onLayerChange(layer.id);
                }}
              >
                <layer.icon size={18} color={activeLayer === layer.id ? COLORS.primary : "#555"} />
                <Text style={[styles.layerLabel, activeLayer === layer.id && styles.activeLabel]}>
                  {t(layer.label)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setIsOpen(!isOpen)}>
        <Layers color={COLORS.primary} size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', zIndex: 999, },
  fab: { backgroundColor: '#fff', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowOpacity: 0.2, shadowRadius: 4 },
  menu: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 10, width: 160, padding: 8, elevation: 5 },
  trafficRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 10 },
  trafficText: { marginLeft: 8, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 4 },
  layerItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8 },
  activeItem: { backgroundColor: '#f0f7ff' },
  layerLabel: { marginLeft: 10, fontSize: 13, color: '#444' },
  activeLabel: { color: COLORS.primary, fontWeight: 'bold' }
});

export default MapLayerSwitcher;