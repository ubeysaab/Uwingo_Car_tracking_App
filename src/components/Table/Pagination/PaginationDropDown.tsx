import { ColorValue, StyleSheet } from "react-native";
import IconButton from "@/components/IconButton/LucideIconButton";
import { Menu } from "@/components/Menu/Menu";
import React from "react";



type PaginationDropdownProps = {
  /**
   * The current number of rows per page.
   */
  numberOfItemsPerPage?: number;
  /**
   * Options for a number of rows per page to choose from.
   */
  numberOfItemsPerPageList?: Array<number>;
  /**
   * The function to set the number of rows per page.
   */
  onItemsPerPageChange?: (numberOfItemsPerPage: number) => void;
  /**
   * Color of the dropdown item ripple effect.
   */
  dropdownItemRippleColor?: ColorValue;
  /**
   * Color of the select page dropdown ripple effect.
   */
  selectPageDropdownRippleColor?: ColorValue;
  /**
   * @optional
   */
};







const PaginationDropdown = ({
  numberOfItemsPerPageList,
  numberOfItemsPerPage,
  onItemsPerPageChange,
  selectPageDropdownRippleColor,
  dropdownItemRippleColor,
}: PaginationDropdownProps) => {
  // const theme = useInternalTheme(themeOverrides);
  // const { colors } = theme;
  const [showSelect, setShowSelect] = React.useState<boolean>(false);

  return (
    <Menu
      visible={showSelect}
      onDismiss={() => setShowSelect(!showSelect)}

      anchor={
        <IconButton
          // mode="outlined"
          onPress={() => setShowSelect(true)}

          icon="ChevronDown"
          style={[styles.contentStyle, styles.button]}
          text={numberOfItemsPerPage}
        // theme={theme}
        // rippleColor={selectPageDropdownRippleColor}
        />


      }
    >
      {numberOfItemsPerPageList?.map((option) => (
        <Menu.Item
          title={option}
          key={`MenuItem-${option}`}

          onPress={() => {
            onItemsPerPageChange?.(option);
            setShowSelect(false);
          }}



        />
      ))}
    </Menu>
  );
};


const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    flexWrap: 'wrap',
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 12,
    marginRight: 16,
  },
  button: {
    textAlign: 'center',
    marginRight: 16,
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  contentStyle: {
    flexDirection: 'row-reverse',
  },
});



export default PaginationDropdown