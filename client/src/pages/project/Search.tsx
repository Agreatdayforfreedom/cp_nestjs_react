import { useMutation, useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { BiCheck } from 'react-icons/bi';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import ArrowBack from '../../components/ArrowBack';
import Button from '../../components/Button';
import { Member, User } from '../../interfaces/interfaces';
import { ADD_MEMBER, FIND_MEMBERS, FIND_USERS } from '../../typedefs';

const Search = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(FIND_USERS);
  const {
    data: membersData,
    loading: membersLoading,
    error: membersError,
  } = useQuery(FIND_MEMBERS, {
    variables: {
      projectId: params.id && parseInt(params.id, 10),
    },
  });
  const [fetch, { data: mData, loading: mLoading, error: mError }] =
    useMutation(ADD_MEMBER);

  useEffect(() => {
    // if (mData) navigate(`/project/${params?.id}/members`);
  }, [mData]);
  const handleClick = (memberId: number) => {
    fetch({
      variables: {
        nextMemberId: memberId,
        projectId: params.id && parseInt(params.id, 10),
      },
      update(cache) {
        cache.modify({
          fields: {
            findMembers(existing) {
              if (mData) return [...existing, ...mData.addMember];
            },
          },
        });
      },
    });
  };

  const userIds = data && data.findUsers.map((user: User) => user.id);
  const memberIds: number[] =
    membersData &&
    membersData.findMembers.map((member: Member) => member.user.id);
  // console.log(memberIds);
  // const isMember = memberIds.

  if (loading) return <span>loading</span>;
  if (error) return <Navigate to="/" />;
  return (
    <div>
      <ArrowBack to="../members" />
      {data &&
        data.findUsers.map((user: any) => (
          <div
            key={nanoid()}
            className="flex justify-between items-center p-3 border-b border-slate-700"
          >
            <div>
              <span className="px-2">{user.username}</span>
              <span className="px-2">{user.email}</span>
            </div>
            {memberIds?.find((id: number) => id === user.id) ? (
              <div className="p-0.5 mx-6 bg-green-600 rounded-full">
                <BiCheck size={25} />
              </div>
            ) : (
              <Button
                name="Add"
                color="blue"
                className="!my-0"
                disabled={mLoading}
                //todo: useRef
                onClick={() => handleClick(user.id)}
              />
            )}
          </div>
        ))}
    </div>
  );
};

export default Search;
