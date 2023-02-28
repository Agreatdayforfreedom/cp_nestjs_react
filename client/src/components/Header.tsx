import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { IoMdNotifications } from 'react-icons/io';
import { Link, useLocation } from 'react-router-dom';
import {
  FIND_NOTIFICATIONS,
  MARK_ALL_AS_READ,
  MARK_AS_READ,
  NOTIFICATION_SUB,
  PROFILE,
} from '../typedefs';
import moment from 'moment';

const Header = ({ data }: any) => {
  const [openNotifications, setOpenNotifications] = useState<boolean>(false);
  const [someNoRead, setSomeNoRead] = useState(false);

  const { data: pData } = useQuery(PROFILE);
  const { data: notiData, loading } = useQuery(FIND_NOTIFICATIONS);

  useEffect(() => {
    if (notiData) {
      setSomeNoRead(notiData.findNotifications.some((x: any) => x.read));
    }
  }, [notiData]);

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
          {notiData?.findNotifications.length > 0 ? (
            <span className="text-sm font-semibold text-slate-400">
              {notiData?.findNotifications.length}
            </span>
          ) : undefined}
          <IoMdNotifications
            size={25}
            className="[&+div]:hover:-translate-y-0.5"
            onClick={() => setOpenNotifications((prev) => !prev)}
          />

          {notiData?.findNotifications.some((x: any) => !x.read) ? (
            <div className="w-3 h-3 bg-red-800 rounded-full absolute border-2 border-[var(--medium-blue)] top-0 right-0 transition-transform"></div>
          ) : undefined}
        </div>
        <Notifications open={openNotifications} data={notiData} />
      </div>
    </header>
  );
};
//todo: fixed alert

const Notifications = ({ open, data }: { open: boolean; data: any }) => {
  //todo: reset removed state once the user click 'go to home'

  const [fetch] = useMutation(MARK_ALL_AS_READ);

  const markAllAsRead = () => {
    fetch({
      update(cache, { data: { markAllAsRead } }) {
        const { findNotifications }: any = cache.readQuery({
          query: FIND_NOTIFICATIONS,
        });
        for (let i = 0; i < findNotifications?.length; i++) {
          cache.writeQuery({
            query: gql`
              query MarkAsRead($notificationId: Int!) {
                markAsRead(notificationId: $notificationId) {
                  id
                  read
                }
              }
            `,
            data: {
              markAsRead: {
                __typename: findNotifications[i].__typename,
                id: findNotifications[i].id,
                read: true,
                user: {
                  id: markAllAsRead, //markAllAsRead returns the userId
                },
              },
            },
          });
        }
      },
    });
  };

  if (!open) return <></>;
  return (
    <div
      className="
        absolute top-12 shadow shadow-slate-600 right-0 left-0 sm:left-auto sm:right-2
         w-11/12 mx-auto sm:w-80 bg-[var(--dark-purple)] z-50 "
    >
      <header className="flex items-center justify-between py-1 px-2 border-b-2 border-slate-700 ">
        <h2 className="font-bold text-slate-400">Inbox</h2>
        <button className="text-sm text-blue-600" onClick={markAllAsRead}>
          Mark all as read
        </button>
      </header>
      <div className="overflow-scroll no-scroll-style w-full h-96">
        {data?.findNotifications.map((noti: any) => (
          <NotificationCard key={nanoid()} noti={noti} />
        ))}
      </div>
    </div>
  );
};

const NotificationCard = ({ noti }: any) => {
  // const [data, setData] = useState(noti.data ? noti.data : undefined);
  let data = noti.data ? noti.data : '';
  const [fetch] = useMutation(MARK_AS_READ);

  const markAsRead = (id: number) => {
    fetch({
      variables: {
        notificationId: id,
      },
    });
  };

  useEffect(() => {
    if (data) {
      if (data.includes(':')) {
        data.split(':')[1];
      }
    }
  }, []);
  return (
    <div
      key={nanoid()}
      className={`${noti.read ? '' : 'bg-slate-900'} ${
        noti.type === 'REMOVED' ? 'bg-red-900/20' : ''
      } flex flex-col justify-between items-end border-b text-slate-600 border-slate-700 text-sm p-2.5`}
    >
      <div className="flex w-full items-center justify-between">
        <span
          className={`${
            noti.type === 'REJECTED' ||
            noti.type === 'BANNED' ||
            noti.type === 'REMOVED'
              ? 'text-red-700'
              : noti.type === 'PARTIAL_BAN'
              ? 'text-orange-700'
              : 'text-green-700'
          }`}
        >
          {noti.type}
        </span>
        <div className="flex items-center">
          <span className="text-slate-500 px-2">
            {moment(new Date(noti.created_at), 'YYYYMMDD').fromNow()}
          </span>
          {noti.read ? undefined : (
            <button
              title="Click to mark as read"
              onClick={() => markAsRead(noti.id)}
              className="w-2 h-2 my-2 relative bg-blue-700 rounded-full "
            ></button>
          )}
        </div>
      </div>
      <p className="w-full text-start">
        {noti.data.split(':')[0]}
        <span className="font-bold underline">{noti.data.split(':')[1]}</span>
        {noti.data.split(':')[2]}
      </p>
    </div>
  );
};

export default Header;
