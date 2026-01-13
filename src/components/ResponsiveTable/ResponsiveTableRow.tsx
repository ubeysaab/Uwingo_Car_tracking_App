import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native'; // Import Lucide Icons
import { ColumnConfig } from './types';
import LucideIconButton from '../IconButton/LucideIconButton';

interface ResponsiveTableRowProps<T> {
  item: T;
  expandedId: string | number | null;
  toggleExpand: (id: any) => void;
  visibleColumns: ColumnConfig<T>[];
  hiddenColumns: ColumnConfig<T>[];
  uniqueKey: keyof T;
  onEdit: (item: T) => void;   // Added Edit Callback
  onDelete: (item: T) => void; // Added Delete Callback
  sendDataAsStrings?: boolean;
}

// T extends Record<string, any> fixes the "indexing type unknown" error
const ResponsiveTableRow = <T extends Record<string, any>>({
  item,
  expandedId,
  toggleExpand,
  visibleColumns,
  hiddenColumns,
  uniqueKey,
  onEdit,
  onDelete,
  sendDataAsStrings = false
}: ResponsiveTableRowProps<T>) => {
  const isExpanded = expandedId === item[uniqueKey];
  const isDeleted = item?.terminationDate

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
              <Text style={styles.label}>{col.label}:</Text>
              <Text style={styles.value}>{String(item[col.key] ?? 'N/A')}</Text>
            </View>
          ))}

          {/* Action Buttons Section */}
          {!isDeleted &&
            (<View style={styles.actionContainer}>
              {/* <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEdit?.(item)}
            >
              <Pencil size={18} color="#FFF" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity> */}

              <LucideIconButton
                icon='Pencil'
                containerColor={"#007AFF"}
                onPress={() => onEdit?.(item)}
                text={'Edit'}
              // disabled={item?.terminationDate}
              />

              {/* <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete?.(item)}
            >
              <Trash2 size={18} color="#FFF" />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity> */}
              <LucideIconButton
                icon='Trash2'
                containerColor={"#FF3B30"}
                onPress={() => onDelete?.(item)}
                text={'Delete'}
              // disabled={item?.terminationDate}
              />
            </View>
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
  detailItem: { flexDirection: 'row', marginBottom: 8 },
  label: { fontWeight: '600', width: 100, color: '#666' },
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  editButton: { backgroundColor: '#007AFF' },
  deleteButton: { backgroundColor: '#FF3B30' },
  actionButtonText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
});