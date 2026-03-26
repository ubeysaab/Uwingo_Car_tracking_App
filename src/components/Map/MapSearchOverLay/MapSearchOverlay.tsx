// import { ReshapedData } from '@/components/Map/MapView';
// import {
//   ChevronDown,
//   ChevronRight,
//   ChevronUp,
//   Filter,
//   Folder,
//   Search
// } from 'lucide-react-native';
// import React, { useEffect, useMemo, useState } from 'react';
// import { Dimensions, FlatList, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { PieChart } from "react-native-gifted-charts";

// import HeaderIcon from '@/components/Map/MapSearchOverLay/HeaderIcon';
// import LegendItem from '@/components/Map/MapSearchOverLay/LegendItem';
// import VehicleCard from '@/components/Map/MapSearchOverLay/VehicleCard';
// import { COLORS } from '@/constants';
// import VehicleCardDetailed from '@/components/Map/MapSearchOverLay/VehicleCardDetailed';

// interface Props {
//   allVehicles: ReshapedData[];
//   violationCount: number;
//   violationCars: string[];
//   onSelectVehicle: (lat: number, lng: number) => void;
//   onFilterChange: (filteredData: ReshapedData[]) => void;
//   onToggleLabels: (enabled: boolean) => void;
// }

// const MapSearchOverlay = ({ allVehicles, onSelectVehicle, onFilterChange, violationCount, onToggleLabels, violationCars }: Props) => {
//   const [search, setSearch] = useState('');
//   const [status, setStatus] = useState('All');
//   const [isFocused, setIsFocused] = useState(false);
//   const [showLabels, setShowLabels] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [openedTab, setOpenedTab] = useState<"All" | "Groups" | "Filters" | null>("All");
//   const [selectedVehicle, setSelectedVehicle] = useState<ReshapedData | null>(null);

//   const handleBackToList = () => {
//     setSelectedVehicle(null);
//   };

//   // Improved Stats Logic: Mutually Exclusive Categories
//   const stats = useMemo(() => {
//     const total = allVehicles.length;

//     // 1. Identify Violation Cars first

//     // 2. Active = Working AND NOT in violation
//     const activeCars = allVehicles.filter(v => v.isWorking && !violationCars.includes(v.plate));

//     // 3. Stopped = Not Working AND NOT in violation
//     const stoppedCars = allVehicles.filter(v => !v.isWorking && !violationCars.includes(v.plate));

//     // Filter logic for the list
//     const filtered = allVehicles.filter(v => {
//       const matchesSearch = v.plate.toLowerCase().includes(search.toLowerCase());
//       const isV = violationCars.includes(v.plate);

//       if (status === 'All') return matchesSearch;
//       if (status === 'Active') return matchesSearch && v.isWorking && !isV;
//       if (status === 'Inactive') return matchesSearch && !v.isWorking && !isV;
//       return matchesSearch;
//     });

//     const sorted = [...filtered].sort((a, b) => Number(b.isWorking) - Number(a.isWorking));

//     return {
//       sorted,
//       total,
//       active: activeCars.length,
//       stopped: stoppedCars.length,
//       filtered
//     };
//   }, [allVehicles, search, status, violationCars]);

//   useEffect(() => {
//     onFilterChange(stats.filtered);
//   }, [stats.filtered]);

//   const pieData = [
//     { value: stats.active, color: COLORS.active },
//     { value: violationCount, color: COLORS.violations },
//     { value: stats.stopped, color: COLORS.inactive },
//   ];

//   return (
//     <View style={styles.container} pointerEvents="box-none">
//       {/* 1. SEARCH BAR */}
//       <View style={styles.searchWrapper}>
//         <View style={styles.searchInner}>
//           <TextInput
//             style={styles.input}
//             placeholder="Haritada ara"
//             placeholderTextColor="#999"
//             value={search}
//             onChangeText={setSearch}
//             onFocus={() => {
//               setIsFocused(true);
//               setIsMenuOpen(true);
//               setOpenedTab('All');
//             }}
//           />
//           <Search color="#999" size={20} />
//         </View>
//         <View style={styles.toggleRow}>
//           <Switch
//             value={showLabels}
//             onValueChange={(v) => { setShowLabels(v); onToggleLabels(v); }}
//             trackColor={{ false: COLORS.inactive, true: COLORS.primary }}
//             thumbColor={showLabels ? COLORS.primaryLight : COLORS.disabled}
//           />
//           <Text style={styles.toggleLabel}>Show Info</Text>
//         </View>
//       </View>

//       {/* 2. BLUE ACTION BAR */}
//       <View style={styles.actionsHeader}>
//         <TouchableOpacity style={styles.headerLeft} onPress={() => setIsMenuOpen(!isMenuOpen)}>
//           {isMenuOpen ? <ChevronUp color="white" size={20} /> : <ChevronDown color="white" size={20} />}
//           <Text style={styles.headerTitle}>Araç Listesi</Text>
//         </TouchableOpacity>

//         <View style={styles.headerIcons}>
//           <HeaderIcon icon='List' openedTab={openedTab} setOpenedTab={setOpenedTab} tabValue='All' />
//           <HeaderIcon icon='Network' openedTab={openedTab} setOpenedTab={setOpenedTab} tabValue='Groups' />
//           <TouchableOpacity
//             onPress={() => setOpenedTab(prev => prev === "Filters" ? null : 'Filters')}
//             style={[styles.iconBtn, openedTab === 'Filters' && styles.activeIcon, status !== 'All' && { backgroundColor: COLORS.primaryDark }]}
//           >
//             <Filter color="white" size={20} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* 3. CARD BODY (Content) */}
//       {isMenuOpen && (
//         <View style={styles.cardBody}>
//           {selectedVehicle ? (
//             /* --- DETAIL VIEW --- */
//             <View>
//               <TouchableOpacity onPress={handleBackToList} style={styles.backButton}>
//                 <ChevronLeft size={20} color={COLORS.primary} />
//                 <Text style={styles.backText}>Listeye Dön</Text>
//               </TouchableOpacity>
//               <VehicleCardDetailed item={selectedVehicle} />
//             </View>
//           ) : (
//             /* --- LIST VIEW --- */
//             <>
//               <Text style={styles.sectionLabel}>Genel Durum</Text>
//               <View style={styles.statsRow}>
//                 <View style={styles.chartBox}>
//                   <PieChart
//                     donut
//                     radius={45}
//                     innerRadius={30}
//                     data={pieData}
//                     centerLabelComponent={() => (
//                       <View style={{ alignItems: 'center' }}>
//                         <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{stats.total}</Text>
//                         <Text style={{ fontSize: 10, color: 'gray' }}>Toplam</Text>
//                       </View>
//                     )}
//                   />
//                 </View>
//                 <View style={styles.legendBox}>
//                   <LegendItem color={COLORS.active} label="Hareketli Araçlar" value={stats.active} />
//                   <LegendItem color={COLORS.violations} label="İhlalli Araçlar" value={violationCount} />
//                   <LegendItem color={COLORS.inactive} label="Duran Araçlar" value={stats.stopped} />
//                 </View>
//               </View>

//               <View style={styles.divider} />

//               {openedTab === 'All' && (
//                 <View style={{ maxHeight: 400 }}>
//                   {stats.sorted.length === 0 ? (
//                     <Text style={styles.emptyText}>Araç Bulunamadı</Text>
//                   ) : (
//                     <FlatList
//                       data={stats.sorted}
//                       nestedScrollEnabled={true}
//                       style={{ flexGrow: 0 }}
//                       contentContainerStyle={{ paddingBottom: 10 }}
//                       keyExtractor={(item, i) => `${item.plate}-${i}`}
//                       renderItem={({ item }) => (
//                         <VehicleCard
//                           address={item.address ?? "Adres Bilgisi Yok"}
//                           speed={item.speed}
//                           status={item.isWorking}
//                           plate={item.plate}
//                           violation={violationCars.includes(item.plate)}
//                           onPress={() => {
//                             setSelectedVehicle(item);
//                             onSelectVehicle(item.lat, item.lng);
//                             setIsFocused(false);
//                           }}
//                         />
//                       )}
//                     />
//                   )}
//                 </View>
//               )}

//               {openedTab === 'Groups' && (
//                 <ScrollView style={styles.treeView}>
//                   <View style={styles.treeItem}>
//                     <ChevronRight color="#999" size={16} />
//                     <Folder color="#90CAF9" size={18} fill="#90CAF9" style={{ marginHorizontal: 5 }} />
//                     <Text style={styles.treeText}>Hepsi ({stats.total})</Text>
//                   </View>
//                 </ScrollView>
//               )}

//               {openedTab === 'Filters' && (
//                 <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
//                   {['All', 'Active', 'Inactive'].map(s => (
//                     <TouchableOpacity
//                       key={s}
//                       style={[styles.chip, status === s && styles.activeChip]}
//                       onPress={() => { setStatus(s); setOpenedTab('All'); }}
//                     >
//                       <Text style={status === s ? styles.activeChipText : styles.chipText}>{s}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               )}
//             </>
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// // ChevronLeft icon fallback since it wasn't imported
// const ChevronLeft = ({ size, color }: { size: number, color: string }) => (
//   <View style={{ transform: [{ rotate: '180deg' }] }}>
//     <ChevronRight size={size} color={color} />
//   </View>
// );

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// const styles = StyleSheet.create({
//   container: { height: SCREEN_HEIGHT, position: 'absolute', top: 15, left: 15, right: 15, zIndex: 10 },
//   searchWrapper: { flexDirection: 'row', backgroundColor: 'white', padding: 8, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
//   searchInner: { flex: 1, backgroundColor: '#F1F3F4', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 6, height: 40 },
//   input: { flex: 1, fontSize: 14, color: '#333' },
//   actionsHeader: { backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, height: 48 },
//   headerLeft: { flexDirection: 'row', alignItems: 'center' },
//   headerTitle: { color: 'white', fontSize: 15, fontWeight: '600', marginLeft: 8 },
//   headerIcons: { flexDirection: 'row', alignItems: 'center' },
//   cardBody: { backgroundColor: 'white', padding: 15, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
//   sectionLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
//   statsRow: { flexDirection: 'row', alignItems: 'center' },
//   chartBox: { width: '40%', alignItems: 'center' },
//   legendBox: { width: '60%' },
//   divider: { height: 1, backgroundColor: '#EEE', marginVertical: 15 },
//   backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, paddingVertical: 5 },
//   backText: { color: COLORS.primary, fontSize: 14, fontWeight: '600', marginLeft: 4 },
//   toggleRow: { flexDirection: 'row', alignItems: 'center' },
//   toggleLabel: { fontSize: 12, marginLeft: 5, color: '#666' },
//   iconBtn: { padding: 8, marginLeft: 2 },
//   activeIcon: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 },
//   chipScroll: { marginTop: 10 },
//   chip: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#eee' },
//   activeChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
//   activeChipText: { color: 'white', fontWeight: 'bold' },
//   chipText: { color: '#444' },
//   treeView: { maxHeight: 150 },
//   treeItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
//   treeText: { fontSize: 14, color: '#333' },
//   emptyText: { textAlign: 'center', color: '#999', marginVertical: 20 }
// });

// export default MapSearchOverlay;


import { ReshapedData } from '@/components/Map/MapView';
import {
  Activity,
  AlertTriangle,
  Car,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Filter,
  Folder,
  Octagon,
  Scroll,
  Search
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PieChart } from "react-native-gifted-charts";

import HeaderIcon from '@/components/Map/MapSearchOverLay/HeaderIcon';
import LegendItem from '@/components/Map/MapSearchOverLay/LegendItem';
import VehicleCard from '@/components/Map/MapSearchOverLay/VehicleCard';
import { COLORS } from '@/constants';
import VehicleCardDetailed from '@/components/Map/MapSearchOverLay/VehicleCardDetailed';
import useDebounce from '@/hooks/useDebounce';
import { useTranslation } from 'react-i18next';


interface Props {
  allVehicles: ReshapedData[];
  violationCount: number; // Received from WebView via onMessage
  onSelectVehicle: (lat: number, lng: number) => void;
  onFilterChange: (filteredData: ReshapedData[]) => void;
  onToggleLabels: (enabled: boolean) => void; // Function to inject JS
}


interface Props {
  allVehicles: ReshapedData[];
  violationCount: number;
  violationCars: string[];
  onSelectVehicle: (lat: number, lng: number) => void;
  onFilterChange: (filteredData: ReshapedData[]) => void;
  onToggleLabels: (enabled: boolean) => void;
}

const MapSearchOverlay = ({ allVehicles, onSelectVehicle, onFilterChange, violationCount, onToggleLabels, violationCars }: Props) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [isFocused, setIsFocused] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openedTab, setOpenedTab] = useState<"All" | "Groups" | "Filters" | null>("All")
  const [selectedVehicle, setSelectedVehicle] = useState<ReshapedData | null>(null);
  const { t } = useTranslation()

  // 2. Create a back handler
  const handleBackToList = () => {
    setSelectedVehicle(null);
  };


  const debouncedSearchTerm = useDebounce({
    value: search,
    timeOut: 500
  });




  function checkStatus(status: string, item: ReshapedData) {
    if (status == "All") return true;
    else if (status == "Active") return item.isWorking;
    else if (status === 'Inactive') return !item.isWorking;
    else if (status == 'Violations') return violationCars.includes(item.plate)
  }


  // Stats Logic
  const stats = useMemo(() => {
    const totalCountOfVehicles = allVehicles.length;
    const activeVehiclesCount = allVehicles.filter(v => v.isWorking && !violationCars.includes(v.plate)).length;
    // const idle = 0; // violation olabilir bu
    const stoppedVehicleCount = totalCountOfVehicles - activeVehiclesCount - violationCount;

    const filtered = allVehicles.filter(v => {
      const matchesSearch = v.plate.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = checkStatus(status, v)
      // const matchesStatus = status === 'All' ? true : (status === 'Active' ? v.isWorking : !v.isWorking);
      // return matchesSearch;
      return matchesSearch && matchesStatus;
    });
    const sorted = [...filtered].sort((a, b) => Number(b.isWorking) - Number(a.isWorking));

    return { sorted, total: totalCountOfVehicles, active: activeVehiclesCount, stopped: stoppedVehicleCount, filtered };
  }, [allVehicles, debouncedSearchTerm, status, violationCount]);



  const statusFilterStrings = useMemo(() => {
    return [
      // , , , 
      {
        value: 'All',
        label: "common.allVehicles",
      },
      {
        value: "Active",
        label: "common.movingVehicles",
      },
      {
        value: "Inactive",
        label: "common.stationaryVehicles",
      },
      {
        value: "Violations",
        label: "common.violatingVehicles",
      },
    ]
  }, [])













  //! change class or search trigger this
  useEffect(() => {
    onFilterChange(stats.filtered);
  }, [stats.filtered]);

  // Chart Data
  const pieData = [
    { value: stats.active, color: COLORS.active }, // Moving
    { value: violationCount, color: COLORS.violations },   // Idle
    { value: stats.stopped, color: COLORS.inactive }, // Stopped
  ];

  return (
    <View style={styles.container} pointerEvents="box-none">

      {/* 1. SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchInner}>
          <TextInput
            style={styles.input}
            placeholder={t('common.search')}
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            onFocus={() => {
              setIsFocused(true)
              setIsMenuOpen(true)
              setOpenedTab('All')
            }}
          />
          <Search color="#999" size={20} />

        </View>
        <View style={styles.toggleRow}>
          <Switch
            value={showLabels}
            onValueChange={(v) => { setShowLabels(v); onToggleLabels(v); }}
            trackColor={{ false: COLORS.inactive, true: COLORS.primary }}
            thumbColor={showLabels ? COLORS.primaryLight : COLORS.disabled}
            ios_backgroundColor={COLORS.inactive}
          />
          <Text style={styles.toggleLabel}>{t('common.showInfo')}</Text>
        </View>
      </View>

      {/* 2. BLUE ACTION BAR */}
      <View style={styles.actionsHeader}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen && <ChevronUp color="white" size={20} />}
          {!isMenuOpen && <ChevronDown color="white" size={20} />}
          <Text style={styles.headerTitle}>{t("common.vehiclesList")}</Text>
        </TouchableOpacity>

        <View style={[styles.headerIcons
        ]}>


          <HeaderIcon icon='List' openedTab={openedTab} setOpenedTab={setOpenedTab} tabValue='All' />

          {/* TODO : WHEN GROUPS ADDED UNCOMMENT THIS  */}
          {/* <HeaderIcon icon='Network' openedTab={openedTab} setOpenedTab={setOpenedTab} tabValue='Groups' /> */}

          {/* <TouchableOpacity style={styles.iconBtn}><Car color="white" size={20} /></TouchableOpacity> */}

          {/* TODO : REMOVE SELECTED VEHICLE WHEN APPLY FILTER */}
          <TouchableOpacity
            onPress={() => {

              setOpenedTab(prev => prev === "Filters" ? null : 'Filters')
            }}


            style={[styles.iconBtn, openedTab === 'Filters' && styles.activeIcon, status !== 'All' && { backgroundColor: COLORS.primaryDark }]}><Filter color="white" size={20} /></TouchableOpacity>
        </View>
      </View>

      {/* 3. GENEL DURUM CARD (Content) */}
      {isMenuOpen && (
        <View style={styles.cardBody}>
          <Text style={styles.sectionLabel}>{t("common.generalSituation")}</Text>

          <View style={styles.statsRow}>
            {/* Donut Chart */}
            <View style={styles.chartBox}>
              <PieChart
                donut
                radius={45}
                innerRadius={30}
                data={pieData}
                centerLabelComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{stats.total}</Text>
                    <Text style={{ fontSize: 10, color: 'gray' }}>{t("common.total")}</Text>
                  </View>
                )}
              />
            </View>

            {/* Legend List */}
            <View style={styles.legendBox}>
              <LegendItem
                color={COLORS.active}
                label="common.movingVehicles"
                value={stats.active}
                icon={Activity}
              />

              {/* Violation / Alert */}
              <LegendItem
                color={COLORS.violations}
                label="common.violatingVehicles"
                value={violationCount}
                icon={AlertTriangle}
              />

              {/* Stopped / Inactive */}
              <LegendItem
                color={COLORS.inactive}
                label="common.stationaryVehicles"
                value={stats.stopped}
                icon={Octagon}
              />

              {/* Optional: Total Vehicles */}
              <LegendItem
                color={COLORS.primary}
                label="common.totalVehicles"
                value={stats.total}
                icon={Car}
              />
            </View>
          </View>

          <View style={styles.divider} />


          {/* All Vehicles  */}
          {openedTab === 'All' && (
            /* This View needs to be the one constraining the size */
            <View style={{ maxHeight: 350 }}>


              {(selectedVehicle) ? (
                <ScrollView

                  style={{ marginBottom: 25 }}


                >
                  <TouchableOpacity
                    onPress={handleBackToList}
                    style={styles.backButton}
                  >
                    <ChevronRight size={20} color={COLORS.primary} style={{ transform: [{ rotate: '180deg' }] }} />
                    <Text style={styles.backText}>{t("common.returnToList")}</Text>
                  </TouchableOpacity>
                  <VehicleCardDetailed item={selectedVehicle} />
                </ScrollView>
              ) : stats.sorted.length == 0 ? <Text>
                No Elements
              </Text> : (
                <FlatList
                  data={stats.sorted}
                  nestedScrollEnabled={true}
                  style={{ flexGrow: 0 }}
                  contentContainerStyle={{ paddingBottom: 10 }}
                  keyExtractor={(item) => item.plate} // Always good practice to include a key
                  renderItem={({ item }) => {
                    // 1. Logic goes here, before the return
                    const isViolation = violationCars.includes(item.plate);

                    return (
                      <VehicleCard
                        address={item.address }
                        speed={item.speed}
                        status={item.isWorking}
                        plate={item.plate}
                        violation={isViolation}
                        onPress={() => {
                          setSelectedVehicle(item);
                          onSelectVehicle(item.lat, item.lng);
                          setIsFocused(false);
                          // setIsMenuOpen(false);
                          // setSelectedVehicle(null)
                        }}
                      />
                    );
                  }}
                />
              )

              }





            </View>
          )}

          {/* Hierarchical Group List Groups 
          TODO : when groups get added unComment this 
          */}
          {/* {openedTab === 'Groups' &&
            <>
              <View style={[styles.groupHeader, { borderWidth: 2, borderColor: 'red' }]}>
                <Text style={styles.vehicleCountText}>{stats.filtered.length} Araç</Text>

              </View>

              <ScrollView style={styles.treeView}>
                <View style={styles.treeItem}>
                  <ChevronRight color="#999" size={16} />
                  <Folder color="#90CAF9" size={18} fill="#90CAF9" style={{ marginHorizontal: 5 }} />
                  <Text style={styles.treeText}>Hepsi</Text>
                </View>
                <View style={[styles.treeItem, { marginLeft: 20 }]}>
                  <ChevronRight color="#999" size={16} />
                  <Folder color="#BDBDBD" size={18} fill="#BDBDBD" style={{ marginHorizontal: 5 }} />
                  <Text style={styles.treeText}>Grupsuzlar ({stats.total})</Text>
                </View>
              </ScrollView>
            </>
          } */}
          {openedTab === 'Filters' &&
            <>
              <View style={[styles.groupHeader]}>
                <Text style={styles.vehicleCountText}>{stats.filtered.length} Araç</Text>

              </View>

              {/* --- Filter Chips (Horizontal Scroll) --- */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {statusFilterStrings.map(filterString => (

                  <TouchableOpacity
                    key={filterString.value}
                    style={[styles.chip, status === filterString.value && styles.activeChip]}
                    onPress={() => {
                      setStatus(filterString.value)
                      setOpenedTab('All')
                      setSelectedVehicle(null)
                    }
                    }
                  >
                    <Text style={status === filterString.value ? styles.activeChipText : styles.chipText}>{t(filterString.label)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          }


        </View>
      )}

    </View>
  );
};


const { height: SCREEN_HEIGHT } = Dimensions.get('window');
console.log(SCREEN_HEIGHT)
const styles = StyleSheet.create({
  container: {

    height: SCREEN_HEIGHT,
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    zIndex: 10,
  },
  searchWrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  searchInner: {
    flex: 1,
    backgroundColor: '#F1F3F4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 6,
    height: 40,
  },
  input: { flex: 1, fontSize: 14, color: '#333' },
  actionsHeader: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 15, fontWeight: '600', marginLeft: 8 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },

  cardBody: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sectionLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  chartBox: { width: '40%', alignItems: 'center' },
  legendBox: { width: '60%' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  legendVal: { fontWeight: 'bold', width: 20, fontSize: 13 },
  legendLab: { fontSize: 11, color: '#777' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 15 },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  vehicleCountText: { fontWeight: 'bold', fontSize: 15 },
  toggleRow: { flexDirection: 'row', alignItems: 'center' },
  toggleLabel: { fontSize: 12, marginLeft: 5, color: '#666' },
  treeView: { maxHeight: 150 },
  treeItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  treeText: { fontSize: 14, color: '#333' },
  resultsOverlay: {
    backgroundColor: 'white',
    marginTop: 5,
    borderRadius: 8,
    maxHeight: 250,
    elevation: 10,
  },
  iconBtn: {
    padding: 8,
    marginLeft: 2
  },
  activeIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4
  },
  chipScroll: { marginTop: 10 },
  chip: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  activeChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  activeChipText: { color: 'white', fontWeight: 'bold' },
  chipText: { color: '#444' },
  resultItem: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center' },
  resultTitle: { fontWeight: '600', fontSize: 14 },
  resultSub: { fontSize: 11, color: COLORS.inactive },


  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Ensure VehicleDetailCard fits inside the scrollable area if needed
  detailWrapper: {
    maxHeight: 500, // Adjust based on screen size
  }
});


// // TODO : AFTER GIVE THE DECISION ABOUT THE FINAL SHAPE OF RESHAPEDATA INTERFACE PUT IN TYPES FOLDER AND IMPORT IT HERE AND USE IT IN PLACE OF ANY NOW IS IN MAPVEIW
// // const MapSearchOverlay = ({ allVehicles, onSelectVehicle, onFilterChange, violationCount, onToggleLabels }: Props) => {
// //   const [search, setSearch] = useState('');
// //   const [category, setCategory] = useState('All'); // e.g., 'Truck', 'Sedan', 'Van'
// //   const [status, setStatus] = useState('All'); // 'All', 'Active', 'Inactive'
// //   const [isFocused, setIsFocused] = useState(false);
// //   const [showLabels, setShowLabels] = useState(false);



// //   const handleToggleLabels = (value: boolean) => {
// //     setShowLabels(value);
// //     onToggleLabels(value);
// //   };




// //   const { allVehicleCount, activeVehiclesCount, filteredData } = useMemo(() => {
// //     const total = allVehicles.length;
// //     const active = allVehicles.filter(item => item.isWorking).length;

// //     const filtered = allVehicles.filter(v => {
// //       const matchesSearch = v.plate.toLowerCase().includes(search.toLowerCase());
// //       const matchesStatus = status === 'All' ? true : (status === 'Active' ? v.isWorking : !v.isWorking);
// //       return matchesSearch && matchesStatus;
// //     });

// //     return {
// //       allVehicleCount: total,
// //       activeVehiclesCount: active,
// //       filteredData: filtered
// //     };
// //   }, [allVehicles, search, status]); // Dependencies are now clear

// //   // 2. Sync with Parent (WebView)
// //   useEffect(() => {
// //     onFilterChange(filteredData);
// //   }, [filteredData, onFilterChange]);



// //   return (
// //     <View style={styles.container}>

// //       {/* Status Bar  */}
// //       <View style={styles.statsBar}>
// //         <View style={styles.statItem}>
// //           <Text style={styles.statValue}>{allVehicleCount}</Text>
// //           {/* <Text style={styles.statValue}>{stats.totalCount}</Text> */}
// //           <Text style={styles.statLabel}>Vehicles</Text>
// //         </View>
// //         <View style={styles.statItem}>
// //           <Text style={styles.statValue}>{activeVehiclesCount}</Text>
// //           {/* <Text style={styles.statValue}>{stats.activeCount}</Text> */}
// //           <Text style={styles.statLabel}>Active</Text>
// //         </View>
// //         <View style={styles.statItem}>
// //           <Text style={[styles.statValue, { color: '#FF3B30' }]}>{violationCount}</Text>
// //           {/* <Text style={[styles.statValue, { color: '#FF3B30' }]}>{offPlatesCount}</Text> */}
// //           <Text style={styles.statLabel}>Violations</Text>
// //         </View>
// //         <View style={styles.toggleSection}>
// //           <Switch
// //             value={showLabels}
// //             // value={true}
// //             onValueChange={handleToggleLabels}

// //             trackColor={{ false: "#D1D1D6", true: "#34C759" }}
// //           />
// //           <Text style={styles.statLabel}>Show Info</Text>
// //         </View>
// //       </View>
// //       {/* --- Search Bar --- */}
// //       <View style={styles.searchBox}>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Search Plate or Serial..."
// //           placeholderTextColor={'#ddd'}
// //           value={search}
// //           onChangeText={setSearch}
// //           onFocus={() => setIsFocused(true)}
// //         />
// //         {isFocused && (
// //           <TouchableOpacity onPress={() => { setIsFocused(false); setSearch(''); }}>
// //             <Text style={{ color: '#999' }}>Close</Text>
// //           </TouchableOpacity>
// //         )}
// //       </View>



// //       {/* --- Search Results (The "San Francisco" List) --- */}
// //       {isFocused && search.length > 0 && (
// //         <View style={styles.resultsContainer}>
// //           <FlatList
// //             data={filteredData.slice(0, 5)}
// //             keyExtractor={item => item.serialNumber}
// //             renderItem={({ item }) => (
// //               <TouchableOpacity
// //                 style={styles.resultItem}
// //                 onPress={() => {
// //                   onSelectVehicle(item.lat, item.lng);
// //                   setIsFocused(false);
// //                 }}
// //               >
// //                 <Text style={styles.resultText}>{item.plate}</Text>
// //                 <Text style={styles.resultSubtext}>{item.isWorking ? '🟢 Active' : '🔴 Offline'}</Text>
// //               </TouchableOpacity>
// //             )}
// //           />
// //         </View>
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   statsBar: {
// //     backgroundColor: 'white',
// //     flexDirection: 'row',
// //     paddingVertical: 15,
// //     borderRadius: 18,
// //     elevation: 12,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: -4 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 12,
// //     justifyContent: 'space-around',
// //     alignItems: 'center',
// //   },
// //   statItem: { alignItems: 'center' },
// //   statValue: { fontSize: 20, fontWeight: '800', color: '#1C1C1E' },
// //   statLabel: { fontSize: 11, color: '#8E8E93', marginTop: 2, fontWeight: '600' },
// //   toggleSection: {
// //     borderLeftWidth: 1,
// //     borderLeftColor: '#F2F2F7',
// //     paddingLeft: 15,
// //     alignItems: 'center'
// //   },
// //   container: {
// //     position: 'absolute',
// //     top: 15, // Adjust for status bar
// //     left: 20,
// //     right: 20,
// //     zIndex: 10,
// //   },
// //   searchBox: {
// //     backgroundColor: 'white',
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 15,
// //     borderRadius: 12,
// //     height: 50,
// //     // Shadow for iOS/Android
// //     elevation: 5,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.2,
// //   },
// //   input: { flex: 1, fontSize: 16 },
// //
// //   resultsContainer: {
// //     backgroundColor: 'white',
// //     marginTop: 5,
// //     borderRadius: 12,
// //     maxHeight: 300,
// //     overflow: 'hidden'
// //   },
// //   resultItem: {
// //     padding: 15,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#eee'
// //   },
// //   resultText: { fontSize: 16, fontWeight: '600' },
// //   resultSubtext: { fontSize: 12, color: '#666' }
// // });


export default MapSearchOverlay