import React from 'react';

const SideBar = ({ data }: any) => {
  return (
    <aside className="hidden sm:block mt-12 w-20 border-r border-slate-700">
      {data.profile.username}
    </aside>
  );
};

export default SideBar;
