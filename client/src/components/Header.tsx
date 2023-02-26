import { gql, useQuery, useSubscription } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { IoMdNotifications } from 'react-icons/io';
import { Link, useLocation } from 'react-router-dom';
import { FIND_NOTIFICATIONS, NOTIFICATION_SUB, PROFILE } from '../typedefs';

const Header = ({ data }: any) => {
  const [openNotifications, setOpenNotifications] = useState<boolean>(false);

  const { data: pData } = useQuery(PROFILE);
  const { data: notiData, loading } = useQuery(FIND_NOTIFICATIONS);

  const location = useLocation();
  useSubscription(NOTIFICATION_SUB, {
    variables: {
      userId: pData && pData.profile.id,
    },
    onData({ client, data }) {
      console.log({ data });
      client.cache.modify({
        fields: {
          findNotifications(existing) {
            console.log(existing, data);
            const newNotification = client.cache.writeFragment({
              data: data.data.notificationSub,
              fragment: gql`
                fragment NewNotification on Notification {
                  id
                  __typename
                }
              `,
            });
            return [newNotification, ...existing];
          },
        },
      });
    },
  });
  return (
    <header className="fixed bg-[var(--medium-blue)] z-20 w-full h-12 border-b border-slate-700">
      <div className="flex items-center justify-between h-12 px-2">
        <div className="flex ">
          <Link
            to="/"
            className={`${
              location.pathname === '/' && 'bg-[var(--purple)]'
            } p-1.5 rounded-full inline-block`}
          >
            <AiOutlineHome size={30} />
          </Link>
        </div>
        <div className="relative z-50 flex items-center hover:cursor-pointer  ">
          <span className="text-sm font-semibold text-slate-400">
            {notiData?.findNotifications.length}
          </span>
          <IoMdNotifications
            size={25}
            className="[&+div]:hover:-translate-y-0.5"
            onClick={() => setOpenNotifications((prev) => !prev)}
          />
          <div className="w-3 h-3 bg-red-800 rounded-full absolute border-2 border-[var(--medium-blue)] top-0 right-0 transition-transform"></div>
        </div>
        <Notifications open={openNotifications} data={notiData} />
      </div>
    </header>
  );
};

const Notifications = ({ open, data }: { open: boolean; data: any }) => {
  if (!open) return <></>;
  return (
    <div
      className="
      absolute top-12 shadow shadow-slate-600 right-0 left-0 sm:left-auto sm:right-2
       w-11/12 mx-auto sm:w-64 h-56 bg-[var(--dark-purple)] z-50 "
    >
      {data?.findNotifications.map((noti: any) => (
        <div
          key={nanoid()}
          className={`${
            noti.read ? '' : 'bg-slate-900'
          } flex justify-between border-b text-slate-600 border-slate-700 text-sm p-2.5`}
        >
          <p>{noti.data}</p>
          <button
            title="Click to mark as read"
            onClick={() => console.log('marked as read')}
            className="w-2 h-2 relative bg-blue-700 rounded-full "
          ></button>
        </div>
      ))}
    </div>
  );
};

export default Header;
