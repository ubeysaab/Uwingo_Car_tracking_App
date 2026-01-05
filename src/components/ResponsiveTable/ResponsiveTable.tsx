import React, { useMemo, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import ResponsiveTableRow from './ResponsiveTableRow';

const PAGE_SIZE = 10;

const ResponsiveTable = ({ data = [], columns = [], uniqueKey, handleEdit, handleDelete }: { data: any[], columns: any[], uniqueKey: string, handleEdit: (item: any) => void, handleDelete: (id: any) => void }) => {

  // States 
  const [containerWidth, setContainerWidth] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE);

  // Event listener
  const onLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };


  // function to  determine how many columns to show based on width
  const { visibleColumns, hiddenColumns } = useMemo(() => {
    let showCount;
    if (containerWidth > 600) showCount = 3;      // Large: show 0, 1, 2
    else if (containerWidth > 400) showCount = 2; // Medium: show 0, 1

    return {
      visibleColumns: columns.slice(0, showCount),
      hiddenColumns: columns.slice(showCount),
    };
  }, [containerWidth, columns]);



  const processedData = useMemo(() => {
    return data.reverse().filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);



  console.log(`from the table component data :  `, data)
  console.log(`from the table component  columns : `, columns)

  return (
    <View style={styles.container} onLayout={onLayout}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        onChangeText={(t) => { setSearchQuery(t); setDisplayLimit(PAGE_SIZE); }}
      />

      <View style={styles.header}>
        <View style={{ width: 40 }} />
        {visibleColumns.map((col) => (
          <Text key={col.key} style={[styles.headerCell, { flex: 1 }]}>
            {col.label}
          </Text>
        ))}
      </View>

      <FlatList
        data={processedData.slice(0, displayLimit)}
        keyExtractor={(item, index) => item[uniqueKey].toString() || index.toString()}
        renderItem={({ item }) => (
          <ResponsiveTableRow
            onDelete={handleDelete}
            onEdit={handleEdit}
            item={item}
            uniqueKey={uniqueKey}
            expandedId={expandedId}
            toggleExpand={(id: any) => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setExpandedId(expandedId === id ? null : id);
            }}
            visibleColumns={visibleColumns}
            hiddenColumns={hiddenColumns}
          />
        )}
        onEndReached={() => setDisplayLimit(prev => prev + PAGE_SIZE)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 10,

  },

  // Search Input Style
  searchInput: {
    height: 45,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fcfcfc',
    fontSize: 16,
    color: '#333',
  },

  // Table Header
  header: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    paddingBottom: 12,
    alignItems: 'center'
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },

  // Row Styles
  rowContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  visibleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18
  },
  cell: {
    fontSize: 15,
    color: '#2c3e50'
  },

  // Expansion Button
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold'
  },

  // Dropdown / Expanded Content
  dropdown: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF'
  },
  detailItem: {
    flexDirection: 'row',
    paddingVertical: 4
  },
  label: {
    fontWeight: '700',
    width: 100,
    color: '#7f8c8d',
    fontSize: 13
  },
  value: {
    flex: 1,
    color: '#34495e',
    fontSize: 14
  },

  // Footer / Pagination Styles
  footerText: {
    textAlign: 'center',
    color: '#bdc3c7',
    paddingVertical: 25,
    fontSize: 14,
    fontStyle: 'italic'
  }
});

export default ResponsiveTable;