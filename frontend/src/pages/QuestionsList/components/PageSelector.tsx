import React from "react";

type PageSelectorProps = {
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const PAGES_TO_SHOW = 5;

const arrayRange = (start: number, stop: number, step: number): number[] =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step,
  );

function getPagesToShow(currentPage: number, totalPages: number): number[] {
  if (totalPages < PAGES_TO_SHOW) {
    return arrayRange(1, totalPages, 1);
  }
  if (currentPage > totalPages - Math.round(PAGES_TO_SHOW / 2)) {
    // show last few pages
    return arrayRange(totalPages - PAGES_TO_SHOW + 1, totalPages, 1);
  }
  if (currentPage <= Math.round(PAGES_TO_SHOW / 2)) {
    // show first few pages
    return arrayRange(1, PAGES_TO_SHOW, 1);
  }
  // show surrounding pages
  return arrayRange(
    currentPage - Math.floor(PAGES_TO_SHOW / 2),
    currentPage + Math.floor(PAGES_TO_SHOW / 2),
    1,
  );
}

export default function PageSelector({
  totalPages,
  currentPage,
  setCurrentPage,
}: PageSelectorProps) {
  const buttonEnabledStyle =
    "block rounded-md bg-indigo-600 px-2 py-1 text-center text-xs font-semibold leading-5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
  const buttonDisabledStyle =
    "block rounded-md bg-slate-300 px-2 py-1 text-center text-xs font-semibold leading-5 text-white shadow-sm tline-offset-2";
  const pageNumberNotSelectedStyle =
    "px-2 border-b border-solid border-b-4 border-slate-300 hover:border-slate-500";
  const pageNumberSelectedStyle =
    "px-2 border-b border-solid border-b-4 border-indigo-600";

  return (
    <div className="flex flex-row gap-x-1.5 justify-between max-w-sm">
      <button
        className={currentPage === 1 ? buttonDisabledStyle : buttonEnabledStyle}
        type="button"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Prev
      </button>
      {currentPage > Math.round(PAGES_TO_SHOW / 2) && (
        <>
          <button
            className={pageNumberNotSelectedStyle}
            type="button"
            onClick={() => setCurrentPage(1)}
          >
            1
          </button>
          <span>...</span>
        </>
      )}
      {getPagesToShow(currentPage, totalPages).map((thisPage) => (
        <button
          type="button"
          className={`${""} ${
            currentPage === thisPage
              ? pageNumberSelectedStyle
              : pageNumberNotSelectedStyle
          }`}
          key={thisPage}
          disabled={currentPage === thisPage}
          onClick={() => setCurrentPage(thisPage)}
        >
          {thisPage}
        </button>
      ))}
      {currentPage <= totalPages - Math.round(PAGES_TO_SHOW / 2) && (
        <>
          <span>...</span>
          <button
            className={pageNumberNotSelectedStyle}
            type="button"
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        className={
          currentPage === totalPages ? buttonDisabledStyle : buttonEnabledStyle
        }
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}
