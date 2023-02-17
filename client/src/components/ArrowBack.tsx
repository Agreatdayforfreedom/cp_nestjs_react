import React from 'react';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { Link } from 'react-router-dom';

const ArrowBack = ({
  to,
  className = '',
}: {
  to: string;
  className?: string;
}) => {
  return (
    <Link to={to} className={className}>
      <MdOutlineKeyboardArrowLeft
        size={40}
        className="ml-2 hover:-translate-x-1 hover:cursor-pointer transition-transform"
      />
    </Link>
  );
};

export default ArrowBack;
