import React from 'react';

const FreezeScreen = () => {
  return (
    <div
      className="
    fixed bg-[var(--t-red)] left-0  flex items-start justify-center text-center opacity-80 w-full h-screen top-0"
    >
      <span className="bg-[var(--blood)] shadow-lg shadow-pink-900/50 text-white font-bold text-2xl mt-10 p-4">
        You has been removed.
      </span>
    </div>
  );
};

export default FreezeScreen;
