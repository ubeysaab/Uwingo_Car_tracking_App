import ImageUploader from '@/components/ImageUploader';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LucideIconButton from '@/components/IconButton/LucideIconButton';
import { ColumnConfig } from '@/components/ResponsiveTable/types';
import { useTranslation } from 'react-i18next';
interface ResponsiveTableRowProps<T> {
  item: T;
  expandedId: string | number | null;
  toggleExpand: (id: any) => void;
  visibleColumns: ColumnConfig<T>[];
  hiddenColumns: ColumnConfig<T>[];
  uniqueKey: keyof T;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

// todo : T extends Record<string, any> fixes the "indexing type unknown" error
const ResponsiveTableRow = <T extends Record<string, any>>({
  item,
  expandedId,
  toggleExpand,
  visibleColumns,
  hiddenColumns,
  uniqueKey,
  onEdit,
  onDelete,
}: ResponsiveTableRowProps<T>) => {
  const isExpanded = expandedId === item[uniqueKey];
  const isDeleted = item?.terminationDate
  const hasImages: boolean = Object.keys(item).includes('images')
  const { t } = useTranslation()

  return (
    <View style={styles.rowContainer}>
      <View style={styles.visibleRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => toggleExpand(item[uniqueKey])}
        >
          <Text style={styles.buttonText}>{isExpanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {visibleColumns.map((col: ColumnConfig<T>, i: number) => (
          <Text key={`${String(col.key)}-${i}`} style={[styles.cell, { flex: 1 }]}>
            {String(item[col.key] ?? '')}
          </Text>
        ))}
      </View>

      {isExpanded && (
        <View style={styles.dropdown}>
          {/* Render Hidden Fields */}
          {hiddenColumns.map((col: ColumnConfig<T>) => (
            <View key={String(col.key)} style={styles.detailItem}>
              <Text style={styles.label}>{t(col.label)}:</Text>
              <Text style={styles.value}>{t(String(item[col.key]).toLowerCase()) ?? t('N/A')}</Text>
            </View>
          ))}

          {/* Action Buttons Section */}
          {!isDeleted && (<>
            <View style={styles.actionContainer}>

              <LucideIconButton
                icon='Pencil'
                containerColor={"#007AFF"}
                onPress={() => onEdit?.(item)}
                text={t('common.edit')}
              />
              <LucideIconButton
                icon='Trash2'
                containerColor={"#FF3B30"}
                onPress={() => onDelete?.(item)}
                text={t('common.delete')}
              />
            </View>
            {hasImages && (<View><ImageUploader /></View>)}
          </>
          )}
        </View>
      )}
    </View>
  );
};
export default ResponsiveTableRow;

const styles = StyleSheet.create({
  rowContainer: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  visibleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  cell: { fontSize: 14 },
  button: { width: 40, alignItems: 'center' },
  buttonText: { color: '#007AFF', fontWeight: 'bold' },
  dropdown: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginHorizontal: 10, marginBottom: 10 },
  detailItem: { flexDirection: 'row', marginBottom: 8, alignItems: 'center', gap: 5 },
  label: { fontWeight: '600', color: '#666', },
  value: { color: '#222', flex: 1 },

  // New Styles for Action Buttons
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    gap: 10,
  },

});