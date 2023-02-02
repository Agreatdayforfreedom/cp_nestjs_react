import { useMutation, useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import { AiFillDelete } from 'react-icons/ai';
import { FaBan } from 'react-icons/fa';
import { MdOutlineEditOff } from 'react-icons/md';
import { Link, Navigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Spinner from '../../components/loaders/Spinner';
import { Ban, Role } from '../../interfaces/enums';
import { Member as IMember } from '../../interfaces/interfaces';
// import {Member as MemberModel} from ''
import {
  BAN_MEMBER,
  FIND_MEMBERS,
  PROFILE,
  REMOVE_MEMBER,
} from '../../typedefs';

const Members = () => {
  const params = useParams();

  const { data, loading, error } = useQuery(FIND_MEMBERS, {
    variables: {
      projectId: params.id && parseInt(params.id, 10),
    },
  });

  if (loading) return <Spinner />;
  if (error) return <Navigate to="/" />;
  return (
    <section>
      {data.findMembers.map((member: IMember) => (
        <Member key={nanoid()} member={member} />
      ))}
    </section>
  );
};

export default Members;

interface Props {
  member: IMember;
}

const Member = ({ member }: Props) => {
  const params = useParams();

  // const {
  //   data: mData,
  //   loading: mLoading,
  //   error: mError,
  // } = useQuery(FIND_AUTH_MEMBER, {
  //   variables: {
  //     projectId: params.id && parseInt(params.id, 10),
  //   },
  // });

  const { data, loading, error } = useQuery(PROFILE, {
    variables: {
      id: params.id && parseInt(params.id, 10),
    },
  });

  const [fetchRemove] = useMutation(REMOVE_MEMBER);
  const [fetchBan, { data: banData, loading: banLoading, error: banError }] =
    useMutation(BAN_MEMBER);

  const handleBan = (memberId: number, banType: Ban) => {
    fetchBan({
      variables: {
        memberId,
        banType,
      },
    });
  };

  const handleDelete = (memberId: number) => {
    fetchRemove({
      variables: { memberId, projectId: params.id && parseInt(params.id, 10) },
      update(cache) {
        cache.modify({
          fields: {
            findMembers(existing, { readField }) {
              return existing.filter(
                (m: any) => readField('id', m) !== memberId,
              );
            },
          },
        });
      },
    });
  };

  // console.log(pData);
  if (!data) return <span>nodata</span>;
  if (loading) return <span>nodata</span>;
  if (error) return <span>nodata</span>;
  return (
    <div
      className={`
    ${member.ban === Ban.BANNED && 'bg-[var(--t-red)]'}
    ${member.ban === Ban.PARTIAL_BAN && 'bg-[var(--t-orange)]'}
     flex
      justify-between
       border-t last:border-b border-slate-600 p-3`}
    >
      <div>
        <span
          className={`${
            member.role === Role.ADMIN ? 'text-orange-700' : ''
          } font-semibold`}
        >
          {member.role} {member.ban}
          {member.user.id === data?.profile.id && (
            <span className="text-sm px-1 text-slate-400">(you)</span>
          )}
        </span>
        <div>{member.user.username}</div>
        <p>{member.user.email}</p>
      </div>
      <div>
        {member.role !== Role.ADMIN &&
          data.profile.currentProjectMember.role === Role.ADMIN && (
            <>
              <div className="  flex items-center py-2">
                <button onClick={() => handleBan(member.id, Ban.BANNED)}>
                  <FaBan
                    className={`
                  ${
                    member.ban === Ban.BANNED && 'fill-red-600 '
                  } mx-1 hover:cursor-pointer hover:fill-slate-500`}
                  />
                </button>
                <button onClick={() => handleBan(member.id, Ban.PARTIAL_BAN)}>
                  <MdOutlineEditOff
                    size={20}
                    className={`
                  ${
                    member.ban === Ban.PARTIAL_BAN && 'fill-red-600 '
                  } mx-1 hover:cursor-pointer hover:fill-slate-500`}
                  />
                </button>
              </div>
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
      </div>
    </div>
  );
};
