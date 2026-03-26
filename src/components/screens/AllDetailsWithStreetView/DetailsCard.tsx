import Speedometer from "@/components/screens/AllDetailsWithStreetView/Speedometer";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

const DetailsCard = ({ item }: { item: any }) => {
  const { t } = useTranslation();
  const isSpeedCard = item.title.toLowerCase().includes("speed");
  const speedValue = parseFloat(item.value) || 0;







  // Helper to handle translated values
  const displayValue = ["yes", "no", "N/A"].includes(item?.value)
    ? t(`common.${item.value}`)
    : item.value;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* Left Side: Icon and Title */}
        <View style={styles.headerLeft}>
          {isSpeedCard && <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>
              {t(item.title).charAt(0).toUpperCase()}
            </Text>
          </View>}
          <Text style={styles.cardTitle}>{t(item.title)} :</Text>
        </View>

        {/* Right Side: Value (Visible only if not a speed card, or as a small label) */}
        {!isSpeedCard && (
          <Text style={styles.headerValue}>{displayValue}</Text>
        )}
      </View>

      {isSpeedCard && (
        <View style={styles.speedometerContainer}>
          <Speedometer value={speedValue} />
          <Text style={styles.speedText}>{displayValue}</Text>
        </View>
      )}
    </View>
  );
};

export default DetailsCard;



const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 8,
    // borderRadius: 16,
    // marginBottom: 16,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 8,
    // elevation: 3,
    // borderWidth: 1,
    // borderColor: '#f1f3f5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  headerValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  speedometerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  speedText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginTop: -10, // Adjust based on your Speedometer's internal padding
  },

  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  // card: {
  //   backgroundColor: '#ffffff',
  //   borderRadius: 16,
  //   padding: 20,
  //   marginBottom: 16,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.05,
  //   shadowRadius: 8,
  //   elevation: 2,
  //   borderWidth: 1,
  //   borderColor: '#f1f3f5',
  // },
  // cardHeader: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: 12,
  // },
  // cardIcon: {
  //   width: 36,
  //   height: 36,
  //   borderRadius: 10,
  //   backgroundColor: 'rgba(59, 130, 246, 0.1)',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginRight: 12,
  // },
  // cardIconText: {
  //   fontSize: 16,
  //   fontWeight: '700',
  //   color: '#3b82f6',
  // },
  // cardTitle: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   color: '#495057',
  //   // flex: 1,
  // },
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
    // borderRadius: 8,
  },
  cardActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    // borderRadius: 16,
    padding: 24,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    // shadowRadius: 8,
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
  }
})