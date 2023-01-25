import { nanoid } from '@reduxjs/toolkit';
import React from 'react';

const ShineCard = () => {
  return (
    <div className="render-grad w-[95%] mx-auto border border-slate-700 ">
      {Array.from(Array(5).keys()).map((x) => (
        <CardRender key={nanoid()} />
      ))}
    </div>
  );
};

const CardRender = () => {
  return (
    <div className="bg-transparent h-10 flex items-center justify-between border-b border-slate-700 last:border-none hover:cursor-pointer ">
      <div className="flex items-center">
        <span className="render-grad after:w-10px! h-4 w-12 mx-2 rounded-lg bg-[var(--t-gray)]"></span>
        <span className="render-grad after:w-10px! h-4 w-8 mx-2 rounded-lg bg-[var(--t-gray)]"></span>
      </div>
      <span className="render-grad after:w-10px! h-4 w-24 mx-2 rounded-lg bg-[var(--t-gray)]"></span>
    </div>
  );
};

export default ShineCard;
