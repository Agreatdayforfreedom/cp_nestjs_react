import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="h-screen bar">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
