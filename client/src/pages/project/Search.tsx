import { useMutation, useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import { ADD_MEMBER, FIND_USERS } from '../../typedefs';

const Search = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [tr, settr] = useState(false);
  const { data, loading, error } = useQuery(FIND_USERS);

  const [fetch, { data: mData, loading: mLoading, error: mError }] =
    useMutation(ADD_MEMBER);

  useEffect(() => {
    if (mData) navigate(`/project/${params?.id}/members`);
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

  if (loading) return <span>loading</span>;
  if (error) return <Navigate to="/" />;
  return (
    <div>
      {data &&
        data.findUsers.map((user: any) => (
          <div
            key={nanoid()}
            className="flex justify-between p-3 border-b border-slate-700"
          >
            <div>
              <span className="px-2">{user.username}</span>
              <span className="px-2">{user.email}</span>
            </div>
            <Button
              name="Add"
              color="blue"
              //todo: useRef
              success={mData}
              onClick={() => handleClick(user.id)}
            />
          </div>
        ))}
    </div>
  );
};

export default Search;
