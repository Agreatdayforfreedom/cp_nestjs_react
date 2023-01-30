import { useMutation, useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import { Role } from '../../interfaces/enums';
import { Member } from '../../interfaces/interfaces';
// import {Member as MemberModel} from ''
import { FIND_MEMBERS, FIND_PROJECT, REMOVE_MEMBER } from '../../typedefs';

const Members = () => {
  const params = useParams();

  const { data, loading, error } = useQuery(FIND_MEMBERS, {
    variables: {
      projectId: params.id && parseInt(params.id, 10),
    },
  });

  const {
    data: pData,
    loading: pLoading,
    error: pError,
  } = useQuery(FIND_PROJECT, {
    variables: {
      id: params.id && parseInt(params.id, 10),
    },
  });

  const [fetch] = useMutation(REMOVE_MEMBER);

  const handleDelete = (memberId: number) => {
    fetch({
      variables: { memberId, projectId: params.id && parseInt(params.id, 10) },
      update(cache) {
        cache.modify({
          fields: {
            findMembers(existing, { readField }) {
              console.log({ existing });
              return existing.filter(
                (m: any) => readField('id', m) !== memberId,
              );
            },
          },
        });
      },
    });
  };

  if (error) return <span>error</span>;
  if (loading) return <span>loading</span>;
  console.log(pData && pData);
  return (
    <section>
      {data.findMembers.map((member: Member) => (
        <div
          key={nanoid()}
          className="flex justify-between border-t last:border-b border-slate-600 p-3"
        >
          <div>
            <span
              className={`${
                member.role === Role.ADMIN ? 'text-orange-700' : ''
              } font-semibold`}
            >
              {member.role}
            </span>
            {/* <p>{member.id}</p> */}
            <p>{member.user.username}</p>
            <p>{member.user.email}</p>
          </div>
          <div>
            {member.role === Role.ADMIN &&
              member.user.id !== (pData && pData.findOneProject.owner.id) && (
                <>
                  <Button
                    name="delete"
                    color="red"
                    onClick={() => handleDelete(member.id)}
                    className="!hidden sm:!block !m-0 h-fit text-blue-900"
                  />

                  <button
                    className="block sm:hidden"
                    onClick={() => handleDelete(member.id)}
                  >
                    <AiFillDelete className="fill-red-700 hover:fill-red-900" />
                  </button>
                </>
              )}

            <div></div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Members;
