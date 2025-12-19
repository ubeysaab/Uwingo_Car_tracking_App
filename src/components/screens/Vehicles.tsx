// import Table from "../Table"


import * as React from 'react';
import DataTable from '@/components/Table/DataTable';





const MyComponent = () => {
  const [pageNumber, setPageNumber] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 20, 50, 100]); // static just for don't leak memory between render wake it a state
  const [itemsPerPage, setItemsPerPage] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const [items] = React.useState([
    {
      key: 1,
      name: 'Cupcake',
      calories: 356,
      fat: 16,
    },
    {
      key: 2,
      name: 'Eclair',
      calories: 262,
      fat: 16,
    },
    {
      key: 3,
      name: 'Frozen yogurt',
      calories: 159,
      fat: 6,
    },
    {
      key: 4,
      name: 'Gingerbread',
      calories: 305,
      fat: 3.7,
    },
    {
      key: 5,
      name: 'asdf',
      calories: 305,
      fat: 3.7,
    },
    {
      key: 6,
      name: 'fd',
      calories: 305,
      fat: 3.7,
    },
    {
      key: 7,
      name: 'eg',
      calories: 305,
      fat: 3.7,
    },
    {
      key: 8,
      name: 'ej',
      calories: 305,
      fat: 3.7,
    },
    {
      key: 9,
      name: 'ehbhb',
      calories: 305,
      fat: 3.7,
    },
  ]);

  const from = pageNumber * itemsPerPage;
  const to = Math.min((pageNumber + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPageNumber(0);
  }, [itemsPerPage]);

  return (

    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Dessert</DataTable.Title>
        <DataTable.Title numeric>Calories</DataTable.Title>
        <DataTable.Title numeric>Fat</DataTable.Title>
      </DataTable.Header>



      {/* TODO : HEADER COLOR IS GONNA BE DIFFERENT  */}
      {items.slice(from, to).map((item) => (
        <DataTable.Row key={item.key}>
          <DataTable.Cell>{item.name}</DataTable.Cell>
          <DataTable.Cell numeric>{item.calories}</DataTable.Cell>
          <DataTable.Cell numeric>{item.fat}</DataTable.Cell>
        </DataTable.Row>
      ))}





      <DataTable.Pagination
        page={pageNumber}
        numberOfPages={Math.ceil(items.length / itemsPerPage)}
        onPageChange={(page) => setPageNumber(page)}
        label={`${from + 1}-${to} of ${items.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
    </DataTable>
  );
};

// export default MyComponent;

function Vehicles() {
  return (
    <>
      <MyComponent />
    </>
  )
}

export default Vehicles