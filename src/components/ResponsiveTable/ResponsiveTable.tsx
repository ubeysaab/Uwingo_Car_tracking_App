import { useMemo, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import ResponsiveTableRow from '@/components/ResponsiveTable/ResponsiveTableRow';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 20;

const ResponsiveTable = ({ data = [], columns = [], uniqueKey, handleEdit, handleDelete }: { data: any[], columns: any[], uniqueKey: string, handleEdit: (item: any) => void, handleDelete: (id: any) => void }) => {



  const { t, i18n } = useTranslation();
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



  return (
    <View style={styles.container} onLayout={onLayout}>
      <TextInput

        style={styles.searchInput}
        placeholder={t('common.search')}
        placeholderTextColor="#999"
        onChangeText={(t) => { setSearchQuery(t); setDisplayLimit(PAGE_SIZE); }}
      />

      <View style={styles.header}>
        <View style={{ width: 40 }} />
        {visibleColumns.map((col) => (
          <Text key={col.key} style={[styles.headerCell, { flex: 1 }]}>
            {t(col['label'])}
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

});

export default ResponsiveTable;