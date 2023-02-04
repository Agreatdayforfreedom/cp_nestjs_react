import React, { PropsWithChildren, ReactChild, ReactNode } from 'react';

interface Props<T> {
  children: ReactNode;
}

const Notification = <T extends Object>({ children }: Props<T>) => {
  return (
    <div
      className="
    fixed
     top-2
       right-2
        bg-[var(--dark-purple)] w-fit p-2 border rounded border-green-600"
    >
      {children}
    </div>
  );
};

export default Notification;
