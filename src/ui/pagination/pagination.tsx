import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import { useState, useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  useEffect(() => {
    setButtons(displayButtons(currentPage));
  }, [currentPage, totalItems]);

  const [page, setPage] = useState<number>(currentPage);
  const [buttons, setButtons] = useState<Array<JSX.Element>>();

  const handlePageChange = (page: number): void => {
    setPage(page);
    setButtons(displayButtons(page));
    onPageChange && onPageChange(page);
  };

  const numberOfPages = (): number => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  const displayButtons = (currentPage: number): Array<JSX.Element> => {
    let buttons: string[] = [];

    if (currentPage < 3) {
      buttons = ["2", "3", "4", "5", "..."];
    } else if (currentPage >= numberOfPages() - 3) {
      buttons = [
        "...",
        (numberOfPages() - 3).toString(),
        (numberOfPages() - 2).toString(),
        (numberOfPages() - 1).toString(),
      ];
    } else {
      buttons = [
        "...",
        (currentPage - 1).toString(),
        currentPage.toString(),
        (currentPage + 1).toString(),
        (currentPage + 2).toString(),
        (currentPage + 3).toString(),
        "...",
      ];
    }
    return buttons.map((pageNumber) => (
      <IconButton
        variant="outlined"
        color={currentPage === Number(pageNumber) - 1 ? "primary" : "neutral"}
        onClick={() => handlePageChange(Number(pageNumber) - 1)}
      >
        {pageNumber}
      </IconButton>
    ));
  };

  return (
    <>
      <IconButton
        variant="outlined"
        disabled={page === 0}
        onClick={() => handlePageChange(page - 1)}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        variant="outlined"
        color={page === 0 ? "primary" : "neutral"}
        onClick={() => handlePageChange(0)}
      >
        1
      </IconButton>
      {buttons}
      <IconButton
        variant="outlined"
        color={page === numberOfPages() - 1 ? "primary" : "neutral"}
        onClick={() => handlePageChange(numberOfPages() - 1)}
      >
        {numberOfPages()}
      </IconButton>
      <IconButton
        variant="outlined"
        disabled={totalItems !== -1 ? page >= numberOfPages() - 1 : false}
        onClick={() => handlePageChange(page + 1)}
      >
        <KeyboardArrowRight />
      </IconButton>
    </>
  );
};

export default Pagination;
