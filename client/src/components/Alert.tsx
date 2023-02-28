import React, { useEffect, useState } from 'react';

interface Props {
  content: string;
}

const Alert = ({ content }: Props) => {
  return (
    <div
      className="flex items-center my-2 justify-center w-96 h-10 bg-[var(--t-red)] z-50  border-4 border-[var(--t-red)] border-dashed
   mx-auto"
    >
      <p>{content}</p>
    </div>
  );
};

export default Alert;
