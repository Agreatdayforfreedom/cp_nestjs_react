import React from 'react';
import { usePagination, DOTS } from '../hooks/usePagination';
import { nanoid } from '@reduxjs/toolkit';
import { RiArrowLeftSFill, RiArrowRightSFill } from 'react-icons/ri';
import { Navigate } from 'react-router-dom';

interface Props {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  limit: number;
}

const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  limit,
}: Props) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    limit,
  });

  if (!paginationRange) return <Navigate to="/" />;
  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };
  return (
    <ul className="flex items-center mt-2 mx-2 justify-end">
      {currentPage > 1 && (
        <li onClick={onPrevious}>
          <RiArrowLeftSFill
            size={28}
            className="cursor-pointer fill-[#7644ff] hover:fill-[#490bf3]"
          />
        </li>
      )}
      {paginationRange.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return (
            <li key={nanoid()} className="pagination-item dots">
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={nanoid()}
            className={`px-1.5 ${
              pageNumber === currentPage &&
              'text-purple-400 font-semibold border border-violet-500 hover:border-purple-600 rounded'
            } hover:cursor-pointer hover:text-purple-600`}
            onClick={() => onPageChange(pageNumber as number)}
          >
            {pageNumber}
          </li>
        );
      })}
      {currentPage < paginationRange.at(-1)! && (
        <li onClick={onNext}>
          <RiArrowRightSFill
            size={28}
            className="cursor-pointer fill-[#7644ff] hover:fill-[#490bf3]"
          />
        </li>
      )}
    </ul>
  );
};

export default Pagination;
