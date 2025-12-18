import { ColorValue } from "react-native";
import IconButton from "../../IconButton/IconButton";
import { onumber } from "zod/v3";









type PaginationControlsProps = {
  /**
   * The currently visible page (starting with 0).
   */
  page: number;
  /**
   * The total number of pages.
   */
  numberOfPages: number;
  /**
   * Function to execute on page change.
   */
  onPageChange: (page: number) => void;
  /**
   * Whether to show fast forward and fast rewind buttons in pagination. False by default.
   */
  showFastPaginationControls?: boolean;
  /**
   * Color of the pagination control ripple effect.
   */
  paginationControlRippleColor?: ColorValue;
  /**
   * @optional
   */
};











const PaginationControls = ({
  page,
  numberOfPages: lastPage,
  onPageChange,
  showFastPaginationControls,

  paginationControlRippleColor,
}: PaginationControlsProps) => {
  // const theme = useInternalTheme(themeOverrides);

  // const textColor = theme.isV3 ? theme.colors.onSurface : theme.colors.text;





  function goToThePreviousPage(page: number) {
    if (page > 0) {
      onPageChange(page - 1)
    }
    return;
  }


  function goToTheNextPage(page: number) {
    if (page < lastPage - 1) {
      onPageChange(page + 1)
    }
    return;
  }







  return (
    <>
      {showFastPaginationControls ? (
        <IconButton
          icon="ChevronFirst"
          onPress={() => onPageChange(0)}
        />
      )

        : null}
      <IconButton
        icon="ChevronLeft"
        onPress={() => goToThePreviousPage(page)}
      />
      <IconButton
        icon="ChevronRight"
        onPress={() => goToTheNextPage(page)}

      />
      {showFastPaginationControls ? (
        <IconButton
          icon="ChevronLast"
          onPress={() => onPageChange(lastPage - 1)}
        />
      ) : null}
    </>
  );
};


export default PaginationControls