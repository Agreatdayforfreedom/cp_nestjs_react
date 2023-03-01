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
    <div className="h-10">
      <Link to={to} className="absolute">
        <MdOutlineKeyboardArrowLeft
          size={40}
          className="ml-2 hover:-translate-x-1 hover:cursor-pointer transition-transform"
        />
      </Link>
    </div>
  );
};

export default ArrowBack;
