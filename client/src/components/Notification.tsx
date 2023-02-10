import React, { PropsWithChildren, ReactChild, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props<T> {
  children: ReactNode;
  color?: 'red' | 'green' | 'yellow';
  to?: string;
}

const Notification = <T extends Object>({
  children,
  color = 'green',
  to = '#',
}: Props<T>) => {
  return (
    <div
      className={`
      z-20
    fixed 
    top-2 right-2 w-fit p-2 bg-[var(--nt-yellow)] notification shadow-yellow-400`}
    >
      <div>
        <Link className="z-10" to={`${to}`}>
          {children}
        </Link>
      </div>
    </div>
  );
};

export default Notification;
