import React, { PropsWithChildren, ReactChild, ReactNode } from 'react';

interface Props<T> {
  children: ReactNode;
  color?: 'red' | 'green' | 'yellow';
}

const Notification = <T extends Object>({
  children,
  color = 'green',
}: Props<T>) => {
  return (
    <div
      className={`
    fixed top-2 right-2 w-fit p-2 bg-[var(--nt-yellow)] notification shadow-yellow-400`}
    >
      {children}
    </div>
  );
};

export default Notification;
