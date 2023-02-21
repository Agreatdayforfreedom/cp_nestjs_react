import { gql, useMutation, useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { BiCheck } from 'react-icons/bi';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import ArrowBack from '../../components/ArrowBack';
import Button from '../../components/Button';
import ShineCard from '../../components/loaders/ShineCard';
import Spinner from '../../components/loaders/Spinner';
import { Member, User } from '../../interfaces/interfaces';
import {
  ADD_MEMBER,
  FIND_MEMBERS,
  FIND_REQUESTS,
  FIND_USERS,
} from '../../typedefs';

const Search = () => {
  const params = useParams();

  const { data, loading, error } = useQuery(FIND_USERS);
  const { data: membersData } = useQuery(FIND_MEMBERS, {
    variables: {
      projectId: params.id && parseInt(params.id, 10),
    },
  });
  const [fetch] = useMutation(ADD_MEMBER);

  const handleClick = (memberId: number) => {
    fetch({
      variables: {
        nextMemberId: memberId,
        projectId: params.id && parseInt(params.id, 10),
      },
      update(cache, { data: { addMember } }) {
        cache.modify({
          fields: {
            findMembers(existing) {
              const newMember = cache.writeFragment({
                data: addMember,
                fragment: gql`
                  fragment NewMember on Member {
                    id
                    __typename
                  }
                `,
              });
              return [...existing, newMember];
            },
          },
        });
      },
    });
  };

  const memberIds: number[] =
    membersData &&
    membersData.findMembers.map((member: Member) => member.user.id);

  if (loading) return <Spinner />;
  if (error) return <Navigate to="/" />;
  //todo: a page for requests
  return (
    <div>
      <ArrowBack to="../members" />
      <h2>Requests</h2>
      <Requests />

      <h2>Find a user</h2>
      {data &&
        data.findUsers.map((user: any) => (
          <div
            key={nanoid()}
            className="flex justify-between items-center p-3 border-t last:border-y border-slate-700"
          >
            <div className="flex items-center">
              <img
                src={user.avatar}
                alt={`${user.username} avatar`}
                className="w-8 h-8 rounded-full mr-2 text-sm"
              />
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
                // disabled={mLoading}
                onClick={() => handleClick(user.id)}
              />
            )}
          </div>
        ))}
    </div>
  );
};

//todo: accept and reject queries
const Requests = () => {
  const params = useParams();
  const { data } = useQuery(FIND_REQUESTS, {
    variables: {
      projectId: params.id && parseInt(params.id, 10),
    },
  });
  if (data) console.log(data);
  return (
    <p>
      {data &&
        data.findRequests.map((request: any) => (
          <div
            key={nanoid()}
            className="flex justify-between items-center p-3 border-t last:border-y border-slate-700"
          >
            <div className="flex items-center">
              <img
                src={request.user.avatar}
                alt={`${request.user.username} avatar`}
                className="w-8 h-8 rounded-full mr-2 text-sm"
              />
              <span className="px-2">{request.user.username}</span>
              <span className="px-2">{request.user.email}</span>
            </div>

            <div className="flex">
              <button className="px-1.5 text-green-600 hover:text-green-800 transition-colors">
                Accept
              </button>
              <button className="px-1.5 text-red-600 hover:text-red-800 transition-colors">
                Reject
              </button>
            </div>
          </div>
        ))}
    </p>
  );
};

export default Search;
