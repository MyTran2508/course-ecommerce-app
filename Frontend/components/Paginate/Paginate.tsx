import React, { useState } from "react";

interface PaginateProps {
  totalPage: number;
  setCurrentPage: (page: number) => void;
  currentPage: number;
}

function Paginate(props: PaginateProps) {
  const { totalPage, setCurrentPage, currentPage } = props;
  const renderPage = () => {
    const items = [];
    for (let i = 0; i < totalPage; i++) {
      items.push(
        <li key={i}>
          <div
            onClick={() => handleChangePage(i + 1)}
            className={`${
              currentPage === i + 1
                ? "text-orange-600 border border-orange-300 bg-orange-50 hover:bg-orange-100 hover:text-orange-700"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 "
            } flex items-center justify-center px-4 h-10 leading-tight  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white hover:cursor-pointer`}
          >
            {i + 1}
          </div>
        </li>
      );
    }
    return items;
  };
  const handleChangePage = (page: number | null, action: string = "") => {
    if (page !== null) {
      setCurrentPage(page);
      return;
    }

    if (action === "NEXT" && currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    } else if (action === "PREV" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div>
      <nav aria-label="Page navigation example">
        <ul className="flex items-center -space-x-px h-10 text-base">
          <li>
            <div
              onClick={() => handleChangePage(null, "PREV")}
              className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-3 h-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </div>
          </li>
          {renderPage()}
          <li>
            <div
              onClick={() => handleChangePage(null, "NEXT")}
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-3 h-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Paginate;
